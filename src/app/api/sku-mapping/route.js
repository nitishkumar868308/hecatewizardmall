import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// CREATE SKU MAPPING
export async function POST(req) {
    try {
        const body = await req.json();
        const { channelSku, ourSku } = body;

        const mapping = await prisma.bangaloreIncreffMappingSKU.create({
            data: {
                channelSku,
                ourSku
            }
        });

        return NextResponse.json({
            success: true,
            message: "SKU Mapping created successfully",
            data: mapping
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: "Something went wrong while creating SKU mapping"
        });

    }
}


// GET ALL SKU MAPPINGS
export async function GET() {
    try {

        const mappings = await prisma.bangaloreIncreffMappingSKU.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            success: true,
            data: mappings
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch mappings"
        });

    }
}