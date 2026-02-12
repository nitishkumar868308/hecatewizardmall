import { NextResponse } from "next/server";
import { generateJWEAndJWS } from "payglocal-js-client";

export async function POST(req) {
    try {
        const body = await req.json();

        const payload = {
            merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
            merchantTxnId: body.orderId,
            amount: body.amount,
            currency: "INR",
            returnUrl: "http://localhost:3000/payment-success",
            notifyUrl: "http://localhost:3000/api/payglocal/webhook",
        };

        const { jweToken, jwsToken } = await generateJWEAndJWS({
            payload,
            publicKey: process.env.PAYGLOCAL_PUBLIC_KEY,
            privateKey: process.env.PAYGLOCAL_PRIVATE_KEY,
            merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
            privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
            publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID,
        });

        const response = await fetch("https://uatapi.payglocal.in/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                encryptedRequest: jweToken,
                signature: jwsToken,
            }),
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Payment Error:", error);
        return NextResponse.json({ error: "Payment Failed" }, { status: 500 });
    }
}
