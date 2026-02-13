import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";
import { orderConfirmationTemplateAdmin } from "@/lib/templates/orderConfirmationTemplateAdmin";

export async function POST(req) {
    try {

        const rawBody = await req.text();

        let glToken = rawBody.includes("x-gl-token=")
            ? rawBody.split("x-gl-token=")[1]
            : rawBody.trim();

        if (!glToken) {
            return new Response("Token missing", { status: 400 });
        }

        const tokenParts = glToken.split(".");
        const base64UrlPayload = tokenParts[1];

        const decodedString = Buffer
            .from(
                base64UrlPayload.replace(/-/g, "+").replace(/_/g, "/"),
                "base64"
            )
            .toString("utf-8");

        const paymentData = JSON.parse(decodedString);
        const { status, merchantTxnId } = paymentData;

        console.log("PayGlocal Callback:", paymentData);

        const orderRecord = await prisma.orders.findUnique({
            where: { orderNumber: merchantTxnId },
            include: { user: true }
        });
        console.log("orderRecord", orderRecord)

        if (!orderRecord) {
            return new Response("Order not found", { status: 404 });
        }

        // 🔒 Duplicate callback protection
        if (orderRecord.paymentStatus === "PAID") {
            return new Response("Already processed", { status: 200 });
        }

        if (status === "SENT_FOR_CAPTURE") {

            // 1️⃣ Update payment status
            await prisma.orders.update({
                where: { orderNumber: merchantTxnId },
                data: { paymentStatus: "PAID" }
            });

            // 2️⃣ Clear Cart
            await prisma.cart.updateMany({
                where: {
                    userId: orderRecord.userId,
                    is_buy: false
                },
                data: { is_buy: true }
            });

            // 3️⃣ Send User Mail
            await sendMail({
                to: orderRecord.user.email,
                subject: "Order Confirmation",
                html: orderConfirmationTemplate({
                    shippingName: orderRecord.shippingName,
                    orderId: orderRecord.orderNumber,
                    total: orderRecord.totalAmount,
                    currency: orderRecord.paymentCurrency || "₹",
                    downloadLink: `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${orderRecord.orderNumber}`
                })
            });

            // 4️⃣ Send Admin Mail
            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `New Order Received - ${orderRecord.orderNumber}`,
                html: orderConfirmationTemplateAdmin({
                    orderId: orderRecord.orderNumber,
                    total: orderRecord.totalAmount,
                    currency: orderRecord.paymentCurrency || "₹",
                }),
            });

            return Response.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?order_id=${merchantTxnId}`
            );
        }

        // ❌ Payment Failed
        await prisma.orders.update({
            where: { orderNumber: merchantTxnId },
            data: { paymentStatus: "FAILED" }
        });

        return Response.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?order_id=${merchantTxnId}`
        );

    } catch (error) {
        console.error("PayGlocal callback error:", error);
        return new Response("Server error", { status: 500 });
    }
}
