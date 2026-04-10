import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Document ID is required" }),
                { status: 400 }
            );
        }

        // 🔹 Step 1: Get document
        const document = await prisma.astrologerExtraDocument.findUnique({
            where: { id: Number(id) },
        });

        if (!document) {
            return new Response(
                JSON.stringify({ message: "Document not found" }),
                { status: 404 }
            );
        }

        // 🔹 Step 2: Delete file from local storage
        if (document.fileUrl) {
            try {
                const filePath = path.join(process.cwd(), "public", document.fileUrl);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (fileError) {
                console.error("File delete error:", fileError.message);
            }
        }

        // 🔹 Step 3: Delete from DB
        const deletedDoc = await prisma.astrologerExtraDocument.delete({
            where: { id: Number(id) },
        });

        return new Response(
            JSON.stringify({
                message: "Extra document deleted successfully ✅",
                data: deletedDoc,
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete document ❌",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}