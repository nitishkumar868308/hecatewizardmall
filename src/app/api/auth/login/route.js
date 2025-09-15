import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/session";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);

    // Set cookie
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", `session=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; ${isProd ? "Secure; SameSite=None" : "SameSite=Lax"}`);

    return res.status(200).json({ message: "Login successful", user });
}
