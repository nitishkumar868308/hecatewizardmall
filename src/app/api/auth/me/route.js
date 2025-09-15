// /api/auth/me/route.js
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export const GET = async (req) => {
    console.log("req" , req)
    const token = req.cookies.get("session")?.value;
    console.log("token from req.cookies:", token);

    const session = token ? verifyToken(token) : null;

    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.id) },
        include: { carts: true, addresses: true },
    });

    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Welcome", user }), { status: 200 });
};
