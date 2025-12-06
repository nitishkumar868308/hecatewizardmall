import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { variationId } = body;

        if (!variationId) {
            return new Response(JSON.stringify({ message: "Variation ID is required" }), { status: 400 });
        }

        // check if variation exists
        const existing = await prisma.productVariation.findUnique({
            where: { id: variationId }
        });

        if (!existing) {
            return new Response(JSON.stringify({ message: "Variation not found" }), { status: 404 });
        }

        // HARD DELETE
        await prisma.productVariation.delete({
            where: { id: variationId }
        });

        return new Response(
            JSON.stringify({ message: "Variation permanently deleted" }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete variation", error: error.message }),
            { status: 500 }
        );
    }
}
