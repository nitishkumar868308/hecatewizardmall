import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const form = await req.formData();

        const txnId = form.get("txnid");
        const status = form.get("status")?.toLowerCase();
        const baseUrl = new URL(req.url).origin;

        if (!txnId) {
            return new Response("Transaction ID missing", { status: 400 });
        }

        const adjustment = await prisma.order_adjustments.findFirst({
            where: { paymentTxnId: txnId },
        });

        if (!adjustment) {
            return new Response("Adjustment not found", { status: 404 });
        }

        if (status === "success") {
            await prisma.order_adjustments.update({
                where: { id: adjustment.id },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                },
            });

            console.log(`Adjustment ${txnId} marked as PAID`);
        }

        const redirectPath = `/adjustment-payment-success?txnId=${txnId}`;

        return Response.redirect(`${baseUrl}${redirectPath}`);

    } catch (err) {
        console.error("PayU Adjustment Success Error:", err);
        return new Response("Server Error", { status: 500 });
    }
}