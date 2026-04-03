import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const VALID_USER = "hecate_wizard_mall";
const VALID_PASS = "Pratiekajain9@";

const SECRET = "MY_SUPER_SECRET"; // env me daalna better

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
        if (!checkAuth(req)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const orderCode = searchParams.get("orderCode");

        if (!orderCode) {
            return NextResponse.json(
                { success: false, message: "orderCode required" },
                { status: 400 }
            );
        }

        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderCode },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // ✅ TOKEN GENERATE (5 min expiry)
        const token = jwt.sign(
            { orderId: order.orderNumber },
            SECRET,
            { expiresIn: "5m" }
        );

        const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/invoice/${order.orderNumber}?token=${token}`;

        return NextResponse.json({
            invoiceCode: `INV-${order.orderNumber}`,
            invoiceUrl,
            invoiceDate: new Date(order.createdAt).toISOString(),
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}