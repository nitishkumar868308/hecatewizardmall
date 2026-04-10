import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Penalty ID is required" }),
                { status: 400 }
            );
        }

        // check exist
        const existing = await prisma.astrologerPenalty.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Penalty not found" }),
                { status: 404 }
            );
        }

        // delete
        await prisma.astrologerPenalty.delete({
            where: { id },
        });

        return new Response(
            JSON.stringify({ message: "Penalty deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({ message: "Something went wrong ❌" }),
            { status: 500 }
        );
    }
}