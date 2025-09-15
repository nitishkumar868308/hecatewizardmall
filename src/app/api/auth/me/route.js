import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export const GET = async (req) => {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        console.log("cookieHeader", cookieHeader)
        const match = cookieHeader.match(/session=([^;]+)/);
        console.log("match", match)
        const token = match ? match[1] : null;
        console.log("token", token)

        if (!token) {
            return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
        }

        const session = verifyToken(token);
        console.log("session", session)
        if (!session) {
            return new Response(JSON.stringify({ message: "Invalid or expired session" }), { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(session.id) },
            include: { carts: true, addresses: true },
        });

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Welcome", user }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
};
