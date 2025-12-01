import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    try {
        const dispatch = await prisma.DelhiWarehouseStock.findMany({
            where: {
                active: true,
                deleted: false
            },
            orderBy: {
                id: "desc"
            }
        });

        return new Response(
            JSON.stringify({
                message: "Warehouse DisPatch list fetched successfully",
                data: dispatch
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch warehouse DisPatch",
                error: error.message
            }),
            { status: 500 }
        );
    }
}