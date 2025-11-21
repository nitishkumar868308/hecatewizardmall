import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 GET - Fetch all active states
export async function GET(req) {
    try {
        const states = await prisma.state.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "States fetched successfully", data: states }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch states", error: error.message }),
            { status: 500 }
        );
    }
}

// 📌 POST - Create new state
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, active } = body;

        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "State name is required and must be a string" }),
                { status: 400 }
            );
        }

        const state = await prisma.state.create({
            data: {
                name,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "State created successfully", data: state }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create state", error: error.message }),
            { status: 500 }
        );
    }
}

// 📌 PUT - Update state
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, active, deleted } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "State ID is required" }), {
                status: 400,
            });
        }

        const existing = await prisma.state.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "State not found" }), {
                status: 404,
            });
        }

        const updatedState = await prisma.state.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({
                message: "State updated successfully",
                data: updatedState,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update state", error: error.message }),
            { status: 500 }
        );
    }
}

// 📌 DELETE - Soft delete state
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "State ID is required" }), {
                status: 400,
            });
        }

        const existing = await prisma.state.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "State not found" }), {
                status: 404,
            });
        }

        const deletedState = await prisma.state.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({
                message: "State deleted successfully",
                data: deletedState,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete state", error: error.message }),
            { status: 500 }
        );
    }
}
