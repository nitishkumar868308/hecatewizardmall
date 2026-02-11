// /api/auth/reset-password/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { email, token, password } = await req.json();

        if (!email || !token || !password) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

        if (!resetRecord || resetRecord.email !== email) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 400 });
        }

        // ✅ Check expiry
        if (resetRecord.expires < new Date()) {
            return new Response(JSON.stringify({ message: "Token expired" }), { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

        // Delete token
        await prisma.passwordReset.delete({ where: { token } });

        return new Response(JSON.stringify({ message: "Password reset successfully" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
