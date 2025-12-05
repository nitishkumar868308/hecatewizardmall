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

        console.log("BODY RECEIVED:", body);

        if (!id) {
            console.log("ID missing!");
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        // Fetch existing record
        const record = await prisma.DelhiWarehouseStock.findUnique({
            where: { id: Number(id) },
        });
        console.log("FETCHED RECORD:", record);

        if (!record) {
            console.log("Record not found in DB!");
            return new Response(JSON.stringify({ message: "Record not found" }), { status: 404 });
        }

        let updatedProductsSnapshot = { ...record.productsSnapshot };
        console.log("CLONED PRODUCTS SNAPSHOT:", updatedProductsSnapshot);

        if (units !== undefined && productId && variationId && warehouseId) {
            console.log("All identifiers present, proceeding to update units");

            updatedProductsSnapshot.entries = updatedProductsSnapshot.entries.map(entry => {
                console.log("ENTRY:", entry.id, "matches variationId?", entry.variationId === variationId);

                if (entry.variationId === variationId) {
                    const updatedEntry = {
                        ...entry,
                        entries: entry.entries.map(e => {
                            console.log("Checking warehouseId:", e.warehouseId, "matches?", e.warehouseId.toString() === warehouseId.toString());

                            if (e.warehouseId.toString() === warehouseId.toString()) {
                                console.log("Updating units from", e.units, "to", Number(units));
                                return { ...e, units: Number(units) };
                            }
                            return e;
                        })
                    };
                    console.log("UPDATED ENTRY:", updatedEntry);
                    return updatedEntry;
                }
                return entry;
            });
        } else {
            console.log("One of units/productId/variationId/warehouseId is missing!");
        }

        console.log("FINAL UPDATED PRODUCTS SNAPSHOT:", updatedProductsSnapshot);

        const updated = await prisma.DelhiWarehouseStock.update({
            where: { id: Number(id) },
            data: { productsSnapshot: updatedProductsSnapshot },
        });

        console.log("UPDATED RECORD:", updated);

        return new Response(
            JSON.stringify({ message: "Units updated successfully", data: updated }),
            { status: 200 }
        );

    } catch (error) {
        console.log("ERROR IN PUT:", error);
        return new Response(
            JSON.stringify({ message: "Failed to update warehouse dispatch", error: error.message }),
            { status: 500 }
        );
    }
}




