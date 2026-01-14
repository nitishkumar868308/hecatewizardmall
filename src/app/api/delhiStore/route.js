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


export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, productId, variationId, warehouseId, units } = body;

        if (!id || !productId || !variationId || !warehouseId || units === undefined) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        // Fetch the record
        const record = await prisma.DelhiWarehouseStock.findUnique({
            where: { id: Number(id) },
        });

        if (!record) {
            return new Response(JSON.stringify({ message: "Record not found" }), { status: 404 });
        }

        // Update stock directly
        const updated = await prisma.DelhiWarehouseStock.update({
            where: { id: Number(id) },
            data: { stock: Number(units) },
        });

        return new Response(
            JSON.stringify({ message: "Stock updated successfully", data: updated }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update stock", error: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        // Hard delete
        const deletedRecord = await prisma.DelhiWarehouseStock.delete({
            where: { id: Number(id) },
        });

        return new Response(
            JSON.stringify({ message: "Record deleted successfully", data: deletedRecord }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete record", error: error.message }),
            { status: 500 }
        );
    }
}



