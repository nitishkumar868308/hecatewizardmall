import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET reviews (all or for specific blog)
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const blogId = url.searchParams.get("blogId"); // optional

        const reviews = await prisma.blogReviews.findMany({
            where: {
                active: true,
                ...(blogId && { blogId: parseInt(blogId) }), // blogId filter only if provided
            },
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


// POST a new review
export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, userName, blogId, comment, rating } = body;

        if (!userId || !blogId || !comment || !rating) {
            return new Response(
                JSON.stringify({ message: "userId, blogId, comment, and rating are required" }),
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return new Response(
                JSON.stringify({ message: "Rating must be between 1 and 5" }),
                { status: 400 }
            );
        }

        // check if user already reviewed
        const existing = await prisma.blogReviews.findUnique({
            where: { userId_blogId: { userId, blogId } },
        });

        if (existing) {
            return new Response(
                JSON.stringify({ message: "You have already reviewed this blog" }),
                { status: 400 }
            );
        }

        const review = await prisma.blogReviews.create({
            data: {
                userId,
                userName,
                blogId,
                comment,
                rating,
                status: "pending", // default pending
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

// PUT - update review (admin approve/reject or user edit)
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, comment, rating, status, active } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
        }

        const existing = await prisma.blogReviews.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        const updated = await prisma.blogReviews.update({
            where: { id },
            data: {
                comment: comment ?? existing.comment,
                rating: rating ?? existing.rating,
                status: status ?? existing.status,
                active: active ?? existing.active,
            },
        });

        return new Response(
            JSON.stringify({ message: "Review updated successfully", data: updated }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update review", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE - soft delete
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
        }

        const existing = await prisma.blogReviews.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        const deleted = await prisma.blogReviews.update({
            where: { id },
            data: { active: false },
        });

        return new Response(
            JSON.stringify({ message: "Review deleted successfully", data: deleted }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete review", error: error.message }),
            { status: 500 }
        );
    }
}
