import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// GET – LIST ALL APPLIED PROMO CODES (NO FILTER)
// =============================
export async function GET() {
    try {
        const appliedPromoCodes = await prisma.promoUser.findMany({
            include: {
                promo: true,   // promo details
            },
            orderBy: {
                id: "desc",
            },
        });

        return new Response(
            JSON.stringify({
                message: "Applied promo codes fetched successfully",
                data: appliedPromoCodes,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch applied promo codes",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

