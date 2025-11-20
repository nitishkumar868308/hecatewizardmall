// export async function POST(req) {
//     try {
//         const form = await req.formData();
//         const orderId = form.get("txnid");
//         const status = form.get("status");

//         const baseUrl = new URL(req.url).origin;

//         if (status === "success") {
//             return Response.redirect(
//                 `${baseUrl}/payment-success?order_id=${orderId}`
//             );
//         } else {
//             return Response.redirect(
//                 `${baseUrl}/payment-failed?order_id=${orderId}`
//             );
//         }
//     } catch (err) {
//         return new Response("Error", { status: 500 });
//     }
// }


import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";
import { orderConfirmationTemplateAdmin } from "@/lib/templates/orderConfirmationTemplateAdmin";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const form = await req.formData();
        const orderId = form.get("txnid");
        const status = form.get("status");

        if (!orderId) return new Response("Order ID missing", { status: 400 });

        const orderRecord = await prisma.orders.findUnique({ where: { orderNumber: orderId } });
        if (!orderRecord) return new Response("Order not found", { status: 404 });

        if (status === "success") {
            // ✅ Update order as confirmed
            await prisma.orders.update({
                where: { id: orderRecord.id },
                data: { status: "PENDING", paymentStatus: "PAID" },
            });

            // ✅ Send confirmation email to user
            // await sendMail({
            //     to: orderRecord.billingEmail || "example@gmail.com",
            //     subject: `Order Confirmation - ${orderId}`,
            //     html: orderConfirmationTemplate(orderRecord),
            // });

            // ✅ Send notification email to admin
            // await sendMail({
            //     to: process.env.ADMIN_EMAIL,
            //     subject: `New Order Received - ${orderId}`,
            //     html: orderConfirmationTemplateAdmin(orderRecord),
            // });

            const baseUrl = new URL(req.url).origin;
            return Response.redirect(`${baseUrl}/payment-success?order_id=${orderId}`);
        } else {
            // ❌ If status is anything else, delete the order
            await prisma.orders.delete({ where: { id: orderRecord.id } });

            const baseUrl = new URL(req.url).origin;
            return Response.redirect(`${baseUrl}/payment-failed?order_id=${orderId}`);
        }
    } catch (err) {
        console.error("PayU Success Handler Error:", err);
        return new Response("Server Error", { status: 500 });
    }
}
