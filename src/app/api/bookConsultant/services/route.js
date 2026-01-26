import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET: Fetch all active (non-deleted) services with their prices
 */
export async function GET() {
    try {
        const services = await prisma.service.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
            include: {
                prices: true, // assuming you have a ServicePrice table linking durationId & price
            },
        });

        return new Response(
            JSON.stringify({
                message: "Services fetched successfully",
                data: services,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch services",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

/**
 * POST: Create new service
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, shortDesc, longDesc, image, active, prices } = body;

        if (!title) {
            return new Response(
                JSON.stringify({ message: "Service title is required" }),
                { status: 400 }
            );
        }

        // Prevent duplicate title
        const exists = await prisma.service.findFirst({
            where: { title, deleted: false },
        });

        if (exists) {
            return new Response(
                JSON.stringify({ message: `Service "${title}" already exists` }),
                { status: 409 }
            );
        }

        const service = await prisma.service.create({
            data: {
                title,
                shortDesc,
                longDesc,
                image,
                active: active ?? true,
                prices: {
                    create: prices || [],
                },
            },
            include: {
                prices: true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Service created successfully", data: service }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create service", error: error.message }),
            { status: 500 }
        );
    }
}

/**
 * PUT: Update service
 */
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, title, shortDesc, longDesc, image, active, deleted, prices } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Service ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.service.findUnique({
            where: { id },
            include: { prices: true },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Service not found" }),
                { status: 404 }
            );
        }

        // Check for duplicate title
        if (title && title !== existing.title) {
            const duplicate = await prisma.service.findFirst({
                where: { title, deleted: false },
            });
            if (duplicate) {
                return new Response(
                    JSON.stringify({ message: `Service "${title}" already exists` }),
                    { status: 409 }
                );
            }
        }

        // Update service
        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                title: title ?? existing.title,
                shortDesc: shortDesc ?? existing.shortDesc,
                longDesc: longDesc ?? existing.longDesc,
                image: image ?? existing.image,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        // Update prices if provided
        if (prices && Array.isArray(prices)) {
            // Delete existing prices
            await prisma.serviceDuration.deleteMany({ where: { serviceId: id } });
            // Create new prices
            await prisma.serviceDuration.createMany({
                data: prices.map(p => ({ serviceId: id, durationId: p.durationId, price: p.price })),
            });
        }

        const serviceWithPrices = await prisma.service.findUnique({
            where: { id },
            include: { prices: true },
        });

        return new Response(
            JSON.stringify({ message: "Service updated successfully", data: serviceWithPrices }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update service", error: error.message }),
            { status: 500 }
        );
    }
}

/**
 * DELETE: Soft delete service
 */
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Service ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.service.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Service not found" }),
                { status: 404 }
            );
        }

        const deletedService = await prisma.service.update({
            where: { id },
            data: { deleted: true, active: false },
        });

        return new Response(
            JSON.stringify({ message: "Service deleted successfully", data: deletedService }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete service", error: error.message }),
            { status: 500 }
        );
    }
}
