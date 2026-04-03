import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";
import { orderConfirmationTemplateAdmin } from "@/lib/templates/orderConfirmationTemplateAdmin";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = "MY_SUPER_SECRET";


const generateInvoiceNumber = async () => {
    const lastInvoice = await prisma.orders.findFirst({
        where: { invoiceNumber: { not: null } },
        orderBy: { invoiceDate: "desc" },
    });

    let nextNumber = 1;

    if (lastInvoice?.invoiceNumber) {
        const last = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
        nextNumber = last + 1;
    }

    return `INV-${String(nextNumber).padStart(5, "0")}`;
};
console.log("generateInvoiceNumber", generateInvoiceNumber)


const createIncreffPayload = async (orderRecord, warehouseCode) => {

    const locationCode = warehouseCode; // ✅ dynamic from gateway

    if (!locationCode) {
        console.log("❌ No warehouseCode received");
        return null;
    }

    const items = orderRecord.items;
    const orderItems = [];

    for (let item of items) {

        console.log("🔍 Processing item:", item.variationId);

        // ✅ Step 1: Get variation
        const variation = await prisma.productVariation.findUnique({
            where: {
                id: item.variationId
            }
        });

        if (!variation) {
            console.log("❌ Variation not found:", item.variationId);
            continue;
        }

        console.log("✅ Variation SKU:", variation.sku);

        // ✅ Step 2: Map SKU with increff
        const mapping = await prisma.bangaloreIncreffMappingSKU.findFirst({
            where: {
                ourSku: variation.sku
            }
        });

        if (!mapping) {
            console.log("❌ Mapping not found for SKU:", variation.sku);
            continue;
        }

        const channelSkuCode = mapping.channelSku;

        console.log("✅ Channel SKU:", channelSkuCode);

        // ✅ Step 3: Check inventory
        const inventory = await prisma.bangaloreIncreffInventory.findUnique({
            where: {
                locationCode_channelSkuCode: {
                    locationCode,
                    channelSkuCode
                }
            }
        });

        if (!inventory) {
            console.log("❌ Inventory not found:", channelSkuCode, locationCode);
            continue;
        }

        console.log("✅ Inventory found");

        // ✅ Step 4: Push item
        orderItems.push({
            channelSkuCode,
            quantity: item.quantity,
            sellingPricePerUnit: item.pricePerItem,
            orderItemCode: `${orderRecord.orderNumber}_${channelSkuCode}`
        });
    }

    return {
        orderTime: new Date().toISOString(),
        orderType: "PO",
        orderCode: orderRecord.orderNumber,
        locationCode,
        partnerCode: "Delhi_23",
        partnerLocationCode: "Delhi_23",
        orderItems
    };
};


export async function POST(req) {
    try {
        const form = await req.formData();
        const orderId = form.get("txnid");
        const status = form.get("status");
        const orderBy = form.get("udf2");
        console.log("orderBy", orderBy)
        if (!orderId) return new Response("Order ID missing", { status: 400 });

        const orderRecord = await prisma.orders.findUnique({ where: { orderNumber: orderId } });
        console.log("orderRecord", orderRecord)
        if (!orderRecord) return new Response("Order not found", { status: 404 });

        let userEmail = "kumarnitish4383@gmail.com";

        if (orderRecord.userId) {
            const user = await prisma.user.findUnique({
                where: { id: orderRecord.userId },
                select: { email: true, name: true },
            });
            if (user?.email) userEmail = user.email;
        }

        const handlePromoAndDonation = async () => {
            // ===== PROMO =====
            if (orderRecord.promoCode && orderRecord.userId) {
                const promo = await prisma.promoCode.findUnique({
                    where: { code: orderRecord.promoCode },
                });

                if (promo) {
                    // ❌ same order pe already applied?
                    const alreadyUsed = await prisma.promoUser.findFirst({
                        where: {
                            promoId: promo.id,
                            orderId: orderRecord.id,
                        },
                    });

                    if (!alreadyUsed) {
                        const subtotal = orderRecord.subtotal;
                        let discountAmount = 0;

                        if (promo.discountType === "FLAT") {
                            discountAmount = promo.discountValue;
                        } else if (promo.discountType === "PERCENTAGE") {
                            discountAmount = (subtotal * promo.discountValue) / 100;
                        }
                        // ✅ save order-wise promo usage
                        await prisma.promoUser.create({
                            data: {
                                promoId: promo.id,
                                userId: orderRecord.userId,
                                orderId: orderRecord.id,
                                usedCount: 1,
                                subtotal: subtotal,           // store subtotal
                                discountAmount: discountAmount, // store actual discount
                            },
                        });

                        // ✅ increment global promo count
                        await prisma.promoCode.update({
                            where: { id: promo.id },
                            data: { usedCount: { increment: 1 } },
                        });
                    }
                }
            }


            // ===== DONATION =====
            if (orderRecord.donationAmount && orderRecord.donationCampaignId) {
                await prisma.userDonation.create({
                    data: {
                        userName: orderRecord.shippingName,
                        userId: orderRecord.userId,
                        orderId: orderRecord.id,
                        donationCampaignId: orderRecord.donationCampaignId,
                        amount: orderRecord.donationAmount,
                    },
                });
            }

        };

        if (orderBy === "website") {
            if (status === "success") {
                // ✅ Update order as confirmed
                const invoiceNumber = await generateInvoiceNumber();
                // await prisma.orders.update({
                //     where: { id: orderRecord.id },
                //     data: { status: "PENDING", paymentStatus: "PAID" },
                // });
                await prisma.orders.update({
                    where: { id: orderRecord.id },
                    data: {
                        status: "PENDING",
                        paymentStatus: "PAID",
                        invoiceNumber,
                        invoiceDate: new Date()
                    },
                });



                if (orderRecord.userId) {
                    // ❌ Do NOT delete cart. Instead, mark is_buy = true
                    await prisma.cart.updateMany({
                        where: { userId: orderRecord.userId },
                        data: { is_buy: true },
                    });
                }

                await handlePromoAndDonation();

                const token = jwt.sign(
                    { orderId: orderRecord.orderNumber },
                    SECRET,
                    { expiresIn: "5m" }
                );

                // Send confirmation email to user
                await sendMail({
                    to: userEmail,
                    subject: `Order Confirmation - ${orderRecord.orderNumber}`,
                    html: orderConfirmationTemplate({
                        shippingName: orderRecord.shippingName,
                        orderId: orderRecord.orderNumber,
                        total: orderRecord.totalAmount,
                        currency: orderRecord.paymentCurrency || "₹",
                        downloadLink: `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/invoice/${orderRecord.orderNumber}?token=${token}`
                    }),
                });

                //Send notification email to admin
                await sendMail({
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Order Received - ${orderRecord.orderNumber}`,
                    html: orderConfirmationTemplateAdmin({
                        orderId: orderRecord.orderNumber,
                        total: orderRecord.totalAmount,
                        currency: orderRecord.paymentCurrency || "₹",
                    }),
                });

                const baseUrl = new URL(req.url).origin;
                return Response.redirect(`${baseUrl}/payment-success?order_id=${orderId}`);
            } else {
                if (status === "failure" || status === "userCancelled") {
                    await prisma.orders.update({
                        where: { id: orderRecord.id },
                        data: { status: "Failed", paymentStatus: "Failed" },
                    });
                }

                const baseUrl = new URL(req.url).origin;
                return Response.redirect(`${baseUrl}/payment-failed?order_id=${orderId}`);
            }
        } else {
            if (status === "success") {
                const invoiceNumber = await generateInvoiceNumber();
                // await prisma.orders.update({
                //     where: { id: orderRecord.id },
                //     data: { status: "PENDING", paymentStatus: "PAID" },
                // });
                await prisma.orders.update({
                    where: { id: orderRecord.id },
                    data: {
                        status: "PENDING",
                        paymentStatus: "PAID",
                        invoiceNumber,
                        invoiceDate: new Date()
                    },
                });


                if (orderRecord.userId) {
                    await prisma.cart.updateMany({
                        where: { userId: orderRecord.userId },
                        data: { is_buy: true },
                    });
                }

                await handlePromoAndDonation();

                const token = jwt.sign(
                    { orderId: orderRecord.orderNumber },
                    SECRET,
                    { expiresIn: "5m" }
                );


                // Send confirmation email to user
                await sendMail({
                    to: userEmail,
                    subject: `Order Confirmation - ${orderId}`,
                    html: orderConfirmationTemplate({
                        shippingName: orderRecord.shippingName,
                        orderId: orderRecord.orderNumber,
                        total: orderRecord.totalAmount,
                        currency: orderRecord.currency || "₹",
                        downloadLink: `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/invoice/${orderRecord.orderNumber}?token=${token}`
                    }),
                });

                // Send notification email to admin
                await sendMail({
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Order Received - ${orderId}`,
                    html: orderConfirmationTemplateAdmin({
                        orderId: orderRecord.orderNumber,
                        total: orderRecord.totalAmount,
                        currency: orderRecord.currency || "₹",
                    }),
                });

                if (orderRecord.orderBy === "hecate-quickGo" &&
                    orderRecord.shippingState?.toLowerCase() === "karnataka") {

                    const warehouseCode = form.get("udf1");
                    if (!warehouseCode) {
                        console.log("❌ warehouseCode missing from payment gateway");
                        return;
                    }

                    try {
                        const payload = await createIncreffPayload(orderRecord, warehouseCode);

                        if (payload.orderItems.length > 0) {

                            const response = await fetch(
                                "https://staging-common.omni.increff.com/assure-magic2/orders/inward",
                                {
                                    method: "POST",
                                    headers: {
                                        "authusername": "HECATE_ERP-1200063404",
                                        "authpassword": "9381c0d5-6884-4e40-8ded-588faf983eca",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(payload)
                                }
                            );

                            const data = await response;
                            console.log("data", data)

                            console.log("✅ Increff Response:", data);

                        } else {
                            console.log("❌ No valid items for Increff");
                        }

                    } catch (err) {
                        console.error("❌ Increff Error:", err);
                    }
                }

                const baseUrl = new URL(req.url).origin;
                return Response.redirect(`${baseUrl}/hecate-quickGo/payment-success?order_id=${orderId}`);
            } else {
                // ❌ If status is anything else, delete the order
                // await prisma.orders.delete({ where: { id: orderRecord.id } });
                if (status === "failure" || status === "userCancelled") {
                    // Update order as failed
                    await prisma.orders.update({
                        where: { id: orderRecord.id },
                        data: { status: "Failed", paymentStatus: "Failed" },
                    });
                }


                const baseUrl = new URL(req.url).origin;
                return Response.redirect(`${baseUrl}/hecate-quickGo/payment-failed?order_id=${orderId}`);
            }
        }

    } catch (err) {
        console.error("PayU Success Handler Error:", err);
        return new Response("Server Error", { status: 500 });
    }
}
