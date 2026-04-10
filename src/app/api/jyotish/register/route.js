import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| GET - Get All Astrologers with Full Details
|--------------------------------------------------------------------------
*/
export async function GET() {
    try {
        const astrologers = await prisma.astrologerAccount.findMany({
            include: {
                profile: true,
                services: true,
                documents: true,
                certificates: true,
                penalties: true,
                extraDocuments: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({
                message: "Astrologers fetched successfully",
                data: astrologers,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch astrologers", error: error.message }),
            { status: 500 }
        );
    }
}

/*
|--------------------------------------------------------------------------
| POST - Create Full Astrologer (Account + Profile + Services + Documents)
|--------------------------------------------------------------------------
*/
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            fullName,
            email,
            phone,         // ✅ full number
            countryCode,   // ✅ +91
            phoneLocal,    // ✅ 9876543210
            gender,
            experience,
            bio,
            address,
            city,
            state,
            country,
            languages,
            services,
            documents,
            selectedIdProof
        } = body;

        if (!fullName || !email || !phone) {
            return new Response(
                JSON.stringify({ message: "Full name, email and phone number are required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.astrologerAccount.findUnique({
            where: { email }
        });

        if (existing) {
            return new Response(
                JSON.stringify({ message: "Email already registered" }),
                { status: 400 }
            );
        }

        const existingPhone = await prisma.astrologerAccount.findUnique({
            where: { phone }
        });

        if (existingPhone) {
            return new Response(
                JSON.stringify({ message: "Phone number already registered" }),
                { status: 400 }
            );
        }

        const astrologer = await prisma.astrologerAccount.create({
            data: {
                fullName,
                email,
                phone,         // +919876543210
                countryCode,   // +91
                phoneLocal,    // 9876543210
                gender,

                profile: {
                    create: {
                        experience,
                        bio,
                        address,
                        city,
                        state,
                        country,
                        languages: languages || [],
                        idProofType: selectedIdProof || null,                 // selected type
                        idProofValue: body[selectedIdProof] || null,          // user input
                    },
                },

                services: {
                    create: services?.map((service) => ({
                        serviceName: service.serviceName,
                        price: service.price,

                        // ✅ ADD THESE
                        currency: service.currency,
                        currencySymbol: service.currencySymbol,
                    })) || [],
                },

                documents: {
                    create: documents?.map((doc) => ({
                        type: doc.type,
                        fileUrl: doc.fileUrl,
                        verified: false,
                    })) || [],
                },
            },

            include: {
                profile: true,
                services: true,
                documents: true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Astrologer created successfully",
                data: astrologer,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create astrologer", error: error.message }),
            { status: 500 }
        );
    }
}

/*
|--------------------------------------------------------------------------
| PUT - Update Astrologer
|--------------------------------------------------------------------------
*/
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "ID required" }), { status: 400 });
        }

        const existing = await prisma.astrologerAccount.findUnique({
            where: { id }
        });

        if (!existing) {
            return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
        }

        const updatePayload = {};

        // dynamic fields
        if (data.displayName !== undefined) updatePayload.displayName = data.displayName;
        if (data.isApproved !== undefined) updatePayload.isApproved = data.isApproved;
        if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
        if (data.bio !== undefined) updatePayload.bio = data.bio;

        // ✅ NEW: reject handling
        if (data.isRejected !== undefined) updatePayload.isRejected = data.isRejected;
        if (data.rejectReason !== undefined) updatePayload.rejectReason = data.rejectReason;

        // 👉 optional: reject hone par auto reset (light logic, heavy validation nahi)
        if (data.isRejected === true) {
            updatePayload.isApproved = false;
            updatePayload.isActive = false;
        }

        // penalty
        if (data.penalties && Array.isArray(data.penalties)) {
            for (const p of data.penalties) {

                if (!p.amount || !p.reason) continue;

                if (p.id) {
                    // ✅ UPDATE
                    await prisma.astrologerPenalty.update({
                        where: { id: p.id },
                        data: {
                            amount: Number(p.amount),
                            reason: p.reason,
                            settlement: p.settlement ? Number(p.settlement) : null,
                            paid: p.paid ? Number(p.paid) : null,
                        }
                    });
                } else {
                    // ✅ CREATE
                    await prisma.astrologerPenalty.create({
                        data: {
                            astrologerId: id,
                            amount: Number(p.amount),
                            reason: p.reason,
                            settlement: p.settlement ? Number(p.settlement) : null,
                            paid: p.paid ? Number(p.paid) : null,
                        }
                    });
                }
            }
        }

        // extra documents
        if (data.extraDocuments && Array.isArray(data.extraDocuments)) {
            for (const doc of data.extraDocuments) {

                // ❌ skip invalid
                if (!doc.title || !doc.fileUrl) continue;

                if (doc.id) {
                    // ✅ UPDATE
                    await prisma.astrologerExtraDocument.update({
                        where: { id: doc.id },
                        data: {
                            title: doc.title,
                            fileUrl: doc.fileUrl
                        }
                    });
                } else {
                    // ✅ CREATE
                    await prisma.astrologerExtraDocument.create({
                        data: {
                            astrologerId: id,
                            title: doc.title,
                            fileUrl: doc.fileUrl
                        }
                    });
                }
            }
        }

        if (data.isTop && data.topRank) {
            const newRank = Number(data.topRank);

            // 👉 agar koi aur already same rank pe hai
            const existingRankUser = await prisma.astrologerAccount.findFirst({
                where: {
                    topRank: newRank,
                    NOT: { id }
                }
            });

            if (existingRankUser) {
                // 👉 usko next rank pe shift kar do
                await prisma.astrologerAccount.update({
                    where: { id: existingRankUser.id },
                    data: {
                        topRank: newRank + 1
                    }
                });
            }

            // 👉 max 3 constraint
            if (newRank > 3) {
                return new Response(JSON.stringify({
                    message: "Max rank is 3"
                }), { status: 400 });
            }
        }

        // ✅ NEW FIELDS
        if (data.isTop !== undefined) {
            updatePayload.isTop = data.isTop;
        }

        // 👉 agar isTop false ho → rank hata do
        if (data.isTop === false) {
            updatePayload.topRank = null;
        }

        // 👉 agar isTop true ho → rank set karo
        if (data.topRank !== undefined) {
            updatePayload.topRank = Number(data.topRank);
        }

        // revenue
        if (data.revenueAstrologer !== undefined) {
            updatePayload.revenueAstrologer = data.revenueAstrologer;
        }

        if (data.revenueAdmin !== undefined) {
            updatePayload.revenueAdmin = data.revenueAdmin;
        }

        if (data.gst !== undefined) {
            updatePayload.gst = data.gst;
        }

        // update account
        const updatedAstro = await prisma.astrologerAccount.update({
            where: { id },
            data: updatePayload,
            include: {
                profile: true,
                services: true,
                documents: true,
                certificates: true,
                penalties: true,
                extraDocuments: true

            }
        });

        // handle certificates separately
        if (data.serviceDocs) {
            const entries = Object.entries(data.serviceDocs);

            for (const [serviceId, fileUrl] of entries) {
                await prisma.certificate.create({
                    data: {
                        astrologerId: id,
                        serviceId: Number(serviceId),
                        fileUrl,
                    },
                });
            }
        }

        return new Response(JSON.stringify({
            message: "Updated successfully",
            data: updatedAstro
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            message: "Update failed",
            error: error.message
        }), { status: 500 });
    }
}

/*
|--------------------------------------------------------------------------
| DELETE - Delete Astrologer (Hard Delete)
|--------------------------------------------------------------------------
*/
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Astrologer ID is required" }),
                { status: 400 }
            );
        }

        await prisma.astrologerAccount.delete({
            where: { id },
        });

        return new Response(
            JSON.stringify({ message: "Astrologer deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete astrologer", error: error.message }),
            { status: 500 }
        );
    }
}