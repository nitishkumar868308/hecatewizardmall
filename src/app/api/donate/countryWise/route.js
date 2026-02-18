import { PrismaClient } from "@prisma/client";
import { convertPrice } from "@/lib/priceConverter";

const prisma = new PrismaClient();

// =============================
// GET – LIST DONATIONS (Campaigns)
// =============================
export async function GET() {
    try {
        const countryCode = req.headers.get("x-country");

        if (!countryCode) {
            return new Response(
                JSON.stringify({ message: "Country header missing" }),
                { status: 400 }
            );
        }
        const countryPricingList = await prisma.countryPricing.findMany({
            where: { deleted: 0, active: true },
        });
        const convertedDonation = await prisma.donationCampaign.findMany({
            orderBy: { createdAt: "desc" },
        });

        const donations = convertedDonation.map((item) => {
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
                message: "Donation fetched successfully",
                data: donations,
            }),
            { status: 200 }
        );

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
