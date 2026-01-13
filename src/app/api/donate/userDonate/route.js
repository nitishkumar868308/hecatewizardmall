import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// GET – LIST USER DONATIONS
// =============================
export async function GET() {
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
