import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import crypto from "crypto";

const prisma = new PrismaClient();

/* =========================
   GET - All adjustments
========================= */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return Response.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }

        const adjustments = await prisma.order_adjustments.findMany({
            where: {
                orderId: Number(orderId),   // 👈 IMPORTANT
            },
            orderBy: { createdAt: "desc" },
        });

        return Response.json({
            message: "Order adjustments fetched successfully",
            data: adjustments,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch adjustments", error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   POST - Create Adjustment
   (Admin creates & send mail)
========================= */
export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, adjustmentType, impact, amount, reason, isManual,
            manualType, } = body;

        if (!orderId || !adjustmentType || !impact || !amount) {
            return Response.json(
                { message: "Required fields missing" },
                { status: 400 }
            );
        }

        const order = await prisma.orders.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        const txnId = `ADJ_${order.id}_${Date.now()}`;

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        const adjustment = await prisma.order_adjustments.create({
            data: {
                orderId,
                adjustmentType,
                impact,
                amount,
                reason,
                isManual,
                manualType,
                paymentTxnId: txnId,
                expiresAt: expiresAt
            },
        });

        // ============================
        // ⭐ PAYU HASH GENERATION
        // ============================

        const key = process.env.PAYU_KEY;
        const salt = process.env.PAYU_SALT;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const amountNumber = Number(amount);
        const firstname = order.user.name;
        const email = order.user.email;
        const phone = order.user.phone;

        const productInfo = "Order Adjustment Payment";

        const hashString =
            `${key}|${txnId}|${amountNumber}|${productInfo}|${firstname}|${email}|||||||||||${salt}`;

        const hash = crypto
            .createHash("sha512")
            .update(hashString)
            .digest("hex");

        const payuURL =
            process.env.PAYU_MODE === "production"
                ? "https://secure.payu.in/_payment"
                : "https://test.payu.in/_payment";

        // ============================
        // ⭐ CREATE AUTO PAY LINK
        // ============================

        const paymentLink = `${baseUrl}/api/adjustments/payu-redirect?txnId=${txnId}`;

        // Send Email
        await sendMail({
            to: order.user.email,
            subject: "Additional Payment Required",
            html: `
                <h2>Additional Payment Required</h2>
                <p>Order Number: ${order.orderNumber}</p>
                <p>Amount: ₹${amountNumber}</p>
                <br/>
                <a href="${paymentLink}"
                   style="padding:12px 24px;background:black;color:white;text-decoration:none;border-radius:6px;">
                   Pay Now
                </a>
            `,
        });

        return Response.json({
            message: "Adjustment created & PayU payment link sent",
            data: adjustment,
        });

    } catch (error) {
        return Response.json(
            { message: "Failed to create adjustment", error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   PUT - Mark As Paid (Webhook)
========================= */
export async function PUT(req) {
    try {
        const body = await req.json();
        const { paymentTxnId } = body;

        if (!paymentTxnId) {
            return Response.json(
                { message: "Transaction ID required" },
                { status: 400 }
            );
        }

        const adjustment = await prisma.order_adjustments.findUnique({
            where: { paymentTxnId },
        });

        if (!adjustment) {
            return Response.json(
                { message: "Adjustment not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.order_adjustments.update({
            where: { paymentTxnId },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });

        return Response.json({
            message: "Payment marked as PAID",
            data: updated,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to update payment", error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   DELETE - Cancel Adjustment
========================= */
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return Response.json(
                { message: "Adjustment ID required" },
                { status: 400 }
            );
        }

        const updated = await prisma.order_adjustments.update({
            where: { id },
            data: { status: "CANCELLED" },
        });

        return Response.json({
            message: "Adjustment cancelled successfully",
            data: updated,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to cancel adjustment", error: error.message },
            { status: 500 }
        );
    }
}