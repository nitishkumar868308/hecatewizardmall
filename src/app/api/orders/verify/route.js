import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer"; // your mail utility

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const data = await req.json();
        console.log("Cashfree Webhook Data:", data);

        const { order_id, order_status, payment_method, payment_id } = data;

        if (!order_id) {
            return new Response(JSON.stringify({ message: "Missing order_id" }), { status: 400 });
        }

        // 🟢 Handle payment success
        if (order_status === "PAID") {
            const updatedOrder = await prisma.orders.update({
                where: { orderNumber: order_id },
                data: {
                    paymentStatus: "PAID",
                    status: "COMPLETED",
                    paymentMethod: payment_method || null,
                    transactionId: payment_id || null,
                },
                include: {
                    user: true, // assuming relation exists for email
                },
            });

            console.log("✅ Payment success, order updated:", updatedOrder);

            // 📧 Send confirmation email
            await sendMail({
                to: updatedOrder.user?.email,
                subject: `Order Confirmed - ${updatedOrder.orderNumber}`,
                html: orderConfirmationTemplate({
                    name: updatedOrder.shippingName,
                    orderId: updatedOrder.orderNumber,
                    total: updatedOrder.totalAmount,
                }),
            });

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        // 🔴 Handle payment failed or pending
        if (["FAILED", "PENDING", "CANCELLED"].includes(order_status)) {
            // Delete order
            await prisma.orders.deleteMany({
                where: { orderNumber: order_id },
            });

            console.log("❌ Order deleted due to failed/pending payment:", order_id);

            return new Response(
                JSON.stringify({ message: `Order deleted - status: ${order_status}` }),
                { status: 200 }
            );
        }

        return new Response(JSON.stringify({ message: "Unhandled payment status" }), { status: 400 });
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return new Response(JSON.stringify({ message: "Webhook failed", error: error.message }), {
            status: 500,
        });
    }
}
