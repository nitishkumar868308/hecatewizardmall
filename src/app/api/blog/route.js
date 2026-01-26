import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const calculateReadTime = (text = "") => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
};



export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug"); // optional slug query

        if (slug) {
            // --- Fetch single blog by slug ---
            const blog = await prisma.blog.findFirst({
                where: { slug, deleted: false, active: true },
            });

            if (!blog) {
                return new Response(
                    JSON.stringify({ message: "Blog not found", data: null }),
                    { status: 404 }
                );
            }

            return new Response(
                JSON.stringify({ message: "Blog fetched successfully", data: blog }),
                { status: 200 }
            );
        }

        // --- Fetch all blogs if no slug provided ---
        const blogs = await prisma.blog.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Blogs fetched successfully", data: blogs }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch blogs", error: error.message }),
            { status: 500 }
        );
    }
}

// CREATE NEW BLOG
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, authorName, category, excerpt, description, image, isPublished, authorImage } = body;

        if (!title || !description) {
            return new Response(JSON.stringify({ message: "Title and description are required" }), { status: 400 });
        }

        // Slug auto-generate
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const readTime = calculateReadTime(description);

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                authorName,
                authorImage: authorImage || null,
                category,
                excerpt,
                description,
                image: image || null,
                readTime,
                isPublished: isPublished ?? false,
            },
        });

        return new Response(JSON.stringify({ message: "Blog created successfully", data: blog }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to create blog", error: error.message }), { status: 500 });
    }
}

// UPDATE BLOG
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, title, authorName, category, excerpt, description, image, isPublished, active, deleted, authorImage } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Blog ID is required" }), { status: 400 });
        }

        const existing = await prisma.blog.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        // Slug auto-update if title changes
        const slug = title ? title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") : existing.slug;

        const readTime = description
            ? calculateReadTime(description)
            : existing.readTime;

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title: title ?? existing.title,
                slug,
                authorName: authorName ?? existing.authorName,
                authorImage: authorImage ?? existing.authorImage, 
                category: category ?? existing.category,
                excerpt: excerpt ?? existing.excerpt,
                description: description ?? existing.description,
                image: image ?? existing.image,
                isPublished: isPublished ?? existing.isPublished,
                readTime,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(JSON.stringify({ message: "Blog updated successfully", data: updatedBlog }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to update blog", error: error.message }), { status: 500 });
    }
}

// SOFT DELETE BLOG
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Blog ID is required" }), { status: 400 });
        }

        const existing = await prisma.blog.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        const deletedBlog = await prisma.blog.update({
            where: { id },
            data: { deleted: true }, // soft delete
        });

        return new Response(JSON.stringify({ message: "Blog deleted successfully", data: deletedBlog }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to delete blog", error: error.message }), { status: 500 });
    }
}
