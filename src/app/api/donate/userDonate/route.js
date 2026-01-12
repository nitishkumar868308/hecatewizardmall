import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// POST – USER DONATES TO A CAMPAIGN
// =============================
export async function POST_USER_DONATION(req) {
    const { userName, donationCampaignId, amount } = await req.json();

    const donation = await prisma.userDonation.create({
        data: {
            userName,
            donationCampaignId,
            amount: parseFloat(amount),
        },
    });

    return Response.json({ message: "Donation recorded", data: donation });
}


// =============================
// GET – LIST USER DONATIONS
// =============================
export async function GET_USER_DONATIONS() {
    try {
        const userDonations = await prisma.userDonation.findMany({
            include: {
                donationCampaign: true,
            },
            orderBy: { donatedAt: "desc" },
        });

        return Response.json({ data: userDonations });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
