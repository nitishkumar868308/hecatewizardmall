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
                JSON.stringify({ message: "Certificate ID is required" }),
                { status: 400 }
            );
        }

        // 🔹 Step 1: Get certificate details
        const certificate = await prisma.certificate.findUnique({
            where: { id: Number(id) },
        });

        if (!certificate) {
            return new Response(
                JSON.stringify({ message: "Certificate not found" }),
                { status: 404 }
            );
        }

        // 🔹 Step 2: Delete file from local storage
        if (certificate.fileUrl) {
            try {
                // assuming fileUrl = /uploads/certificates/abc.pdf
                const filePath = path.join(process.cwd(), "public", certificate.fileUrl);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (fileError) {
                console.error("File delete error:", fileError.message);
            }
        }

        // 🔹 Step 3: Delete from DB
        const deletedCertificate = await prisma.certificate.delete({
            where: { id: Number(id) },
        });

        return new Response(
            JSON.stringify({
                message: "Certificate deleted successfully ✅",
                data: deletedCertificate,
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete certificate ❌",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}