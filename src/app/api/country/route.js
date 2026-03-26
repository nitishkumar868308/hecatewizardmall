import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET ALL COUNTRIES
export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({
                message: "Countries fetched successfully",
                data: countries,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch countries",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ CREATE COUNTRY
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            name,
            iso2,
            iso3,
            numeric_code,
            phonecode,
            capital,
            currency,
            currency_name,
            currency_symbol,
            nationality,
            postal_code_format,
            postal_code_regex,
            emoji,
            emojiU,
            active,
        } = body;

        // ✅ Required validations
        if (!name || !iso2 || !iso3 || !numeric_code || !phonecode) {
            return new Response(
                JSON.stringify({
                    message: "Required fields missing (name, iso2, iso3, numeric_code, phonecode)",
                }),
                { status: 400 }
            );
        }

        const country = await prisma.country.create({
            data: {
                name,
                iso2,
                iso3,
                numeric_code,
                phonecode,

                // ✅ optional fields
                capital: capital ?? null,
                currency: currency ?? null,
                currency_name: currency_name ?? null,
                currency_symbol: currency_symbol ?? null,
                nationality: nationality ?? null,
                postal_code_format: postal_code_format ?? null,
                postal_code_regex: postal_code_regex ?? null,
                emoji: emoji ?? null,
                emojiU: emojiU ?? null,

                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Country created successfully",
                data: country,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create country",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ UPDATE COUNTRY
export async function PUT(req) {
    try {
        const body = await req.json();

        const {
            id,
            name,
            iso2,
            iso3,
            numeric_code,
            phonecode,
            capital,
            currency,
            currency_name,
            currency_symbol,
            nationality,
            postal_code_format,
            postal_code_regex,
            emoji,
            emojiU,
            active,
            deleted,
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Country ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.country.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Country not found" }),
                { status: 404 }
            );
        }

        const updatedCountry = await prisma.country.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                iso2: iso2 ?? existing.iso2,
                iso3: iso3 ?? existing.iso3,
                numeric_code: numeric_code ?? existing.numeric_code,
                phonecode: phonecode ?? existing.phonecode,

                // optional fields
                capital: capital ?? existing.capital,
                currency: currency ?? existing.currency,
                currency_name: currency_name ?? existing.currency_name,
                currency_symbol: currency_symbol ?? existing.currency_symbol,
                nationality: nationality ?? existing.nationality,
                postal_code_format: postal_code_format ?? existing.postal_code_format,
                postal_code_regex: postal_code_regex ?? existing.postal_code_regex,
                emoji: emoji ?? existing.emoji,
                emojiU: emojiU ?? existing.emojiU,

                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Country updated successfully",
                data: updatedCountry,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update country",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// ✅ SOFT DELETE COUNTRY
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Country ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.country.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Country not found" }),
                { status: 404 }
            );
        }

        const deletedCountry = await prisma.country.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({
                message: "Country deleted successfully",
                data: deletedCountry,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete country",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}