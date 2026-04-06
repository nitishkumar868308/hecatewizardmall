import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const VALID_USER = "hecate_wizard_mall";
const VALID_PASS = "Pratiekajain9@";

const SECRET = "MY_SUPER_SECRET";

function checkAuth(req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) return false;

    const decoded = Buffer.from(authHeader.split(" ")[1], "base64")
        .toString("utf-8");

    const [username, password] = decoded.split(":");

    return username === VALID_USER && password === VALID_PASS;
}

export async function GET(req) {
    try {
        // ✅ Auth check
        if (!checkAuth(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const orderCode = searchParams.get("orderCode");
        const shipmentCode = searchParams.get("shipmentCode");

        // ✅ Validate params
        if (!orderCode || !shipmentCode) {
            return NextResponse.json(
                {
                    success: false,
                    message: "orderCode and shipmentCode are required"
                },
                { status: 400 }
            );
        }

        // ✅ Check in PACK ORDER TABLE (IMPORTANT)
        const packOrder = await prisma.bangaloreIncreffPackOrder.findFirst({
            where: {
                orderCode,
                shipmentCode
            }
        });

        if (!packOrder) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid orderCode or shipmentCode"
                },
                { status: 404 }
            );
        }

        // ✅ Get Order Details (optional but useful)
        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderCode },
        });

        // if (!order?.invoiceNumber) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Invoice not generated for this order yet"
        //         },
        //         { status: 400 }
        //     );
        // }

        // ✅ Generate token (secure invoice access)
        const token = jwt.sign(
            { orderId: orderCode },
            SECRET,
            { expiresIn: "5m" }
        );

        const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/invoice/${orderCode}?token=${token}`;

        // ✅ FINAL RESPONSE (Increff format)
        return NextResponse.json({
            invoiceCode: order?.invoiceNumber || `INV-${orderCode}`,
            invoiceUrl,
            invoiceDate: new Date(order?.createdAt || Date.now()).toISOString(),

            // optional fields (abhi dummy / basic)
            irn: "",
            qrCode: "",
            invoice: "",

            orderCustomAttributes: {
                currency: "INR",
                channelMetadata: {}
            },

            invoiceDetails: [] // later fill kar sakte ho
        });

    } catch (err) {
        console.error("Invoice API Error:", err);

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}