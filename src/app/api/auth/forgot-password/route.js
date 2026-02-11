import { sendMail } from "@/lib/mailer";
import prisma from '@/lib/prisma';
import { forgetpasswordLink } from "@/lib/templates/forget-passwordLink";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
        }

        // check user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // generate reset token (random string ya JWT)
        const resetToken = Math.random().toString(36).substring(2, 10);
        // const expires = new Date(Date.now() + 3600 * 1000);
        const expires = new Date(Date.now() + 60 * 1000);
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${email}`;

        await prisma.passwordReset.create({
            data: { email, token: resetToken, expires },
        });

        await sendMail({
            to: email,
            subject: "Reset your password",
            html: forgetpasswordLink({ resetLink }), // Calling the template function
        });

        return new Response(JSON.stringify({ message: "Password reset link sent" }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
