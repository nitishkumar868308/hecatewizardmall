// /api/auth/validate-token/route.js
import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const token = url.searchParams.get("token");

        if (!email || !token) {
            return new Response(JSON.stringify({ valid: false, message: "Invalid link" }), { status: 400 });
        }

        const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

        if (!resetRecord || resetRecord.email !== email) {
            return new Response(JSON.stringify({ valid: false, message: "Invalid token" }), { status: 400 });
        }

        if (resetRecord.expires < new Date()) {
            return new Response(JSON.stringify({ valid: false, message: "Token expired" }), { status: 400 });
        }

        return new Response(JSON.stringify({ valid: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ valid: false, message: "Something went wrong" }), { status: 500 });
    }
}
