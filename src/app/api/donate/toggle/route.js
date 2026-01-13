import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req) {
    const { id } = await req.json();

    const campaign = await prisma.donationCampaign.findUnique({
        where: { id },
    });

    if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    const updated = await prisma.donationCampaign.update({
        where: { id },
        data: {
            active: !campaign.active, // 👈 toggle
        },
    });

    return Response.json({ data: updated });
}
