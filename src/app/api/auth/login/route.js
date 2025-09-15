import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/session"; // just createToken, no setSession
import { NextResponse } from "next/server";

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

        // Create JWT token
        const token = createToken(user);

        // Create NextResponse
        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token, // optional, mainly for client-side if needed
        });

        // Set cookie directly
        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set("session", token, {
            httpOnly: true,
            secure: isProd,              // true in production (HTTPS)
            sameSite: isProd ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });


        console.log("Session cookie set:", token);

        return response;
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
