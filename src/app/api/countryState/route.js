import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET ALL STATES
export async function GET() {
    try {
        const states = await prisma.stateCountry.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
            include: {
                country: true, // optional relation include
            },
        });

        return new Response(
            JSON.stringify({
                message: "States fetched successfully",
                data: states,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch states",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ CREATE STATE
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            name,
            country_id,
            country_code,
            country_name,
            iso2,
            iso3166_2,
            fips_code,
            type,
            latitude,
            longitude,
            active,
        } = body;

        // ✅ Required validation
        if (!name) {
            return new Response(
                JSON.stringify({ message: "State name is required" }),
                { status: 400 }
            );
        }

        const state = await prisma.stateCountry.create({
            data: {
                name,
                country_id: country_id ?? null,
                country_code: country_code ?? null,
                country_name: country_name ?? null,
                iso2: iso2 ?? null,
                iso3166_2: iso3166_2 ?? null,
                fips_code: fips_code ?? null,
                type: type ?? null,
                latitude: latitude ?? null,
                longitude: longitude ?? null,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "State created successfully",
                data: state,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create state",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ UPDATE STATE
export async function PUT(req) {
    try {
        const body = await req.json();

        const {
            id,
            name,
            country_id,
            country_code,
            country_name,
            iso2,
            iso3166_2,
            fips_code,
            type,
            latitude,
            longitude,
            active,
            deleted,
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "State ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.stateCountry.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "State not found" }),
                { status: 404 }
            );
        }

        const updatedState = await prisma.stateCountry.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                country_id: country_id ?? existing.country_id,
                country_code: country_code ?? existing.country_code,
                country_name: country_name ?? existing.country_name,
                iso2: iso2 ?? existing.iso2,
                iso3166_2: iso3166_2 ?? existing.iso3166_2,
                fips_code: fips_code ?? existing.fips_code,
                type: type ?? existing.type,
                latitude: latitude ?? existing.latitude,
                longitude: longitude ?? existing.longitude,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "State updated successfully",
                data: updatedState,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update state",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ DELETE STATE (SOFT DELETE)
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "State ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.stateCountry.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "State not found" }),
                { status: 404 }
            );
        }

        const deletedState = await prisma.stateCountry.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({
                message: "State deleted successfully",
                data: deletedState,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete state",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}