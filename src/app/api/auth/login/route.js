import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { setSession } from "@/lib/session";

export const POST = async (req) => {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
        }

        // Save session in cookies
        setSession(user);

        return new Response(
            JSON.stringify({
                message: "Login successful",
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
