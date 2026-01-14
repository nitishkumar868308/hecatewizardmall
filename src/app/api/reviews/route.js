import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const reviews = await prisma.reviews.findMany({
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Reviews fetched successfully", data: reviews }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch reviews", error: error.message }),
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, userName, productId, comment, rating } = body;

        if (!userId || !userName || !comment || !rating) {
            return new Response(
                JSON.stringify({ message: "All fields are required" }),
                { status: 400 }
            );
        }

        const review = await prisma.reviews.create({
            data: {
                userId,
                userName,
                comment,
                productId,
                rating,
                status: "pending", // default pending, admin will approve
                active: true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Review submitted successfully", data: review }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to submit review", error: error.message }),
            { status: 500 }
        );
    }
}


export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, status, active } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
        }

        const existing = await prisma.reviews.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        const updatedReview = await prisma.reviews.update({
            where: { id },
            data: {
                status: status ?? existing.status,
                active: active ?? existing.active,
            },
        });

        return new Response(
            JSON.stringify({ message: "Review updated successfully", data: updatedReview }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update review", error: error.message }),
            { status: 500 }
        );
    }
}


export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
        }

        const existing = await prisma.reviews.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        const deletedReview = await prisma.reviews.update({
            where: { id },
            data: { active: false }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Review deleted successfully", data: deletedReview }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete review", error: error.message }),
            { status: 500 }
        );
    }
}

