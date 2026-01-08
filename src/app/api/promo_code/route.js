import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================
// GET — All Promo Codes
// =============================
export async function GET(req) {
    try {
        const promoCodes = await prisma.promoCode.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({
                message: "Promo codes fetched successfully",
                data: promoCodes,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch promo codes",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// =============================
// POST — Create Promo Code
// =============================
export async function POST(req) {
    try {
        const body = await req.json();
        const { code, type, amount, startDate, endDate, active = true } = body;

        // Validation
        if (!code || typeof code !== "string") {
            return new Response(
                JSON.stringify({ message: "Promo code is required and must be a string" }),
                { status: 400 }
            );
        }
        if (!amount || typeof amount !== "number") {
            return new Response(
                JSON.stringify({ message: "Amount is required and must be a number" }),
                { status: 400 }
            );
        }

        const created = await prisma.promoCode.create({
            data: {
                code,
                type,
                amount,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                active,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Promo code created successfully",
                data: created,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create promo code",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// =============================
// PUT — Update Promo Code
// =============================
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, code, type, amount, startDate, endDate, active } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        const existing = await prisma.promoCode.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Promo code not found" }), { status: 404 });
        }

        const updated = await prisma.promoCode.update({
            where: { id },
            data: {
                code: code ?? existing.code,
                type: type ?? existing.type,
                amount: amount ?? existing.amount,
                startDate: startDate ? new Date(startDate) : existing.startDate,
                endDate: endDate ? new Date(endDate) : existing.endDate,
                active: active ?? existing.active,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Promo code updated successfully",
                data: updated,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update promo code",
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
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        const existing = await prisma.promoCode.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Promo code not found" }), { status: 404 });
        }

        const deletedData = await prisma.promoCode.update({
            where: { id },
            data: { deleted: true },
        });

        return new Response(
            JSON.stringify({
                message: "Promo code deleted successfully",
                data: deletedData,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete promo code",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
