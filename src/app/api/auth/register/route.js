import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return Response.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return Response.json(
            { message: "User registered", user: { id: user.id, name: user.name, email: user.email }, token },
            { status: 201 }
        );
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
