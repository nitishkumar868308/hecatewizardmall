import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            orderCode,
            shipmentId,
            locationCode,
            shipmentItems
        } = body;

        // ❌ Basic validation
        if (!orderCode || !shipmentId || !locationCode || !shipmentItems) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 🧠 FETCH ORDER
        const order = await prisma.orders.findUnique({
            where: { orderNumber: orderCode }
        });
        console.log("order", order)
        console.log("order.locationCode", order.locationCode)

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // ❌ LOCATION MISMATCH CHECK
        if (order.locationCode && order.locationCode !== locationCode) {
            return NextResponse.json(
                { error: `Location code mismatch for the given order Number` },
                { status: 400 }
            );
        }

        // 🔁 1. IDEMPOTENCY CHECK
        const existing = await prisma.bangaloreIncreffPackOrder.findUnique({
            where: {
                orderCode_shipmentId: {
                    orderCode,
                    shipmentId
                }
            }
        });

        if (existing) {
            if (existing.locationCode !== locationCode) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Location code mismatch for the given order",
                        orderCode: existing.orderCode
                    },
                    { status: 400 }
                );
            }
            return NextResponse.json({
                shipmentCode: existing.shipmentCode,
                transporter: "ATSIN",
                shipmentItems: shipmentItems.map((item) => ({
                    channelSkuCode: item.channelSkuCode,
                    orderItemCode: item.orderItemCode,
                    quantity: item.quantity,
                    itemMetaData: {}
                })),
                invoiceMetaData: {},
                shippingLabelMetaData: {}
            });
        }

        // 🔥 2. INVENTORY UPDATE
        for (const item of shipmentItems) {
            const inventory = await prisma.bangaloreIncreffInventory.findUnique({
                where: {
                    locationCode_channelSkuCode: {
                        locationCode,
                        channelSkuCode: item.channelSkuCode
                    }
                }
            });

            if (!inventory) {
                return NextResponse.json(
                    { error: `Inventory not found for SKU: ${item.channelSkuCode}` },
                    { status: 400 }
                );
            }

            if (inventory.quantity < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for SKU: ${item.channelSkuCode}` },
                    { status: 400 }
                );
            }

            // Decrement stock
            await prisma.bangaloreIncreffInventory.update({
                where: {
                    locationCode_channelSkuCode: {
                        locationCode,
                        channelSkuCode: item.channelSkuCode
                    }
                },
                data: {
                    quantity: {
                        decrement: item.quantity
                    }
                }
            });
        }

        // 🚀 3. GENERATE SHIPMENT CODE
        const shipmentCode = `SHIP_${shipmentId}_${Date.now()}`;

        // 💾 4. SAVE PACK ORDER
        await prisma.bangaloreIncreffPackOrder.create({
            data: {
                orderCode,
                shipmentId,
                locationCode,
                shipmentCode,
                payload: body
            }
        });

        // 📤 5. RESPONSE
        return NextResponse.json({
            shipmentCode,
            transporter: "ATSIN",
            shipmentItems: shipmentItems.map((item) => ({
                channelSkuCode: item.channelSkuCode,
                orderItemCode: item.orderItemCode,
                quantity: item.quantity,
                itemMetaData: {}
            })),
            invoiceMetaData: {},
            shippingLabelMetaData: {}
        });

    } catch (error) {
        console.error("Pack Order API Error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}