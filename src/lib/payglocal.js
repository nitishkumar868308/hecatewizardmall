import { generateJWEAndJWS } from "payglocal-js-client";

export async function createPayGlocalTokens(payload) {
    const tokens = await generateJWEAndJWS({
        payload,
        publicKey: process.env.PAYGLOCAL_PUBLIC_KEY.replace(/\\n/g, "\n"),
        privateKey: process.env.PAYGLOCAL_PRIVATE_KEY.replace(/\\n/g, "\n"),
        merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
        privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
        publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID,
    });

    return tokens; // { jweToken, jwsToken }
}
