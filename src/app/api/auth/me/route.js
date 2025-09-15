import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const GET = async () => {
    const session = await getSession(); // ✅ await is required

    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.id) },
        include: { carts: true, addresses: true },
    });

    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Welcome", user }), { status: 200 });
};
