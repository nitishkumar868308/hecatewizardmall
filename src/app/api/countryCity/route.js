import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET ALL CITIES
export async function GET() {
    try {
        const cities = await prisma.cityCountry.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
            include: {
                state: true,
                country: true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Cities fetched successfully",
                data: cities,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch cities",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ CREATE CITY
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            name,
            state_id,
            state_code,
            state_name,
            country_id,
            country_code,
            country_name,
            latitude,
            longitude,
            active,
        } = body;

        // ✅ Required validation
        if (!name || !state_id || !country_id) {
            return new Response(
                JSON.stringify({
                    message: "Required fields missing (name, state_id, country_id)",
                }),
                { status: 400 }
            );
        }

        const city = await prisma.cityCountry.create({
            data: {
                name,
                state_id,
                state_code: state_code ?? "",
                state_name: state_name ?? "",
                country_id,
                country_code: country_code ?? "",
                country_name: country_name ?? "",
                latitude: latitude ?? "",
                longitude: longitude ?? "",
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "City created successfully",
                data: city,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create city",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ UPDATE CITY
export async function PUT(req) {
    try {
        const body = await req.json();

        const {
            id,
            name,
            state_id,
            state_code,
            state_name,
            country_id,
            country_code,
            country_name,
            latitude,
            longitude,
            active,
            deleted,
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "City ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.cityCountry.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "City not found" }),
                { status: 404 }
            );
        }

        const updatedCity = await prisma.cityCountry.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                state_id: state_id ?? existing.state_id,
                state_code: state_code ?? existing.state_code,
                state_name: state_name ?? existing.state_name,
                country_id: country_id ?? existing.country_id,
                country_code: country_code ?? existing.country_code,
                country_name: country_name ?? existing.country_name,
                latitude: latitude ?? existing.latitude,
                longitude: longitude ?? existing.longitude,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "City updated successfully",
                data: updatedCity,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update city",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ DELETE CITY (SOFT DELETE)
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "City ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.cityCountry.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "City not found" }),
                { status: 404 }
            );
        }

        const deletedCity = await prisma.cityCountry.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({
                message: "City deleted successfully",
                data: deletedCity,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete city",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}