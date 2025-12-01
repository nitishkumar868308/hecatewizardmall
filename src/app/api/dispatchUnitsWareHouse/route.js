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
        // for (const t of transfers) {
        //     await prisma.warehouseTransfer.updateMany({
        //         where: {
        //             FNSKU: t.FNSKU,
        //             warehouseId: entry.warehouseId,
        //             deleted: false
        //         },
        //         data: {
        //             status: "dispatched" // ya "completed" agar aap chaho
        //         }
        //     });
        // }
        for (const t of transfers) {
            if (!t.id) continue; // safety check
            await prisma.warehouseTransfer.update({
                where: { id: t.id }, // Update only this record
                data: { status: "dispatched" }
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

export async function PUT(req) {
    try {
        const body = await req.json();
        const { dispatchId, dimensions, trackingId, trackingLink, shippingId } = body;

        if (!dispatchId) {
            return new Response(
                JSON.stringify({ message: "Dispatch ID is required to save draft" }),
                { status: 400 }
            );
        }

        const updatedDraft = await prisma.WarehouseDispatch.update({
            where: { id: dispatchId },
            data: {
                dimensions: dimensions || undefined,
                trackingId: trackingId || undefined,
                trackingLink: trackingLink || undefined,
                shippingId: shippingId || undefined
            }
        });
        console.log("updatedDraft" , updatedDraft)

        return new Response(
            JSON.stringify({
                message: "Dispatch draft saved successfully",
                data: updatedDraft
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Save draft error:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to save dispatch draft",
                error: error.message
            }),
            { status: 500 }
        );
    }
}


export async function PATCH(req) {
    try {
        const body = await req.json();
        const { dispatchId, dimensions, productsSnapshot, trackingId, trackingLink, warehouseState } = body;
        console.log("warehouseState" , warehouseState)
        if (!dispatchId) 
            return new Response(JSON.stringify({ message: "Dispatch ID is required" }), { status: 400 });

        const existing = await prisma.WarehouseDispatch.findUnique({ where: { id: dispatchId } });
        if (!existing) 
            return new Response(JSON.stringify({ message: "Dispatch not found" }), { status: 404 });

        if (existing.status === "completed") 
            return new Response(JSON.stringify({ message: "Dispatch already completed" }), { status: 400 });

        const shippingId = existing.shippingId || `SHIP-${Date.now()}`;

        // Update main dispatch
        const updatedDispatch = await prisma.WarehouseDispatch.update({
            where: { id: dispatchId },
            data: {
                dimensions: dimensions || existing.dimensions,
                trackingId: trackingId || existing.trackingId,
                trackingLink: trackingLink || existing.trackingLink,
                shippingId,
                status: "completed",
            },
        });

        // Delhi warehouse inventory
        if (warehouseState?.toLowerCase() === "delhi") {
            await prisma.DelhiWarehouseStock.create({
                data: {
                    dispatchId,
                    productsSnapshot,
                    dimensions,
                    shippingId,
                    trackingId,
                    trackingLink,
                    status: "accepted",
                },
            });
        }

        return new Response(JSON.stringify({ message: "Dispatch finalized successfully", data: updatedDispatch }), { status: 200 });

    } catch (error) {
        console.error("Final dispatch error:", error);
        return new Response(JSON.stringify({ message: "Failed to finalize dispatch", error: error.message }), { status: 500 });
    }
}
