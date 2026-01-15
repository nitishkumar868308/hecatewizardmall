import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    try {
        const transfers = await prisma.warehouseTransfer.findMany({
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
                message: "Warehouse transfer list fetched successfully",
                data: transfers
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch warehouse transfers",
                error: error.message
            }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            productId,
            productName,
            variationId,
            variationName,
            price,
            MRP,
            FNSKU,
            sku,
            entries,
            image
        } = body;

        if (!productId || !productName || !price || !MRP || !FNSKU || !entries) {
            return new Response(
                JSON.stringify({
                    message: "Missing fields — productId, productName, price, MRP, FNSKU, entries required"
                }),
                { status: 400 }
            );
        }

        const transfer = await prisma.warehouseTransfer.create({
            data: {
                productId,
                productName,
                variationId,
                variationName,
                price,
                MRP,
                FNSKU,
                sku,
                entries,
                image,
                status: "pending"
            },
        });

        return new Response(
            JSON.stringify({
                message: "Product successfully sent to warehouse",
                data: transfer
            }),
            { status: 201 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to send product to warehouse",
                error: error.message
            }),
            { status: 500 }
        );
    }
}


export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Warehouse Transfer ID is required" }),
                { status: 400 }
            );
        }

        const existingTransfer = await prisma.warehouseTransfer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingTransfer) {
            return new Response(
                JSON.stringify({ message: "Warehouse Transfer not found" }),
                { status: 404 }
            );
        }

        const deletedTransfer = await prisma.warehouseTransfer.update({
            where: { id: parseInt(id) },
            data: { deleted: true }, // soft delete
        });
        console.log("deletedTransfer", deletedTransfer)

        return new Response(
            JSON.stringify({ message: "Warehouse Transfer deleted successfully", data: deletedTransfer }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete warehouse transfer", error: error.message }),
            { status: 500 }
        );
    }
}


export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            productId,
            productName,
            variationId,
            variationName,
            price,
            MRP,
            FNSKU,
            sku,
            entries,
            image,
            status
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Warehouse Transfer ID is required" }),
                { status: 400 }
            );
        }

        const existingTransfer = await prisma.warehouseTransfer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingTransfer) {
            return new Response(
                JSON.stringify({ message: "Warehouse Transfer not found" }),
                { status: 404 }
            );
        }

        const updatedTransfer = await prisma.warehouseTransfer.update({
            where: { id: parseInt(id) },
            data: {
                productId: productId ?? existingTransfer.productId,
                productName: productName ?? existingTransfer.productName,
                variationId: variationId ?? existingTransfer.variationId,
                variationName: variationName ?? existingTransfer.variationName,
                price: price ?? existingTransfer.price,
                MRP: MRP ?? existingTransfer.MRP,
                FNSKU: FNSKU ?? existingTransfer.FNSKU,
                sku: sku ?? existingTransfer.sku,
                entries: entries ?? existingTransfer.entries,
                image: image ?? existingTransfer.image,
                status: status ?? existingTransfer.status
            }
        });

        return new Response(
            JSON.stringify({
                message: "Warehouse Transfer updated successfully",
                data: updatedTransfer
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update warehouse transfer",
                error: error.message
            }),
            { status: 500 }
        );
    }
}