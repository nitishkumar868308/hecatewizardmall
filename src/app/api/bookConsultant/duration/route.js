import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET: Fetch all active (non-deleted) durations
 */
export async function GET() {
    try {
        const durations = await prisma.duration.findMany({
            where: {
                deleted: false,
            },
            orderBy: {
                minutes: "asc",
            },
        });

        return new Response(
            JSON.stringify({
                message: "Durations fetched successfully",
                data: durations,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch durations",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

/**
 * POST: Create new duration
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { minutes, description, active } = body;

        if (!minutes || typeof minutes !== "number") {
            return new Response(
                JSON.stringify({ message: "Minutes is required and must be a number" }),
                { status: 400 }
            );
        }

        // prevent duplicate duration
        const exists = await prisma.duration.findFirst({
            where: {
                minutes,
                deleted: false,
            },
        });


        if (exists) {
            return new Response(
                JSON.stringify({
                    message: `Duration ${minutes} minutes already exists`,
                    minutes: minutes
                }),
                { status: 409 }
            );
        }


        const duration = await prisma.duration.create({
            data: {
                minutes,
                description,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Duration created successfully",
                data: duration,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to create duration",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

/**
 * PUT: Update duration
 */
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, minutes, description, active, deleted } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Duration ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.duration.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Duration not found" }),
                { status: 404 }
            );
        }

        if (minutes && minutes !== existing.minutes) {
            const duplicate = await prisma.duration.findFirst({
                where: {
                    minutes,
                    deleted: false,
                },
            });

            if (duplicate) {
                return new Response(
                    JSON.stringify({
                        message: `Duration ${minutes} minutes already exists`,
                        minutes,
                    }),
                    { status: 409 }
                );
            }
        }

        const updatedDuration = await prisma.duration.update({
            where: { id },
            data: {
                minutes: minutes ?? existing.minutes,
                description: description ?? existing.description,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Duration updated successfully",
                data: updatedDuration,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update duration",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

/**
 * DELETE: Soft delete duration
 */
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Duration ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.duration.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Duration not found" }),
                { status: 404 }
            );
        }

        const deletedDuration = await prisma.duration.update({
            where: { id },
            data: {
                deleted: true,
                active: false,
            },
        });

        return new Response(
            JSON.stringify({
                message: "Duration deleted successfully",
                data: deletedDuration,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to delete duration",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
