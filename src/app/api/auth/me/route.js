import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

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
    console.log("SECRET env route:", process.env.JWT_SECRET);
    console.log("SECRET fallback route:", SECRET);
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
