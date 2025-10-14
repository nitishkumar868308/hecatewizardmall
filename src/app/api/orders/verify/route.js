// app/api/orders/verify/route.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Verification body:", body);

        const orderNumber = body.order_id || body.orderNumber;
        if (!orderNumber) {
            return new Response(JSON.stringify({ message: "Missing orderNumber" }), { status: 400 });
        }

        const order = await prisma.orders.findFirst({
            where: { orderNumber },
            include: { user: true },
        });

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        let isPaid = false;

        // ✅ 1. Check order_status
        const cfOrderStatus = (body.order_status || "").toUpperCase();

        // ✅ 2. Check payments array
        const cfPayments = body.payments || [];
        const cfPaymentStatus = Array.isArray(cfPayments) && cfPayments.length ? cfPayments[0]?.status : "";

        // ✅ 3. Check entity_simulation (sandbox)
        const cfPaymentSimulationStatus = body.entity_simulation?.payment_status || "";

        // ✅ 4. Check entity-level status (some webhooks)
        const cfEntityPaymentStatus = (body.payment_status || "").toUpperCase();

        console.log({ cfOrderStatus, cfPayments, cfPaymentStatus, cfPaymentSimulationStatus, cfEntityPaymentStatus });

        if (["PAID", "ACTIVE", "COMPLETED", "SUCCESS"].includes(cfOrderStatus)) isPaid = true;
        else if (["PAID", "SUCCESS"].includes((cfPaymentStatus || "").toUpperCase())) isPaid = true;
        else if (["SUCCESS"].includes((cfPaymentSimulationStatus || "").toUpperCase())) isPaid = true;
        else if (["PAID", "SUCCESS"].includes(cfEntityPaymentStatus)) isPaid = true;

        // Update DB
        const updatedOrder = await prisma.orders.update({
            where: { id: order.id },
            data: {
                paymentStatus: isPaid ? "PAID" : "FAILED",
                status: isPaid ? "PROCESSING" : "CANCELLED",
            },
        });

        console.log("Updated order:", updatedOrder);

        // Send emails if PAID
        if (isPaid) {
            if (updatedOrder.user?.email) {
                await sendMail({
                    to: updatedOrder.user.email,
                    subject: `Order Confirmed - ${updatedOrder.orderNumber}`,
                    html: orderConfirmationTemplate({
                        name: updatedOrder.shippingName,
                        orderId: updatedOrder.orderNumber,
                        total: updatedOrder.totalAmount,
                    }),
                });
            }

            await sendMail({
                to: process.env.ADMIN_EMAIL || "admin@yourshop.com",
                subject: `New Order Placed - ${updatedOrder.orderNumber}`,
                html: `
          <p>New order by ${updatedOrder.shippingName} (${updatedOrder.shippingPhone})</p>
          <p>Order ID: ${updatedOrder.orderNumber}</p>
          <p>Total: ₹${updatedOrder.totalAmount}</p>
        `,
            });
        }

        return new Response(JSON.stringify({ message: "Payment verified", updatedOrder }), { status: 200 });
    } catch (error) {
        console.error("Verification failed:", error.message);
        return new Response(JSON.stringify({ message: "Verification failed", error: error.message }), { status: 500 });
    }
}
