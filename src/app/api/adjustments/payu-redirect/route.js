import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const txnId = searchParams.get("txnId");

    const adjustment = await prisma.order_adjustments.findUnique({
        where: { paymentTxnId: txnId },
        include: {
            order: { include: { user: true } }
        }
    });

    if (!adjustment) {
        return new Response("Invalid transaction", { status: 404 });
    }

    if (adjustment.paidAt) {
        return new Response("Payment already completed", { status: 400 });
    }

    if (adjustment.expiresAt && new Date() > new Date(adjustment.expiresAt)) {
        return new Response("Payment link expired", { status: 400 });
    }

    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const amount = Number(adjustment.amount);
    const firstname = adjustment.order.user.name;
    const email = adjustment.order.user.email;
    const phone = adjustment.order.user.phone;

    const productInfo = "Order Adjustment Payment";

    const hashString =
        `${key}|${txnId}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${salt}`;

    const hash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

    const payuURL =
        process.env.PAYU_MODE === "production"
            ? "https://secure.payu.in/_payment"
            : "https://test.payu.in/_payment";

    return new Response(`
        <html>
            <body onload="document.forms[0].submit()">
                <form action="${payuURL}" method="post">
                    <input type="hidden" name="key" value="${key}" />
                    <input type="hidden" name="txnid" value="${txnId}" />
                    <input type="hidden" name="amount" value="${amount}" />
                    <input type="hidden" name="productinfo" value="${productInfo}" />
                    <input type="hidden" name="firstname" value="${firstname}" />
                    <input type="hidden" name="email" value="${email}" />
                    <input type="hidden" name="phone" value="${phone}" />
                    <input type="hidden" name="surl" value="${baseUrl}/api/payu/adjustment-success" />
                    <input type="hidden" name="furl" value="${baseUrl}/api/payu/adjustment-failure" />
                    <input type="hidden" name="hash" value="${hash}" />
                </form>
            </body>
        </html>
    `, {
        headers: { "Content-Type": "text/html" }
    });
}