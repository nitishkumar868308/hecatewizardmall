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
            include: { order: true },
        });

        if (!adjustment) {
            return new Response("Adjustment not found", { status: 404 });
        }

        // Only mark failed if actually failed
        if (status === "failure" || status === "usercancelled") {
            await prisma.order_adjustments.update({
                where: { id: adjustment.id },
                data: {
                    status: "CANCELLED",
                },
            });

            console.log(`Adjustment ${txnId} marked as CANCELLED`);
        }

        // Redirect user to frontend failure page
        const redirectPath = `/adjustment-payment-failed?txnId=${txnId}`;

        return Response.redirect(`${baseUrl}${redirectPath}`);

    } catch (err) {
        console.error("PayU Adjustment Failure Error:", err);
        return new Response("Server Error", { status: 500 });
    }
}