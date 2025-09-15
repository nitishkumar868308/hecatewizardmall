import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

export const GET = async () => {
    // ✅ Use cookies() from next/headers
    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;

    console.log("token from cookies:", token);

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
