import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// GET – LIST DONATIONS (Campaigns)
// =============================
export async function GET() {
    try {
        const donations = await prisma.donationCampaign.findMany({
            include: {
                userDonations: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return Response.json({ data: donations });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}

// =============================
// POST – CREATE NEW DONATION CAMPAIGN
// =============================
export async function POST(req) {
    try {
        const body = await req.json();

        const newCampaign = await prisma.donationCampaign.create({
            data: {
                title: body.title,
                description: body.description,
                amounts: body.amounts.map(Number),
                active: true,
            },
        });

        return Response.json({ message: "Donation campaign created", data: newCampaign });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}

// =============================
// PUT – UPDATE DONATION CAMPAIGN
// =============================
export async function PUT(req) {
    try {
        const body = await req.json();

        const updatedCampaign = await prisma.donationCampaign.update({
            where: { id: body.id },
            data: {
                title: body.title,
                description: body.description,
                amounts: body.amounts.map(Number),
            },
        });

        return Response.json({ message: "Donation campaign updated", data: updatedCampaign });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}

// =============================
// DELETE – DELETE DONATION CAMPAIGN
// =============================
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        await prisma.donationCampaign.delete({
            where: { id },
        });

        return Response.json({ message: "Donation campaign deleted" });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
