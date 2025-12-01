// import { PrismaClient } from "@prisma/client";
// import axios from "axios";

// const prisma = new PrismaClient();
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         // 1️⃣ Create order in DB without orderNumber first
//         let orderRecord = await prisma.orders.create({
//             data: {
//                 userId: body.user?.id || null,
//                 shippingName: body.shippingAddress?.name,
//                 shippingPhone: body.shippingAddress?.mobile,
//                 shippingAddress: body.shippingAddress?.address,
//                 shippingCity: body.shippingAddress?.city,
//                 shippingState: body.shippingAddress?.state,
//                 shippingPincode: body.shippingAddress?.pincode,
//                 billingName: body.billingAddress?.name,
//                 billingPhone: body.billingAddress?.phone,
//                 billingAddress: body.billingAddress?.address,
//                 billingCity: body.billingAddress?.city,
//                 billingState: body.billingAddress?.state,
//                 billingPincode: body.billingAddress?.pincode,
//                 items: body.items,
//                 subtotal: parseFloat(body.subtotal.replace(/[^0-9.]/g, "")) || 0,
//                 shippingCharges: parseFloat(body.shipping.replace(/[^0-9.]/g, "")) || 0,
//                 discountAmount: body.discount || 0,
//                 taxAmount: body.tax || 0,
//                 totalAmount: parseFloat(body.total.replace(/[^0-9.]/g, "")) || 0,
//                 paymentMethod: body.paymentMethod, // dynamic
//                 status: "PENDING",
//                 paymentStatus: "PENDING",
//             },
//         });

//         // 2️⃣ Generate orderNumber
//         const orderNumber = `ORDER_${orderRecord.id}_${Date.now()}`;

//         // 3️⃣ Update order with orderNumber
//         orderRecord = await prisma.orders.update({
//             where: { id: orderRecord.id },
//             data: { orderNumber },
//         });

//         // 4️⃣ Update cat items to mark them as bought
//         // await prisma.cart.updateMany({
//         //     where: {
//         //         id: { in: body.items.map(item => item.id) },
//         //         is_buy: false,
//         //     },
//         //     data: { is_buy: true },
//         // });

//         // 5️⃣ Prepare customer details for Cashfree
//         const customerEmail = body.user?.email || "example@gmail.com";
//         const customerPhoneRaw = body.user?.phone || "+919999999999";
//         const customerPhone = customerPhoneRaw.startsWith("+")
//             ? customerPhoneRaw.replace(/\s+/g, "")
//             : customerPhoneRaw;
//         const customerId = `user_${body.user?.id || "1"}`;

//         // 6️⃣ Create Cashfree payment session
//         const response = await axios.post(
//             "https://sandbox.cashfree.com/pg/orders",
//             {
//                 order_amount: orderRecord.totalAmount,
//                 order_currency: "INR",
//                 order_id: orderNumber,
//                 customer_details: {
//                     customer_id: customerId,
//                     customer_email: customerEmail,
//                     customer_phone: customerPhone,
//                 },
//                 order_meta: {
//                     //return_url: `${baseUrl}/payment-success?order_id=${orderNumber}`,
//                     // notify_url: `${baseUrl}/api/orders/verify`,
//                     notify_url: `${baseUrl}/api/orders/verify`,
//                 },
//             },
//             {
//                 headers: {
//                     "x-client-id": process.env.CASHFREE_APP_ID || "no",
//                     "x-client-secret": process.env.CASHFREE_SECRET_KEY || "no",
//                     "x-api-version": process.env.CASHFREE_VERSION || "no",
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//         console.log("response" , response)
//         if (!response.data.payment_session_id) {
//             return new Response(
//                 JSON.stringify({ message: "No session ID in Cashfree response", data: response.data }),
//                 { status: 500 }
//             );
//         }

//         // 7️⃣ Return DB ID + Cashfree sessionId to frontend
//         return new Response(
//             JSON.stringify({
//                 orderDbId: orderRecord.id,
//                 orderNumber: orderRecord.orderNumber,
//                 sessionId: response.data.payment_session_id,
//             }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error creating order:", error.response?.data || error.message);
//         return new Response(
//             JSON.stringify({ message: "Failed to create order", error: error.response?.data || error.message }),
//             { status: 500 }
//         );
//     }
// }


import { PrismaClient } from "@prisma/client";
import axios from "axios";
import crypto from "crypto";

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req) {
    try {
        const body = await req.json();

        // 1️⃣ Save Order in Database
        let orderRecord = await prisma.orders.create({
            data: {
                userId: body.user?.id || null,

                shippingName: body.shippingAddress?.name,
                shippingPhone: body.shippingAddress?.mobile,
                shippingAddress: body.shippingAddress?.address,
                shippingCity: body.shippingAddress?.city,
                shippingState: body.shippingAddress?.state,
                shippingPincode: body.shippingAddress?.pincode,

                billingName: body.billingAddress?.name,
                billingPhone: body.billingAddress?.phone,
                billingAddress: body.billingAddress?.address,
                billingCity: body.billingAddress?.city,
                billingState: body.billingAddress?.state,
                billingPincode: body.billingAddress?.pincode,

                items: body.items,

                subtotal: parseFloat(body.subtotal.replace(/[^0-9.]/g, "")) || 0,
                shippingCharges: parseFloat(body.shipping.replace(/[^0-9.]/g, "")) || 0,
                discountAmount: body.discount || 0,
                taxAmount: body.tax || 0,
                totalAmount: parseFloat(body.total.replace(/[^0-9.]/g, "")) || 0,

                paymentMethod: body.paymentMethod,
                status: "PENDING",
                paymentStatus: "PENDING",
                orderBy: body.isXpress ? "hecate-quickGo" : "website",
            },
        });

        // Create Order Number
        const orderNumber = `ORDER_${orderRecord.id}_${Date.now()}`;

        orderRecord = await prisma.orders.update({
            where: { id: orderRecord.id },
            data: { orderNumber },
        });

        // ***********************
        // ⭐ PAYU PAYMENT METHOD
        // ***********************
        if (body.paymentMethod === "PayU") {
            const key = process.env.PAYU_KEY;
            const salt = process.env.PAYU_SALT;

            const amount = orderRecord.totalAmount;
            const firstname = body.user.name;
            const email = body.user.email;
            const phone = body.user.phone;

            const productInfo = "Shopping Order";

            const hashString = `${key}|${orderNumber}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${salt}`;
            const hash = crypto.createHash("sha512").update(hashString).digest("hex");

            const payuURL =
                process.env.PAYU_MODE === "production"
                    ? "https://secure.payu.in/_payment"
                    : "https://test.payu.in/_payment";

            return new Response(
                JSON.stringify({
                    gateway: "payu",
                    payuURL,
                    params: {
                        key,
                        txnid: orderNumber,
                        amount,
                        productinfo: productInfo,
                        firstname,
                        email,
                        phone,
                        // surl: `${baseUrl}/api/payu/success`,
                        // furl: `${baseUrl}/api/payu/success`,
                        surl: `${baseUrl}/api/payu/success`,
                        furl: `${baseUrl}/api/payu/failure`,
                        hash,
                    },
                }),
                { status: 200 }
            );
        }

        // **************************
        // ⭐ CASHFREE PAYMENT METHOD
        // **************************
        const customerPhone = body.user?.phone.replace(/\D/g, "").slice(-10);
        if (body.paymentMethod === "CashFree") {
            const customerEmail = body.user?.email || "example@gmail.com";
            // const customerPhoneRaw = body.user?.phone || "+919999999999";
            // const customerPhone = customerPhoneRaw.replace(/\s+/g, "");

            const response = await axios.post(
                "https://api.cashfree.com/pg/orders",
                {
                    order_amount: Number(orderRecord.totalAmount),
                    order_currency: "INR",
                    order_id: orderNumber,
                    customer_details: {
                        customer_id: `user_${body.user?.id}`,
                        customer_email: customerEmail,
                        customer_phone: customerPhone,
                    },
                    order_meta: {
                        notify_url: `${baseUrl}/api/cashfree/verify`,
                        return_url: `${baseUrl}/payment-success?order_id=${orderNumber}`,
                    },

                },
                {
                    headers: {
                        "x-client-id": process.env.CASHFREE_APP_ID,
                        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                        "x-api-version": process.env.CASHFREE_VERSION,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.payment_session_id) {
                return new Response(
                    JSON.stringify({ message: "Cashfree session missing" }),
                    { status: 500 }
                );
            }

            return new Response(
                JSON.stringify({
                    gateway: "cashfree",
                    sessionId: response.data.payment_session_id,
                    orderNumber: orderRecord.orderNumber,
                }),
                { status: 200 }
            );
        }


        return new Response(JSON.stringify({ message: "Payment method missing" }), {
            status: 400,
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Server Error", error: error.message }),
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        const Orders = await prisma.orders.findMany({
            where: {
                active: true,
                deleted: 0
            },
            orderBy: {
                id: "desc"
            }
        });

        return new Response(
            JSON.stringify({
                message: "Orders list fetched successfully",
                data: Orders
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch Orders List",
                error: error.message
            }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const orderId = body.id;

        if (!orderId) {
            return new Response(JSON.stringify({ message: "Order ID is required" }), {
                status: 400,
            });
        }

        // Check if order exists
        const existingOrder = await prisma.orders.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return new Response(JSON.stringify({ message: "Order not found" }), {
                status: 404,
            });
        }

        // Update order
        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: {
                userId: body.user?.id || existingOrder.userId,

                shippingName: body.shippingAddress?.name || existingOrder.shippingName,
                shippingPhone: body.shippingAddress?.mobile || existingOrder.shippingPhone,
                shippingAddress: body.shippingAddress?.address || existingOrder.shippingAddress,
                shippingCity: body.shippingAddress?.city || existingOrder.shippingCity,
                shippingState: body.shippingAddress?.state || existingOrder.shippingState,
                shippingPincode: body.shippingAddress?.pincode || existingOrder.shippingPincode,

                billingName: body.billingAddress?.name || existingOrder.billingName,
                billingPhone: body.billingAddress?.phone || existingOrder.billingPhone,
                billingAddress: body.billingAddress?.address || existingOrder.billingAddress,
                billingCity: body.billingAddress?.city || existingOrder.billingCity,
                billingState: body.billingAddress?.state || existingOrder.billingState,
                billingPincode: body.billingAddress?.pincode || existingOrder.billingPincode,

                items: body.items || existingOrder.items,

                subtotal: body.subtotal !== undefined ? parseFloat(body.subtotal.replace(/[^0-9.]/g, "")) : existingOrder.subtotal,
                shippingCharges: body.shipping !== undefined ? parseFloat(body.shipping.replace(/[^0-9.]/g, "")) : existingOrder.shippingCharges,
                discountAmount: body.discount !== undefined ? body.discount : existingOrder.discountAmount,
                taxAmount: body.tax !== undefined ? body.tax : existingOrder.taxAmount,
                totalAmount: body.total !== undefined ? parseFloat(body.total.replace(/[^0-9.]/g, "")) : existingOrder.totalAmount,

                paymentMethod: body.paymentMethod || existingOrder.paymentMethod,
                status: body.status || existingOrder.status,
                paymentStatus: body.paymentStatus || existingOrder.paymentStatus,
                orderBy: body.orderBy || existingOrder.orderBy,
                active: body.active !== undefined ? body.active : existingOrder.active,
                deleted: body.deleted !== undefined ? body.deleted : existingOrder.deleted,
            },
        });

        return new Response(
            JSON.stringify({ message: "Order updated successfully", data: updatedOrder }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Server Error", error: error.message }),
            { status: 500 }
        );
    }
}