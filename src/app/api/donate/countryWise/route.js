import { PrismaClient } from "@prisma/client";
import { convertPrice } from "@/lib/priceConverter";

const prisma = new PrismaClient();

// =============================
// GET – LIST DONATIONS (Campaigns)
// =============================
export async function GET(req) {
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

            // 🔥 Convert each amount in amounts array
            const convertedAmounts = (item.amounts || []).map((amt) => {
                const baseAmount = Number(amt) || 0;

                const { price } = convertPrice(
                    baseAmount,
                    countryCode,
                    countryPricingList
                );

                return price;
            });

            // Currency ek baar hi nikalo (first amount se)
            const { currency, currencySymbol } = convertPrice(
                1,
                countryCode,
                countryPricingList
            );

            return {
                ...item,
                amounts: convertedAmounts,
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
