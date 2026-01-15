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
        console.log("updatedDraft", updatedDraft)

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


// export async function PATCH(req) {
//     try {
//         const body = await req.json();
//         const { dispatchId, dimensions, productsSnapshot, trackingId, trackingLink, warehouseState } = body;
//         console.log("warehouseState", warehouseState)
//         if (!dispatchId)
//             return new Response(JSON.stringify({ message: "Dispatch ID is required" }), { status: 400 });

//         const existing = await prisma.WarehouseDispatch.findUnique({ where: { id: dispatchId } });
//         if (!existing)
//             return new Response(JSON.stringify({ message: "Dispatch not found" }), { status: 404 });

//         if (existing.status === "completed")
//             return new Response(JSON.stringify({ message: "Dispatch already completed" }), { status: 400 });

//         const shippingId = existing.shippingId || `SHIP-${Date.now()}`;

//         // Update main dispatch
//         const updatedDispatch = await prisma.WarehouseDispatch.update({
//             where: { id: dispatchId },
//             data: {
//                 dimensions: dimensions || existing.dimensions,
//                 trackingId: trackingId || existing.trackingId,
//                 trackingLink: trackingLink || existing.trackingLink,
//                 shippingId,
//                 status: "completed",
//             },
//         });

//         // Get dispatch warehouse first
//         const dispatchWarehouse = await prisma.Warehouse.findUnique({
//             where: { id: existing.warehouseId },
//         });
//         console.log("dispatchWarehouse" , dispatchWarehouse)

//         // Get fulfillment warehouse
//         const fulfillmentWarehouse = await prisma.Warehouse.findUnique({
//             where: { id: dispatchWarehouse?.fulfillmentWarehouseId },
//         });
//         console.log("fulfillmentWarehouse" , fulfillmentWarehouse)

//         // Check if fulfillment warehouse state is Delhi
//         if (fulfillmentWarehouse?.state?.toLowerCase() === "delhi") {
//             await prisma.DelhiWarehouseStock.create({
//                 data: {
//                     dispatchId,
//                     productsSnapshot,
//                     dimensions,
//                     shippingId,
//                     trackingId,
//                     trackingLink,
//                     status: "accepted",
//                 },
//             });
//         }


//         return new Response(JSON.stringify({ message: "Dispatch finalized successfully", data: updatedDispatch }), { status: 200 });

//     } catch (error) {
//         console.error("Final dispatch error:", error);
//         return new Response(JSON.stringify({ message: "Failed to finalize dispatch", error: error.message }), { status: 500 });
//     }
// }
// export async function PATCH(req) {
//     try {
//         const body = await req.json();
//         const { dispatchId, dimensions, productsSnapshot, trackingId, trackingLink } = body;

//         if (!dispatchId)
//             return new Response(JSON.stringify({ message: "Dispatch ID is required" }), { status: 400 });

//         const existing = await prisma.WarehouseDispatch.findUnique({ where: { id: dispatchId } });
//         if (!existing)
//             return new Response(JSON.stringify({ message: "Dispatch not found" }), { status: 404 });

//         if (existing.status === "completed")
//             return new Response(JSON.stringify({ message: "Dispatch already completed" }), { status: 400 });

//         const shippingId = existing.shippingId || `SHIP-${Date.now()}`;

//         // Update main dispatch
//         const updatedDispatch = await prisma.WarehouseDispatch.update({
//             where: { id: dispatchId },
//             data: {
//                 dimensions: dimensions || existing.dimensions,
//                 trackingId: trackingId || existing.trackingId,
//                 trackingLink: trackingLink || existing.trackingLink,
//                 shippingId,
//                 status: "completed",
//             },
//         });

//         // Get warehouseIds from productsSnapshot
//         const warehouseIds = productsSnapshot?.entries?.flatMap((p) =>
//             p.entries?.map((entry) => parseInt(entry.warehouseId)) || []
//         ) || [];
//         console.log("warehouseIds", warehouseIds)

//         let isDelhiFulfillment = false;

//         for (const whId of warehouseIds) {
//             const dispatchWarehouse = await prisma.WareHouse.findUnique({
//                 where: { id: whId }
//             });

//             if (!dispatchWarehouse?.fulfillmentWarehouseId) continue;

//             const fulfillmentWarehouse = await prisma.WareHouse.findUnique({
//                 where: { id: dispatchWarehouse.fulfillmentWarehouseId }
//             });

//             if (fulfillmentWarehouse?.state?.toLowerCase() === "delhi") {
//                 isDelhiFulfillment = true;
//                 break; // ❗ ek mil gaya to bas
//             }
//         }

//         // 2️⃣ Sirf ek baar create karo
//         if (isDelhiFulfillment) {
//             await prisma.DelhiWarehouseStock.create({
//                 data: {
//                     dispatchId,
//                     productsSnapshot,
//                     dimensions,
//                     shippingId,
//                     trackingId,
//                     trackingLink,
//                     status: "accepted",
//                 },
//             });
//         }

//         // for (const whId of warehouseIds) {
//         //     // 🔹 Use correct Prisma model name
//         //     const dispatchWarehouse = await prisma.WareHouse.findUnique({ where: { id: whId } });
//         //     console.log("dispatchWarehouse", dispatchWarehouse);

//         //     const fulfillmentWarehouse = dispatchWarehouse?.fulfillmentWarehouseId
//         //         ? await prisma.WareHouse.findUnique({ where: { id: dispatchWarehouse.fulfillmentWarehouseId } })
//         //         : null;
//         //     console.log("fulfillmentWarehouse", fulfillmentWarehouse);

//         //     if (fulfillmentWarehouse?.state?.toLowerCase() === "delhi") {
//         //         await prisma.DelhiWarehouseStock.create({
//         //             data: {
//         //                 dispatchId,
//         //                 productsSnapshot,
//         //                 dimensions,
//         //                 shippingId,
//         //                 trackingId,
//         //                 trackingLink,
//         //                 status: "accepted",
//         //             },
//         //         });
//         //     }
//         // }



//         return new Response(JSON.stringify({ message: "Dispatch finalized successfully", data: updatedDispatch }), { status: 200 });

//     } catch (error) {
//         console.error("Final dispatch error:", error);
//         return new Response(JSON.stringify({ message: "Failed to finalize dispatch", error: error.message }), { status: 500 });
//     }
// }


export async function PATCH(req) {
    try {
        const body = await req.json();
        const { dispatchId, dimensions, productsSnapshot, trackingId, trackingLink } = body;
        console.log("productsSnapshot" , productsSnapshot)

        if (!dispatchId) {
            return new Response(JSON.stringify({ message: "Dispatch ID is required" }), { status: 400 });
        }

        const existingDispatch = await prisma.WarehouseDispatch.findUnique({
            where: { id: dispatchId }
        });
        if (!existingDispatch) {
            return new Response(JSON.stringify({ message: "Dispatch not found" }), { status: 404 });
        }

        if (existingDispatch.status === "completed") {
            return new Response(JSON.stringify({ message: "Dispatch already completed" }), { status: 400 });
        }

        const shippingId = existingDispatch.shippingId || `SHIP-${Date.now()}`;

        // Update main dispatch
        const updatedDispatch = await prisma.WarehouseDispatch.update({
            where: { id: dispatchId },
            data: {
                dimensions: dimensions || existingDispatch.dimensions,
                trackingId: trackingId || existingDispatch.trackingId,
                trackingLink: trackingLink || existingDispatch.trackingLink,
                shippingId,
                status: "completed",
            },
        });

        // --- Determine if any warehouse in this dispatch is fulfilled by Delhi ---
        const warehouseIds = productsSnapshot?.entries?.flatMap(p =>
            p.entries?.map(e => Number(e.warehouseId)) || []
        ) || [];

        let isDelhiFulfillment = false;

        for (const whId of warehouseIds) {
            const warehouse = await prisma.WareHouse.findUnique({ where: { id: whId } });
            if (!warehouse?.fulfillmentWarehouseId) continue;

            const fulfillmentWarehouse = await prisma.WareHouse.findUnique({
                where: { id: warehouse.fulfillmentWarehouseId }
            });

            if (fulfillmentWarehouse?.state?.toLowerCase() === "delhi") {
                isDelhiFulfillment = true;
                break;
            }
        }

        // --- Save individual product variations to DelhiWarehouseStock ---
        if (isDelhiFulfillment) {
            const stockData = [];

            productsSnapshot.entries.forEach(product => {
                const productId = product.productId;
                const variationId = product.variationId; // ✅ Correct: read from parent

                product.entries.forEach(entry => {
                    const stock = Number(entry.units) || 0; // ✅ units from warehouse entry
                    const warehouseId = Number(entry.warehouseId);

                    stockData.push({
                        dispatchId,
                        productId,
                        variationId,
                        warehouseId,
                        stock,
                        shippingId,
                        trackingId,
                        trackingLink,
                        status: "accepted",
                    });
                });
            });

            if (stockData.length) {
                await prisma.delhiWarehouseStock.createMany({
                    data: stockData,
                    skipDuplicates: true
                });
            }
        }


        // =================================================
        // 🟢 BANGALORE LOGIC (NEW – DELHI NOT TOUCHED)
        // =================================================
        let isBangaloreFulfillment = false;
        let bangaloreLocationCode = null;
        let bangalorePayloadToSave = null;


        for (const whId of warehouseIds) {

            const warehouse = await prisma.WareHouse.findUnique({
                where: { id: whId }
            });

            if (!warehouse?.fulfillmentWarehouseId) continue;

            const fulfillmentWarehouse = await prisma.WareHouse.findUnique({
                where: { id: warehouse.fulfillmentWarehouseId }
            });

            const state = fulfillmentWarehouse?.state?.toLowerCase();

            if (
                state === "karnataka" ||
                state === "bengaluru" ||
                state === "bangalore"
            ) {
                isBangaloreFulfillment = true;
                bangaloreLocationCode = fulfillmentWarehouse.code;
                break;
            }
        }

        // -----------------------------
        // 🟢 INCReff API HIT (Bangalore)
        // -----------------------------
        if (isBangaloreFulfillment && bangaloreLocationCode) {

            const increffPayload = {
                orderTime: new Date().toISOString(),
                orderType: "PO",
                orderCode: `PO-${dispatchId}`,
                locationCode: bangaloreLocationCode,
                partnerCode: "Delhi_23",
                partnerLocationCode: "Delhi_23",
                orderItems: []
            };

            productsSnapshot.entries.forEach(product => {
                product.entries.forEach(entry => {
                    increffPayload.orderItems.push({
                        channelSkuCode: product.sku,   // ✅ SKU
                        orderItemCode: product.sku,
                        quantity: Number(entry.units),
                        sellingPricePerUnit: Number(product.price || 0)
                    });
                });
            });

            bangalorePayloadToSave = increffPayload;

            console.log("Bangalore Payload:", JSON.stringify(increffPayload, null, 2));
            const increffRes = await fetch(
                "https://staging-common.omni.increff.com/assure-magic2/orders/inward",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authusername": "HECATE_ERP-1200063404",
                        "authpassword": "9381c0d5-6884-4e40-8ded-588faf983eca"
                    },
                    body: JSON.stringify(increffPayload)
                }
            );

            const responseText = await increffRes.text();
            console.log("Increff Status:", increffRes.status);
            console.log("Increff Response Body:", responseText);


            // ✅ Only save if 200 OK
            if (increffRes.status === 200) {
                await prisma.BangaloreIncreffOrder.create({
                    data: {
                        dispatchId,
                        orderCode: increffPayload.orderCode,
                        locationCode: bangaloreLocationCode,
                        payload: increffPayload,
                        response: {
                            status: increffRes.status,
                            message: "OK (No response body from Increff)"
                        }
                    }
                });
            } else {
                console.error("Increff failed:", increffRes.status);
            }
        }


        return new Response(
            JSON.stringify({ message: "Dispatch finalized successfully", data: updatedDispatch }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Final dispatch error:", error);
        return new Response(
            JSON.stringify({ message: "Failed to finalize dispatch", error: error.message }),
            { status: 500 }
        );
    }
}
