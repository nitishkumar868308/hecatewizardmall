import { PrismaClient } from "@prisma/client";
import { convertProducts } from "@/lib/priceConverter";

const prisma = new PrismaClient();

// Post Products
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            name,
            offer,
            category,
            subcategory,
            short,
            image,
            description,
            active,
            sku,
            slug,
            metaTitle,
            metaDescription,
            price,
            otherCountriesPrice,
            stock,
            size,
            color,
            variations
        } = body;

        // Create main product
        const product = await prisma.product.create({
            data: {
                name,
                offer,
                category,
                subcategory,
                image: Array.isArray(image) ? image : [],
                description: description ?? null,
                active: active ?? true,
                sku,
                slug,
                short,
                metaTitle: metaTitle ?? `${name} | YourStore`,
                metaDescription: metaDescription ?? description ?? "",
                otherCountriesPrice: otherCountriesPrice?.toString() ?? null,
                price: price?.toString() ?? null,
                stock: stock?.toString() ?? null,
                size: size ?? null,
                color: color ?? null,
                variations: variations && Array.isArray(variations) && variations.length > 0
                    ? {
                        create: variations.map(v => ({
                            variationName: v.variation_name,
                            sku: v.sku,
                            price: v.price?.toString() ?? price?.toString() ?? null,
                            stock: v.stock?.toString() ?? stock?.toString() ?? null,
                            image: Array.isArray(v.image) ? v.image : (v.image ? [v.image] : []),
                            description: v.description ?? description ?? null,
                            name: v.name ?? name,
                            otherCountriesPrice: v.otherCountriesPrice?.toString() ?? otherCountriesPrice?.toString() ?? null
                        }))
                    }
                    : undefined
            },
            include: {
                variations: true,
                category: true,
                subcategory: true
            }
        });

        // Create variations
        // if (variations && Array.isArray(variations) && variations.length > 0) {
        //     const variationsData = variations.map(v => ({
        //         productId: product.id,
        //         variationName: v.variation_name,
        //         price: v.price?.toString() ?? price?.toString() ?? null,
        //         stock: v.stock?.toString() ?? stock?.toString() ?? null,
        //         sku: v.sku,
        //         image: v.image ?? null,
        //         description: v.description ?? description ?? null,
        //         name: v.name ?? name
        //     }));

        //     await prisma.productVariation.createMany({
        //         data: variationsData
        //     });
        // }

        return new Response(
            JSON.stringify({ message: "Product created successfully with variations", data: product }),
            { status: 201 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create product", error: error.message }),
            { status: 500 }
        );
    }
}

// GET all products
// export async function GET(req) {
//     try {
//         const products = await prisma.product.findMany({
//             where: { deleted: 0 },
//             orderBy: { createdAt: "desc" },
//             include: { subcategory: true, variations: true }
//         });

//         return new Response(
//             JSON.stringify({ message: "Products fetched successfully", data: products }),
//             { status: 200 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to fetch products", error: error.message }),
//             { status: 500 }
//         );
//     }
// }

export async function GET(req) {
    try {
        // Get country code from frontend or fallback to "IN"
        const countryCode = req.headers.get("x-country") || "IN";

        // Fetch all country pricing
        const countryPricingList = await prisma.countryPricing.findMany({
            where: { deleted: 0, active: true },
        });

        // Fetch products with variations, category, subcategory
        const products = await prisma.product.findMany({
            include: {
                variations: true,
                category: true,
                subcategory: true,
            },
        });

        // Convert product prices based on country
        const updatedProducts = convertProducts(products, countryCode, countryPricingList);

        return new Response(JSON.stringify(updatedProducts), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch products", error: error.message }),
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

        // check if product exists
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        // Start a transaction to update both product and variations together
        const [deletedProduct] = await prisma.$transaction([
            prisma.product.update({
                where: { id },
                data: { deleted: 1 }, // soft delete product
            }),
            prisma.productVariation.updateMany({
                where: { productId: id },
                data: { deleted: 1 }, // soft delete variations
            }),
        ]);

        return new Response(
            JSON.stringify({ message: "Product and its variations deleted successfully", data: deletedProduct }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete product", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            name,
            subcategoryId,
            image,
            description,
            active,
            deleted,
            sku,
            slug,
            metaTitle,
            metaDescription,
            keywords,
            variations = [], // frontend se array aayega
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Product ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.product.findUnique({
            where: { id },
            include: { variations: true }, // product ke variations bhi lao
        });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Product not found" }),
                { status: 404 }
            );
        }

        // 🔹 Update product
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
                metaDescription:
                    metaDescription ?? (description ?? existing.description ?? ""),
                keywords: keywords ?? existing.keywords,
            },
        });

        // 🔹 Sirf existing variations update karo
        for (const v of variations) {
            if (v.id) {
                await prisma.productVariation.update({
                    where: { id: v.id },
                    data: {
                        variationName: v.variationName,
                        price: v.price,
                        stock: v.stock,
                        sku: v.sku,
                        image: v.image,
                        description: v.description,
                    },
                });
            }
        }

        return new Response(
            JSON.stringify({
                message: "Product and variations updated successfully",
                data: updatedProduct,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update product",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

