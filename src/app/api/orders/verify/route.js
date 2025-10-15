// app/api/orders/verify/route.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { orderConfirmationTemplate } from "@/lib/templates/orderConfirmationTemplate";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Webhook body:", JSON.stringify(body, null, 2));

        const orderNumber = body.order_id || body.data?.order?.order_id;
        const paymentStatus = body.payment?.payment_status || body.data?.payment?.payment_status;
        const paymentMethod = body.payment?.payment_method || body.data?.payment?.payment_method;
        const customerEmail = body.customer_email || body.data?.customer_details?.customer_email;

        if (!orderNumber) {
            console.error("Missing orderNumber");
            return new Response(JSON.stringify({ message: "Missing orderNumber" }), { status: 400 });
        }

        // 1️⃣ Fetch order with user
        const order = await prisma.orders.findFirst({
            where: { orderNumber },
            include: { user: true },
        });

        if (!order) {
            console.error("Order not found:", orderNumber);
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // 2️⃣ Determine payment success
        const isPaid = ["PAID", "SUCCESS"].includes((paymentStatus || "").toUpperCase());

        // 3️⃣ Update DB with payment info
        const updatedOrder = await prisma.orders.update({
            where: { id: order.id },
            data: {
                paymentStatus: isPaid ? "PAID" : "FAILED",
                status: isPaid ? "PROCESSING" : "CANCELLED",
                paymentMethod: JSON.stringify(paymentMethod),
            },
            include: { user: true }, // ✅ include user for email
        });
        console.log("updatedOrder with user:", updatedOrder);

        // 4️⃣ Idempotency check - Only process if not already PAID
        if (isPaid && order.paymentStatus !== "PAID") {

            // 5️⃣ Create Envia shipment (try/catch to prevent crash)
            // try {
            //     const enviaResponse = await fetch("https://shipping-test.envia.com/api/v1/shipments", {
            //         method: "POST",
            //         headers: {
            //             Authorization: `Bearer ${process.env.ENVIA_API_KEY}`,
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({
            //             order_id: updatedOrder.orderNumber,
            //             customer_name: updatedOrder.shippingName,
            //             customer_phone: updatedOrder.shippingPhone,
            //             shipping_address: updatedOrder.shippingAddress,
            //             shipping_city: updatedOrder.shippingCity,
            //             shipping_state: updatedOrder.shippingState,
            //             shipping_pincode: updatedOrder.shippingPincode,
            //             items: updatedOrder.items,
            //         }),
            //     });
            //     console.log("enviaResponse", enviaResponse)
            //     if (!enviaResponse.ok) {
            //         const text = await enviaResponse.text();
            //         throw new Error(`Envia API error: ${enviaResponse.status} ${text}`);
            //     }
            //     const trackingData = await enviaResponse.json();
            //     console.log("Envia shipment created:", trackingData);

            //     if (trackingData.tracking_number) {
            //         await prisma.orders.update({
            //             where: { id: updatedOrder.id },
            //             data: { trackingNumber: trackingData.tracking_number },
            //         });
            //     }
            // } catch (err) {
            //     console.error("Envia shipment creation failed:", err.message || err);
            // }
            try {
                const response = await fetch("https://api-test.envia.com/ship/generate/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer c3a7feff396d65c57bc9dc0500888fd6aa6eb24e0a8dc3d4ee3c5979421a0938`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        origin: {
                            name: "Healing Herbs Oils Shop",
                            company: "Healing Herbs Oils",
                            email: "healingherbsoilsshop@gmail.com",
                            phone: "8116300800",
                            street: "Av Vasconcelos",
                            number: "1400",
                            district: "Mirasierra",
                            city: "Monterrey",
                            state: "NL",
                            country: "MX",
                            postalCode: "66236",
                            reference: ""
                        },
                        destination: {
                            name: updatedOrder.shippingName,
                            company: "",
                            email: updatedOrder.shippingEmail,
                            phone: updatedOrder.shippingPhone,
                            street: updatedOrder.shippingAddress,
                            number: updatedOrder.shippingNumber || "",
                            district: updatedOrder.shippingDistrict || "",
                            city: updatedOrder.shippingCity,
                            state: updatedOrder.shippingState,
                            country: "MX",
                            postalCode: updatedOrder.shippingPincode,
                            reference: ""
                        },
                        packages: updatedOrder.items.map(item => ({
                            content: item.name,
                            amount: item.quantity,
                            type: "box",
                            dimensions: { length: 10, width: 10, height: 10 }, // replace with real dimensions if available
                            weight: item.weight || 1,
                            weightUnit: "KG",
                            lengthUnit: "CM",
                            declaredValue: item.price || 0
                        })),
                        shipment: { carrier: "ups", service: "saver", type: 1 },
                        settings: { printFormat: "PDF", printSize: "STOCK_4X6" }
                    })
                });
                console.log("response" , response)
                // if (!response.ok) {
                //     const text = await response.text();
                //     throw new Error(`Envia API error: ${response.status} ${text}`);
                // }

                const shipmentData = await response.json();
                console.log("Shipment created:", shipmentData);

                // Save tracking number in DB
                if (shipmentData.tracking_number) {
                    await prisma.orders.update({
                        where: { id: updatedOrder.id },
                        data: { trackingNumber: shipmentData.tracking_number }
                    });
                }
            } catch (err) {
                console.error("Envia shipment creation failed:", err.message);
            }


            // 6️⃣ Send Customer Email
            try {
                if (updatedOrder.user?.email) {
                    await sendMail({
                        to: updatedOrder.user.email,
                        subject: `Order Confirmed - ${updatedOrder.orderNumber}`,
                        html: orderConfirmationTemplate({
                            name: updatedOrder.user.name || updatedOrder.shippingName,
                            orderId: updatedOrder.orderNumber,
                            total: updatedOrder.totalAmount,
                        }),
                    });
                    console.log("Customer email sent ✅");
                } else {
                    console.warn("User email not found for order:", updatedOrder.id);
                }
            } catch (err) {
                console.error("Customer email failed:", err.message || err);
            }

            // 7️⃣ Send Admin Email
            try {
                await sendMail({
                    to: process.env.ADMIN_EMAIL || "admin@yourshop.com",
                    subject: `New Order Placed - ${updatedOrder.orderNumber}`,
                    html: `<p>New order by ${updatedOrder.user?.name || updatedOrder.shippingName} (${updatedOrder.shippingPhone})</p>
                           <p>Order ID: ${updatedOrder.orderNumber}</p>
                           <p>Total: ₹${updatedOrder.totalAmount}</p>`,
                });
                console.log("Admin email sent ✅");
            } catch (err) {
                console.error("Admin email failed:", err.message || err);
            }
        } else {
            console.log("Order already processed, skipping email & shipment");
        }

        return new Response(JSON.stringify({ message: "Payment verified", updatedOrder }), { status: 200 });
    } catch (error) {
        console.error("Verification failed:", error.message || error);
        return new Response(
            JSON.stringify({ message: "Verification failed", error: error.message || error }),
            { status: 500 }
        );
    }
}
