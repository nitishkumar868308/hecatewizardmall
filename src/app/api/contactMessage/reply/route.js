import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { adminReplyTemplate } from "@/lib/templates/adminReplyTemplate";

export async function POST(req) {
    try {
        const { contactMessageId, message, sender } = await req.json();

        if (!contactMessageId || !message || !sender) {
            return Response.json(
                { message: "contactMessageId, message, and sender are required" },
                { status: 400 }
            );
        }

        if (!["admin", "user"].includes(sender)) {
            return Response.json({ message: "Sender must be 'admin' or 'user'" }, { status: 400 });
        }

        // Determine read flags based on sender
        const readData = sender === "admin"
            ? { readByAdmin: true, readByUser: false }
            : { readByAdmin: false, readByUser: true };

        // Create reply
        const reply = await prisma.messageReply.create({
            data: {
                contactMessageId,
                sender,
                message,
                ...readData
            },
        });

        // Only send email if admin replies
        if (sender === "admin") {
            const contactMessage = await prisma.contactMessage.findUnique({
                where: { id: contactMessageId },
            });

            if (contactMessage) {
                await sendMail({
                    to: contactMessage.email,
                    subject: "Reply from Admin",
                    text: `Admin replied to your message: "${message}"`,
                    html: adminReplyTemplate({
                        name: contactMessage.name,
                        originalMessage: contactMessage.message, // user ka original message
                        replyMessage: message,                  // admin ka reply
                    }),
                });
            }
        }

        return Response.json({ message: "Reply sent successfully!", reply }, { status: 201 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}
