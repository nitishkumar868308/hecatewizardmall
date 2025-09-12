import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ message: "Not authenticated" }),
            { status: 401 }
        );
    }

    try {
        const session = jwt.verify(token, SECRET);
        const userId = parseInt(session.id);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { carts: true, addresses: true },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }
        return new Response(
            JSON.stringify({ message: "Welcome", user: user }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ message: "Invalid token" }),
            { status: 401 }
        );
    }
};
