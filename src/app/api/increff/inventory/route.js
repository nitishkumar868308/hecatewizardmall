import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
    try {

        const username = req.headers.get("username");
        console.log("username", username)
        const password = req.headers.get("password");
        console.log("password", password)

        const VALID_USER = "hecate_wizard_mall";
        const VALID_PASS = "Pratiekajain9@";

        if (username !== VALID_USER || password !== VALID_PASS) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const { locationCode, inventories } = body;

        const warehouse = await prisma.wareHouse.findFirst({
            where: { state: "Bengaluru" },
            select: { code: true }
        });

        if (!warehouse || warehouse.code !== locationCode) {
            return NextResponse.json(
                { message: "Invalid locationCode." },
                { status: 400 }
            );
        }


        let successList = [];
        let failureList = [];

        for (const item of inventories) {

            const sku = item.channelSkuCode;
            const quantity = item.quantity;
            const clientSkuId = item.client_sku_id;

            if (!sku || quantity === undefined || quantity === null) {
                failureList.push({
                    sku: sku || null,
                    reason: "channelSkuCode, quantity are required"
                });
                continue;
            }

            try {

                const existingInventory = await prisma.bangaloreIncreffInventory.findUnique({
                    where: {
                        locationCode_channelSkuCode: {
                            locationCode: locationCode,
                            channelSkuCode: sku
                        }
                    }
                });

                if (existingInventory) {

                    await prisma.bangaloreIncreffInventory.update({
                        where: {
                            locationCode_channelSkuCode: {
                                locationCode: locationCode,
                                channelSkuCode: sku
                            }
                        },
                        data: {
                            quantity: quantity,
                            minExpiry: item.minExpiry,
                            clientSkuId: clientSkuId,
                            channelSerialNo: item.channelSerialNo,
                            payload: item
                        }
                    });

                    successList.push({
                        sku: sku,
                        message: "Quantity updated successfully"
                    });

                } else {

                    await prisma.bangaloreIncreffInventory.create({
                        data: {
                            locationCode: locationCode,
                            channelSkuCode: sku,
                            clientSkuId: clientSkuId,
                            quantity: quantity,
                            minExpiry: item.minExpiry,
                            channelSerialNo: item.channelSerialNo,
                            payload: item
                        }
                    });

                    successList.push({
                        sku: sku,
                        message: "Inventory created successfully"
                    });

                }

            } catch (err) {

                console.error("Inventory error:", err);

                failureList.push({
                    sku: sku,
                    error: err.message
                });

            }

        }

        return NextResponse.json({
            successList,
            failureList
        });

    } catch (err) {

        console.log("UPSERT ERROR:", err);

        return NextResponse.json(
            { message: "Inventory update failed" },
            { status: 500 }
        );

    }
}


export async function GET(req) {
    try {

        const { searchParams } = new URL(req.url);
        const locationCode = searchParams.get("locationCode");
        console.log("locationCode from frontend:", locationCode);

        if (!locationCode) {
            return NextResponse.json(
                { message: "locationCode is required" },
                { status: 400 }
            );
        }

        const inventory = await prisma.bangaloreIncreffInventory.findMany({
            where: {
                locationCode: locationCode
            },
            select: {
                locationCode: true,
                channelSkuCode: true,
                quantity: true,
                minExpiry: true,
                clientSkuId: true,
            }
        });
        console.log("inventory", inventory)

        return NextResponse.json(inventory);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Failed to fetch inventory" },
            { status: 500 }
        );

    }
}