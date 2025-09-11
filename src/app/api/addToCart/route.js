import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Get all cart items
export async function GET(req) {
    try {
        const cart = await prisma.cart.findMany({
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Cart fetched successfully", data: cart }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch cart", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Add item to cart
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            productId,
            variationId,
            productName,
            quantity,
            pricePerItem,
            currencySymbol,
            totalPrice,
            attributes,
            userId,
            image
        } = body;

        if (!productId || !productName) {
            return new Response(
                JSON.stringify({ message: "Product ID and Name are required" }),
                { status: 400 }
            );
        }

        const cartItem = await prisma.cart.create({
            data: {
                productId,
                variationId,
                productName,
                quantity,
                pricePerItem,
                currencySymbol,
                totalPrice,
                attributes: attributes || {},
                userId: userId || null,
                image
            },
        });

        return new Response(
            JSON.stringify({ message: "Item added to cart successfully", data: cartItem }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to add item to cart", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Update cart item (e.g., quantity)
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, quantity } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Cart ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.cart.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Cart item not found" }),
                { status: 404 }
            );
        }

        const updatedItem = await prisma.cart.update({
            where: { id },
            data: {
                quantity: quantity ?? existing.quantity,
                totalPrice: (quantity ?? existing.quantity) * existing.pricePerItem,
            },
        });

        return new Response(
            JSON.stringify({ message: "Cart updated successfully", data: updatedItem }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update cart", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Delete cart item
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Cart ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.cart.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Cart item not found" }),
                { status: 404 }
            );
        }

        await prisma.cart.delete({ where: { id } });

        return new Response(
            JSON.stringify({ message: "Cart item deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete cart item", error: error.message }),
            { status: 500 }
        );
    }
}
