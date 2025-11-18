import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================
// GET — All Shipping Pricing
// =============================
export async function GET(req) {
    try {
        const pricing = await prisma.shippingPricing.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({
                message: "Shipping Pricing fetched successfully",
                data: pricing,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch shipping pricing",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// =============================
// POST — Create Shipping Pricing
// =============================
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, price, description , active } = body;

        // Validation
        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "Name is required and must be a string" }),
                { status: 400 }
            );
        }

        if (price === undefined || typeof price !== "number") {
            return new Response(
                JSON.stringify({ message: "Price is required and must be a number" }),
                { status: 400 }
            );
        }

        const created = await prisma.shippingPricing.create({
            data: {
                name,
                price,
                description ,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Shipping Pricing created successfully",
                data: created,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create shipping pricing",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// =============================
// PUT — Update Shipping Pricing
// =============================
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, price,description , active, deleted } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.shippingPricing.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Shipping Pricing not found" }),
                { status: 404 }
            );
        }

        const updated = await prisma.shippingPricing.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                price: price ?? existing.price, 
                description: description ?? existing.description, 
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Shipping Pricing updated successfully",
                data: updated,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update shipping pricing",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// =============================
// DELETE — Soft Delete
// =============================
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.shippingPricing.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Shipping Pricing not found" }),
                { status: 404 }
            );
        }

        const deletedData = await prisma.shippingPricing.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({
                message: "Shipping Pricing deleted successfully",
                data: deletedData,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete shipping pricing",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
