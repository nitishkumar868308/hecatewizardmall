import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// POST – USER DONATES TO A CAMPAIGN
// =============================
export async function POST_USER_DONATION(req) {
    try {
        const body = await req.json();
        // body: { donationCampaignId, userName, amount }

        const donation = await prisma.userDonation.create({
            data: {
                userName: body.userName,
                amount: parseFloat(body.amount),
                donationCampaignId: body.donationCampaignId,
            },
        });

        return Response.json({ message: "Donation recorded", data: donation });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
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
