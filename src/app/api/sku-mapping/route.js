import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// CREATE SKU MAPPING
export async function POST(req) {
    try {
        const body = await req.json();
        const { channelSku, ourSku } = body;

        if (!channelSku || !ourSku) {
            return NextResponse.json({
                success: false,
                message: "Channel SKU and Our SKU are required"
            });
        }

        const existingMapping = await prisma.bangaloreIncreffMappingSKU.findFirst({
            where: {
                channelSku
            }
        });

        if (existingMapping) {
            return NextResponse.json({
                success: false,
                message: "This Channel SKU is already mapped with another SKU"
            });
        }

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


// UPDATE SKU MAPPING
export async function PUT(req) {
    try {

        const body = await req.json();
        const { id, channelSku, ourSku } = body;

        if (!id || !channelSku || !ourSku) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID, Channel SKU and Internal SKU are required."
                },
                { status: 400 }
            );
        }

        const existingMapping = await prisma.bangaloreIncreffMappingSKU.findFirst({
            where: {
                channelSku,
                NOT: {
                    id: Number(id)
                }
            }
        });

        if (existingMapping) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This Channel SKU is already mapped to another internal SKU. Please choose a different Channel SKU or update the existing mapping."
                },
                { status: 400 }
            );
        }

        const updatedMapping = await prisma.bangaloreIncreffMappingSKU.update({
            where: {
                id: Number(id)
            },
            data: {
                channelSku,
                ourSku
            }
        });

        return NextResponse.json({
            success: true,
            message: "SKU Mapping updated successfully",
            data: updatedMapping
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred while updating the SKU mapping. Please try again",
            status: 500
        });

    }
}


// DELETE SKU MAPPING (PERMANENT)
export async function DELETE(req) {
    try {

        const body = await req.json();
        const { id } = body;

        await prisma.bangaloreIncreffMappingSKU.delete({
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json({
            success: true,
            message: "SKU Mapping deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json({
            success: false,
            message: "Failed to delete SKU mapping"
        });

    }
}