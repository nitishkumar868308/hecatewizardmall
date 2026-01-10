import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
    const { code, userId } = await req.json();

    const promo = await prisma.promoCode.findFirst({
        where: {
            code,
            active: true,
            deleted: false,
            validFrom: { lte: new Date() },
            validTill: { gte: new Date() }
        },
        include: { users: true }
    });

    if (!promo) return Response.json({ error: "Invalid promo" }, { status: 400 });

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
        return Response.json({ error: "Promo exhausted" }, { status: 400 });

    if (promo.appliesTo === "SPECIFIC_USERS") {
        const pu = promo.users.find(u => u.userId === userId);
        if (!pu) return Response.json({ error: "Not allowed" }, { status: 403 });

        if (pu.usageLimit && pu.usedCount >= pu.usageLimit)
            return Response.json({ error: "Usage limit reached" }, { status: 400 });
    }

    return Response.json({ promo });
}

