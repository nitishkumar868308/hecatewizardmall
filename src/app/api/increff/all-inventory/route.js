import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {

        const username = req.headers.get("username");
        const password = req.headers.get("password");

        const VALID_USER = "hecate_wizard_mall";
        const VALID_PASS = "Pratiekajain9@";

        if (username !== VALID_USER || password !== VALID_PASS) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const inventory = await prisma.bangaloreIncreffInventory.findMany({
            select: {
                locationCode: true,
                channelSkuCode: true,
                quantity: true,
                minExpiry: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                locationCode: "asc"
            }
        });

        return NextResponse.json(inventory);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Failed to fetch inventory" },
            { status: 500 }
        );

    }
}