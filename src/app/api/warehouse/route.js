import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - All warehouse locations
export async function GET() {
    try {
        const warehouses = await prisma.WareHouse.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Warehouses fetched successfully", data: warehouses }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch warehouses", error: error.message }),
            { status: 500 }
        );
    }
}

// POST - Create warehouse
export async function POST(req) {
    try {
        const body = await req.json();
        const { state, name, address, code, pincode, active, contact } = body;

        if (!state || !name || !address || !code || !pincode || !contact) {
            return new Response(
                JSON.stringify({ message: "All fields are required: state, name, address, code, pincode, contact" }),
                { status: 400 }
            );
        }

        const newWarehouse = await prisma.WareHouse.create({
            data: {
                state,
                name,
                address,
                code,
                pincode,
                contact,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Warehouse created successfully", data: newWarehouse }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create warehouse", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT - Update warehouse
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, state, name, address, code, pincode, active, deleted, contact } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Warehouse ID is required" }), { status: 400 });
        }

        const existing = await prisma.WareHouse.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Warehouse not found" }), { status: 404 });
        }

        const updatedWarehouse = await prisma.WareHouse.update({
            where: { id },
            data: {
                state: state ?? existing.state,
                name: name ?? existing.name,
                address: address ?? existing.address,
                code: code ?? existing.code,
                pincode: pincode ?? existing.pincode,
                contact: contact ?? existing.contact,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({ message: "Warehouse updated successfully", data: updatedWarehouse }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update warehouse", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE - Soft delete warehouse
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Warehouse ID is required" }), { status: 400 });
        }

        const existing = await prisma.wareHouse.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Warehouse not found" }), { status: 404 });
        }

        const deletedWarehouse = await prisma.wareHouse.update({
            where: { id },
            data: { deleted: true },
        });

        return new Response(
            JSON.stringify({ message: "Warehouse deleted successfully", data: deletedWarehouse }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete warehouse", error: error.message }),
            { status: 500 }
        );
    }
}

