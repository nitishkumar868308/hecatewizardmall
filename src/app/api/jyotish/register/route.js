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
            phoneNumber,
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
        } = body;

        if (!fullName || !email || !phoneNumber) {
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
            where: { phoneNumber }
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
                phoneNumber,
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
                    },
                },

                services: {
                    create: services?.map((service) => ({
                        serviceName: service.serviceName,
                        price: service.price,
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
        const { id, ...updateData } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Astrologer ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.astrologerAccount.findUnique({
            where: { id },
            include: { profile: true },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Astrologer not found" }),
                { status: 404 }
            );
        }

        // Update main account
        await prisma.astrologerAccount.update({
            where: { id },
            data: {
                fullName: updateData.fullName ?? existing.fullName,
                email: updateData.email ?? existing.email,
                phoneNumber: updateData.phoneNumber ?? existing.phoneNumber,
                gender: updateData.gender ?? existing.gender,
            },
        });

        // Update profile separately
        if (existing.profile) {
            await prisma.astrologerProfile.update({
                where: { astrologerId: id },
                data: {
                    experience: updateData.experience,
                    bio: updateData.bio,
                    address: updateData.address,
                    city: updateData.city,
                    state: updateData.state,
                    country: updateData.country,
                    languages: updateData.languages,
                },
            });
        }

        const updated = await prisma.astrologerAccount.findUnique({
            where: { id },
            include: {
                profile: true,
                services: true,
                documents: true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Astrologer updated successfully",
                data: updated,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update astrologer", error: error.message }),
            { status: 500 }
        );
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