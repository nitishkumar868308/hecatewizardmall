import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================
// GET – LIST PROMOS
// =============================
export async function GET() {
    try {
        const promos = await prisma.promoCode.findMany({
            where: { deleted: false },
            include: {
                users: {
                    include: {
                        promo: false
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return Response.json({ data: promos });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}


// export async function POST(req) {
//     try {
//         const body = await req.json();

//         const promo = await prisma.promoCode.create({
//             data: {
//                 code: body.code,
//                 discountType: body.discountType,
//                 discountValue: body.discountValue,
//                 validFrom: new Date(body.validFrom),
//                 validTill: new Date(body.validTill),
//                 usageLimit: body.usageLimit || null,
//                 appliesTo: body.appliesTo,
//                 users: body.appliesTo === "SPECIFIC_USERS"
//                     ? {
//                         create: body.users.map(u => ({
//                             userId: u.userId,
//                             usageLimit: u.usageLimit || null
//                         }))
//                     }
//                     : undefined
//             }
//         });

//         return Response.json({ message: "Promo created", promo });
//     } catch (e) {
//         return Response.json({ error: e.message }, { status: 500 });
//     }
// }

export async function POST(req) {
    try {
        const body = await req.json();

        const promo = await prisma.promoCode.create({
            data: {
                code: body.code,
                discountType: body.discountType,
                discountValue: body.discountValue,
                validFrom: new Date(body.validFrom),
                validTill: new Date(body.validTill),
                usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
                appliesTo: body.appliesTo,

                eligibleUsers: body.appliesTo === "SPECIFIC_USERS"
                    ? {
                        create: body.users.map(u => ({
                            userId: u.userId, // ✅ only userId, limit not here
                        }))
                    }
                    : undefined, // null for ALL_USERS

                users: {
                    create: [] // usage tracking
                }
            }
        });


        return Response.json({ message: "Promo created", promo });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}



export async function PUT(req) {
    try {
        const body = await req.json();

        await prisma.promoUser.deleteMany({
            where: { promoId: body.id }
        });

        const updated = await prisma.promoCode.update({
            where: { id: body.id },
            data: {
                code: body.code,
                discountType: body.discountType,
                discountValue: body.discountValue,
                validFrom: new Date(body.validFrom),
                validTill: new Date(body.validTill),
                usageLimit: body.usageLimit || null,
                appliesTo: body.appliesTo,
                active: body.active,
                users: body.appliesTo === "SPECIFIC_USERS"
                    ? {
                        create: body.users.map(u => ({
                            userId: u.userId,
                            usageLimit: u.usageLimit || null
                        }))
                    }
                    : undefined
            }
        });

        return Response.json({
            message: "Updated",
            data: updated // Redux slice ko ye chahiye
        });

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}


export async function DELETE(req) {
    const { id } = await req.json();

    await prisma.promoCode.update({
        where: { id },
        data: { deleted: true }
    });

    return Response.json({ message: "Deleted" });
}
