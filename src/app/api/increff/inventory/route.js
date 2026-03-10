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

            if (!sku || !clientSkuId || quantity === undefined || quantity === null) {
                failureList.push({
                    sku: sku || null,
                    reason: "channelSkuCode, client_sku_id and quantity are required"
                });
                continue;
            }

            try {

                await prisma.bangaloreIncreffInventory.upsert({
                    where: {
                        locationCode_clientSkuId: {
                            locationCode: locationCode,
                            clientSkuId: clientSkuId
                        }
                    },
                    update: {
                        quantity: quantity,
                        minExpiry: item.minExpiry,
                        channelSkuCode: sku,
                        channelSerialNo: item.channelSerialNo,
                        payload: item
                    },
                    create: {
                        locationCode: locationCode,
                        channelSkuCode: sku,
                        clientSkuId: clientSkuId,
                        quantity: quantity,
                        minExpiry: item.minExpiry,
                        channelSerialNo: item.channelSerialNo,
                        payload: item
                    }
                });

                successList.push(sku);

            } catch (err) {

                failureList.push(sku);

            }

        }

        return NextResponse.json({
            successList,
            failureList
        });

    } catch (error) {

        console.error(error);

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