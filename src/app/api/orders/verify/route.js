// app/api/orders/verify/route.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Webhook body:", JSON.stringify(body, null, 2));

        // ✅ Support both sandbox & live payloads
        const orderNumber = body.order_id || body.data?.order?.order_id;
        const paymentStatus = body.payment?.payment_status || body.data?.payment?.payment_status;
        const paymentMethod = body.payment?.payment_method || body.data?.payment?.payment_method;
        const customerEmail = body.customer_email || body.data?.customer_details?.customer_email;
        console.log("orderNumber", orderNumber)
        console.log("paymentStatus", paymentStatus)
        if (!orderNumber) {
            console.error("Missing orderNumber");
            return new Response(JSON.stringify({ message: "Missing orderNumber" }), { status: 400 });
        }

        // 1️⃣ Fetch order from DB
        const order = await prisma.orders.findFirst({
            where: { orderNumber },
            include: { user: true },
        });

        if (!order) {
            console.error("Order not found:", orderNumber);
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // 2️⃣ Determine payment success
        const isPaid = ["PAID", "SUCCESS"].includes((paymentStatus || "").toUpperCase());

        // 3️⃣ Update DB with payment info
        const updatedOrder = await prisma.orders.update({
            where: { id: order.id },
            data: {
                paymentStatus: isPaid ? "PAID" : "FAILED",
                status: isPaid ? "PROCESSING" : "CANCELLED",
                paymentMethod: JSON.stringify(paymentMethod),
            },
        });
        console.log("updatedOrder" , updatedOrder)
        console.log("Updated Order Payment Status:", updatedOrder.paymentStatus);

        // 4️⃣ Create Envia shipment if payment success
        if (isPaid) {
            try {
                const enviaResponse = await fetch("https://sandbox.envia.com/api/v1/shipments", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.ENVIA_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        order_id: updatedOrder.orderNumber,
                        customer_name: updatedOrder.shippingName,
                        customer_phone: updatedOrder.shippingPhone,
                        shipping_address: updatedOrder.shippingAddress,
                        shipping_city: updatedOrder.shippingCity,
                        shipping_state: updatedOrder.shippingState,
                        shipping_pincode: updatedOrder.shippingPincode,
                        items: updatedOrder.items,
                    }),
                });

                const trackingData = await enviaResponse.json();
                console.log("Envia shipment created:", trackingData);

                if (trackingData.tracking_number) {
                    await prisma.orders.update({
                        where: { id: updatedOrder.id },
                        data: { trackingNumber: trackingData.tracking_number },
                    });
                }
            } catch (err) {
                console.error("Envia shipment creation failed:", err);
            }
        }

        // 5️⃣ Send emails if PAID
        if (isPaid) {
            try {
                await sendMail({
                    to: "kumarnitish4384@gmail.com",
                    subject: `Order Confirmed - ${updatedOrder.orderNumber}`,
                    html: orderConfirmationTemplate({
                        name: updatedOrder.shippingName,
                        orderId: updatedOrder.orderNumber,
                        total: updatedOrder.totalAmount,
                    }),
                });
                console.log("Customer email sent ✅");
            } catch (err) {
                console.error("Customer email failed:", err);
            }

            try {
                await sendMail({
                    to: process.env.ADMIN_EMAIL || "admin@yourshop.com",
                    subject: `New Order Placed - ${updatedOrder.orderNumber}`,
                    html: `<p>New order by ${updatedOrder.shippingName} (${updatedOrder.shippingPhone})</p>
                   <p>Order ID: ${updatedOrder.orderNumber}</p>
                   <p>Total: ₹${updatedOrder.totalAmount}</p>`,
                });
                console.log("Admin email sent ✅");
            } catch (err) {
                console.error("Admin email failed:", err);
            }
        }


        return new Response(JSON.stringify({ message: "Payment verified", updatedOrder }), { status: 200 });
    } catch (error) {
        console.error("Verification failed:", error.message || error);
        return new Response(
            JSON.stringify({ message: "Verification failed", error: error.message || error }),
            { status: 500 }
        );
    }
}
