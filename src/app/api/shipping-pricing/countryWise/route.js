import { PrismaClient } from "@prisma/client";
import { convertPrice } from "@/lib/priceConverter";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const countryCode = req.headers.get("x-country");

        if (!countryCode) {
            return new Response(
                JSON.stringify({ message: "Country header missing" }),
                { status: 400 }
            );
        }

        console.log("🔥 SHIPPING HEADER COUNTRY:", countryCode);

        const countryPricingList = await prisma.countryPricing.findMany({
            where: { deleted: 0, active: true },
        });

        const pricing = await prisma.shippingPricing.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        const convertedShipping = pricing.map((item) => {
            const basePrice = Number(item.price) || 0;

            const { price, currency, currencySymbol } =
                convertPrice(basePrice, countryCode, countryPricingList);

            return {
                ...item,
                price,
                currency,
                currencySymbol,
            };
        });

        return new Response(
            JSON.stringify({
                message: "Shipping Pricing fetched successfully",
                data: convertedShipping,
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


