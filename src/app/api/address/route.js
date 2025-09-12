import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Get all addresses
export async function GET(req) {
    try {
        const addresses = await prisma.address.findMany({
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Addresses fetched successfully", data: addresses }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch addresses", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Add new address
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, mobile, pincode, address, city, state, landmark, type, userId } = body;

        if (!name || !mobile || !pincode || !address || !city || !state || !type) {
            return new Response(
                JSON.stringify({ message: "All required fields must be provided" }),
                { status: 400 }
            );
        }

        const newAddress = await prisma.address.create({
            data: {
                name,
                mobile,
                pincode,
                address,
                city,
                state,
                landmark: landmark || null,
                type,
                userId: userId || null,
            },
        });

        return new Response(
            JSON.stringify({ message: "Address added successfully", data: newAddress }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to add address", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Update address
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Address ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Address not found" }),
                { status: 404 }
            );
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                ...updates,
                updatedAt: new Date(),
            },
        });

        return new Response(
            JSON.stringify({ message: "Address updated successfully", data: updatedAddress }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update address", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Delete address
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Address ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Address not found" }),
                { status: 404 }
            );
        }

        await prisma.address.delete({ where: { id } });

        return new Response(
            JSON.stringify({ message: "Address deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete address", error: error.message }),
            { status: 500 }
        );
    }
}
