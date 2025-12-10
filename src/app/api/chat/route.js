import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → fetch chat messages for an order
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return new Response(JSON.stringify({ message: "orderId is required" }), { status: 400 });
        }

        const messages = await prisma.chatMessage.findMany({
            where: { orderId: parseInt(orderId, 10) },
            orderBy: { createdAt: "asc" },
            take: 50,
        });

        return new Response(
            JSON.stringify({ message: "Chat fetched successfully", data: messages }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to fetch chat", error: error.message }), { status: 500 });
    }
}

// POST → send new message
export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, sender, senderRole, receiverId, receiverRole, text } = body;
        

        if (!orderId || !sender || !senderRole || !receiverId || !receiverRole || !text) {
            return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
        }

        const message = await prisma.chatMessage.create({
            data: {
                orderId: parseInt(orderId, 10),
                sender,
                senderRole,
                receiverId,
                receiverRole,
                text,
            },
        });

        return new Response(JSON.stringify({ message: "Chat saved successfully", data: message }), { status: 201 });
    } catch (err) {
        console.error("POST /api/chat error:", err);
        return new Response(JSON.stringify({ message: "Failed to save chat", error: err.message }), { status: 500 });
    }
}

