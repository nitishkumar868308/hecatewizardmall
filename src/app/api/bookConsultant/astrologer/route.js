import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET: Fetch all active astrologers
 */
export async function GET() {
    try {
        const astrologers = await prisma.astrologer.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
            include: {
                documents: true,
            },
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
            JSON.stringify({
                message: "Failed to fetch astrologers",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

/**
 * POST: Create a new astrologer
 */
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            fullName,
            displayName,
            profileImage,
            phone,
            service,
            specialty,
            description,
            documents = [], // array of file URLs
            userId,         // optional, selected user
            active = true,
        } = body;

        if (!fullName || typeof fullName !== "string") {
            return new Response(JSON.stringify({ message: "Full Name is required" }), { status: 400 });
        }

        // Create astrologer
        const astrologer = await prisma.astrologer.create({
            data: {
                fullName,
                displayName,
                profileImage,
                phone,
                service,
                specialty,
                description,
                active,
                userId,
                documents: {
                    create: documents.map((url) => ({ fileUrl: url })),
                },
            },
            include: {
                documents: true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Astrologer created successfully", data: astrologer }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create astrologer", error: error.message }),
            { status: 500 }
        );
    }
}


/**
 * PUT: Update an astrologer
 */
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            fullName,
            displayName,
            profileImage,
            phone,
            service,
            specialty,
            description,
            documents = [], // new documents
            userId,
            active,
            deleted,
        } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Astrologer ID is required" }), { status: 400 });
        }

        const existing = await prisma.astrologer.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Astrologer not found" }), { status: 404 });
        }

        const updatedAstrologer = await prisma.astrologer.update({
            where: { id },
            data: {
                fullName: fullName ?? existing.fullName,
                displayName: displayName ?? existing.displayName,
                profileImage: profileImage ?? existing.profileImage,
                phone: phone ?? existing.phone,
                service: service ?? existing.service,
                specialty: specialty ?? existing.specialty,
                description: description ?? existing.description,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                userId: userId ?? existing.userId,
                documents: documents.length
                    ? {
                        create: documents.map((url) => ({ fileUrl: url })),
                    }
                    : undefined,
            },
            include: { documents: true },
        });

        return new Response(
            JSON.stringify({ message: "Astrologer updated successfully", data: updatedAstrologer }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update astrologer", error: error.message }),
            { status: 500 }
        );
    }
}


/**
 * DELETE: Soft delete an astrologer
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

        const existing = await prisma.astrologer.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Astrologer not found" }),
                { status: 404 }
            );
        }

        const deletedAstrologer = await prisma.astrologer.update({
            where: { id },
            data: { deleted: true, active: false },
        });

        return new Response(
            JSON.stringify({
                message: "Astrologer deleted successfully",
                data: deletedAstrologer,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete astrologer",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
