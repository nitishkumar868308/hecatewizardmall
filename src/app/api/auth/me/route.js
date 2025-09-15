import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export async function GET(req, res) {

    const token = req.cookies.session; // ← req.cookies me cookie aayegi
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const session = verifyToken(token);
    if (!session) return res.status(401).json({ message: "Not authenticated" });

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.id) },
        include: { carts: true, addresses: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Welcome", user });
}
