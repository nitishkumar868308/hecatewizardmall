import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
}

// Helper function to generate random SKU
function generateSKU() {
    return `PROD-${Math.floor(100000 + Math.random() * 900000)}`;
}

// GET all products
export async function GET(req) {
    try {
        const products = await prisma.product.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
            include: { subcategory: true } // include subcategory info
        });

        return new Response(
            JSON.stringify({ message: "Products fetched successfully", data: products }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch products", error: error.message }),
            { status: 500 }
        );
    }
}

// POST create product
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, subcategoryId, image, description, active, sku, slug, metaTitle, metaDescription, keywords } = body;

        // Validation
        if (!name || typeof name !== "string") {
            return new Response(JSON.stringify({ message: "Name is required and must be a string" }), { status: 400 });
        }
        if (!subcategoryId) {
            return new Response(JSON.stringify({ message: "subcategoryId is required" }), { status: 400 });
        }
        if (active !== undefined && typeof active !== "boolean") {
            return new Response(JSON.stringify({ message: "Active must be true or false" }), { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                subcategoryId,
                image: image ?? null,
                description: description ?? null,
                active: active ?? true,
                sku: sku ?? generateSKU(),
                slug: slug ?? generateSlug(name),
                metaTitle: metaTitle ?? name,
                metaDescription: metaDescription ?? description ?? "",
                keywords: keywords ?? "",
            },
        });

        return new Response(
            JSON.stringify({ message: "Product created successfully", data: product }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create product", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, subcategoryId, image, description, active, deleted, sku, slug, metaTitle, metaDescription, keywords } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                subcategoryId: subcategoryId ?? existing.subcategoryId,
                image: image ?? existing.image,
                description: description ?? existing.description,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                sku: sku ?? existing.sku,
                slug: slug ?? (name ? generateSlug(name) : existing.slug),
                metaTitle: metaTitle ?? (name ?? existing.name),
                metaDescription: metaDescription ?? (description ?? existing.description ?? ""),
                keywords: keywords ?? existing.keywords,
            },
        });

        return new Response(
            JSON.stringify({ message: "Product updated successfully", data: updatedProduct }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update product", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE soft delete product
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const deletedProduct = await prisma.product.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Product deleted successfully", data: deletedProduct }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete product", error: error.message }),
            { status: 500 }
        );
    }
}
