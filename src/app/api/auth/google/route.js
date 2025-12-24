import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/session";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
    try {
        const { token } = await req.json();

        // 1️⃣ Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // 2️⃣ Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    profileImage: picture,
                    provider: "GOOGLE",
                },
            });
        }

        // 3️⃣ Create JWT
        const jwtToken = createToken(user);

        const response = NextResponse.json(
            { message: "Google login successful", user },
            { status: 200 }
        );

        response.cookies.set("session", jwtToken, {
            httpOnly: true,
            secure: false, // prod me true
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Google authentication failed" },
            { status: 401 }
        );
    }
}
