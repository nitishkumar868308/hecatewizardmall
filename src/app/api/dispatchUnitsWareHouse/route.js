import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { transfers, totalUnits, totalFNSKU } = body;

        if (!transfers || !Array.isArray(transfers) || transfers.length === 0) {
            return new Response(
                JSON.stringify({ message: "No transfers provided for dispatch" }),
                { status: 400 }
            );
        }

        // Prepare data to insert into WarehouseDispatch
        // const dataToInsert = transfers.map(t => ({
        //     productId: t.productId,
        //     productName: t.productName,
        //     variationId: t.variationId || null,
        //     variationName: t.variationName || null,
        //     price: t.price,
        //     MRP: t.MRP,
        //     FNSKU: t.FNSKU,
        //     entries: t.entries,
        //     image: t.image || null,
        //     status: t.status || "dispatched",
        //     totalUnits: totalUnits || transfers.reduce((sum, tr) => {
        //         return sum + (tr.entries?.reduce((acc, e) => acc + parseInt(e.units || 0), 0) || 0);
        //     }, 0),
        //     totalFNSKU: totalFNSKU || transfers.length
        // }));

        // Insert into WarehouseDispatch
        const insertedTransfers = await prisma.WarehouseDispatch.create({
            data: {
                totalUnits: totalUnits,
                totalFNSKU: totalFNSKU,
                entries: transfers,
                status: "dispatched",
            },
        });

        // Update status in warehouseTransfer table
        for (const t of transfers) {
            await prisma.warehouseTransfer.updateMany({
                where: {
                    FNSKU: t.FNSKU,
                    deleted: false
                },
                data: {
                    status: "dispatched" // ya "completed" agar aap chaho
                }
            });
        }

        return new Response(
            JSON.stringify({
                message: "Transfers dispatched successfully",
                data: insertedTransfers
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Dispatch error:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to dispatch transfers",
                error: error.message
            }),
            { status: 500 }
        );
    }
}



export async function GET() {
    try {
        const dispatch = await prisma.WarehouseDispatch.findMany({
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