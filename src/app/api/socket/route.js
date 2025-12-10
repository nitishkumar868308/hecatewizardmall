import { Server } from "socket.io";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ya koi DB connection

export const GET = (req) => {
    if (!globalThis.io) {
        const io = new Server({
            cors: { origin: "*" },
        });

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            // User joins an order room
            socket.on("join-room", async ({ orderId }) => {
                socket.join(orderId);

                // Send previous messages from DB
                const messages = await prisma.chatMessage.findMany({
                    where: { orderId },
                    orderBy: { createdAt: "asc" },
                });
                socket.emit("previous-messages", messages);
            });

            // Send message
            socket.on("send-message", async ({ orderId, sender, text }) => {
                const message = await prisma.chatMessage.create({
                    data: { orderId, sender, text },
                });

                // Broadcast to all in same room
                io.to(orderId).emit("receive-message", message);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        globalThis.io = io;
    }

    return NextResponse.json({ status: "Socket.IO running" });
};
