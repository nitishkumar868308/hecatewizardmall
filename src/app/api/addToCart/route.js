import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Get all cart items
export async function GET(req) {
    try {
        const cart = await prisma.cart.findMany({
            where: { is_buy: false },
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
            bulkPrice,
            bulkMinQty,
            offerApplied,
            productOfferApplied,
            productOfferDiscount,
            productOffer,
            productOfferId,
            currency,
            currencySymbol,
            totalPrice,
            attributes,
            userId,
            image,
            selectedCountry,
            barCode
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
                bulkPrice: bulkPrice || null,       // ✅ default null
                bulkMinQty: bulkMinQty || null,     // ✅ default null
                offerApplied: offerApplied ?? false, // ✅ default false
                productOfferApplied: productOfferApplied ?? false,
                productOfferDiscount: productOfferDiscount || null,
                productOffer: productOffer ? JSON.parse(JSON.stringify(productOffer)) : null,
                productOfferId: productOfferId || null,
                currency,
                currencySymbol,
                totalPrice,
                attributes: attributes || {},
                userId: userId || null,
                image,
                selectedCountry: selectedCountry || null,
                is_buy: false,
                barCode: barCode || null
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
// export async function PUT(req) {
//     try {
//         const body = await req.json();
//         const { id, quantity } = body;
//         console.log("id" , id)
//         if (!id) {
//             return new Response(
//                 JSON.stringify({ message: "Cart ID is required" }),
//                 { status: 400 }
//             );
//         }

//         const existing = await prisma.cart.findUnique({ where: { id } });
//         if (!existing) {
//             return new Response(
//                 JSON.stringify({ message: "Cart item not found" }),
//                 { status: 404 }
//             );
//         }

//         const updatedItem = await prisma.cart.update({
//             where: { id },
//             data: {
//                 quantity: quantity ?? existing.quantity,
//                 totalPrice: (quantity ?? existing.quantity) * existing.pricePerItem,
//             },
//         });

//         return new Response(
//             JSON.stringify({ message: "Cart updated successfully", data: updatedItem }),
//             { status: 200 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to update cart", error: error.message }),
//             { status: 500 }
//         );
//     }
// }

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) return new Response(JSON.stringify({ message: "Cart ID is required" }), { status: 400 });

        const existing = await prisma.cart.findUnique({ where: { id } });
        if (!existing) return new Response(JSON.stringify({ message: "Cart item not found" }), { status: 404 });

        // Agar totalPrice na diya ho, calculate kar lo
        if (!updateData.totalPrice) {
            const quantity = updateData.quantity ?? existing.quantity;
            const pricePerItem = updateData.pricePerItem ?? existing.pricePerItem;
            updateData.totalPrice = quantity * pricePerItem;
        }

        const updatedItem = await prisma.cart.update({
            where: { id },
            data: { ...updateData }, // ✅ yahan pricePerItem, currencySymbol, selectedCountry, totalPrice sab update ho jaayega
        });

        return new Response(
            JSON.stringify({ message: "Cart item updated successfully", data: updatedItem }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to update cart item", error: error.message }), { status: 500 });
    }
}


// export async function DELETE(req) {
//     try {
//         const body = await req.json();
//         const { id, clearAll, userId, } = body;
//         // console.log("id", id)
//         // console.log("clearAll", clearAll)
//         // console.log("userId", userId)
//         // Case 1: Clear all items for a user
//         if (clearAll && userId) {
//             await prisma.cart.deleteMany({
//                 where: { userId: parseInt(userId) },
//             });

//             return new Response(
//                 JSON.stringify({ message: "All cart items cleared successfully" }),
//                 { status: 200 }
//             );
//         }

//         // Case 2: Delete a single item
//         if (!id) {
//             return new Response(
//                 JSON.stringify({ message: "Cart ID is required" }),
//                 { status: 400 }
//             );
//         }

//         const existing = await prisma.cart.findUnique({ where: { id } });
//         if (!existing) {
//             return new Response(
//                 JSON.stringify({ message: "Cart item not found" }),
//                 { status: 404 }
//             );
//         }

//         await prisma.cart.delete({ where: { id } });

//         if (id?.length) {
//             await prisma.cart.deleteMany({
//                 where: {
//                     id: { in: id },
//                 },
//             });
//             return new Response(
//                 JSON.stringify({ message: "Selected cart items deleted successfully" }),
//                 { status: 200 }
//             );
//         }

//         return new Response(
//             JSON.stringify({ message: "Cart item deleted successfully" }),
//             { status: 200 }
//         );




//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to delete cart item(s)", error: error.message }),
//             { status: 500 }
//         );
//     }
// }
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id, clearAll, userId } = body;

        // 🧹 Case 1: Clear all items for a user
        if (clearAll && userId) {
            await prisma.cart.deleteMany({
                where: { userId: parseInt(userId) },
            });
            return new Response(
                JSON.stringify({ message: "All cart items cleared successfully" }),
                { status: 200 }
            );
        }

        // ❌ Case 2: If no ID is provided
        if (!id) {
            return new Response(
                JSON.stringify({ message: "Cart ID(s) are required" }),
                { status: 400 }
            );
        }

        // 🧩 Case 3: Handle both single ID and multiple IDs
        if (Array.isArray(id)) {
            // multiple itemIds delete
            await prisma.cart.deleteMany({
                where: { id: { in: id } },
            });
            return new Response(
                JSON.stringify({ message: "Selected cart items deleted successfully" }),
                { status: 200 }
            );
        } else {
            // single item delete
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
        }

    } catch (error) {
        console.error("DELETE ERROR:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to delete cart item(s)",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
