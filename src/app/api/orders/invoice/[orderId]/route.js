// app/api/orders/invoice/[orderId]/route.js
import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { orderId } = params;

    const order = await prisma.orders.findFirst({
        where: { orderNumber: orderId },
        include: { user: true },
    });

    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Generate PDF invoice dynamically
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("INVOICE", { x: 250, y: height - 50, size: 20, font, color: rgb(0, 0, 0.8) });
    page.drawText(`Order ID: ${order.orderNumber}`, { x: 50, y: height - 100, size: 12, font });
    page.drawText(`Customer: ${order.user.name}`, { x: 50, y: height - 120, size: 12, font });
    page.drawText(`Email: ${order.user.email}`, { x: 50, y: height - 140, size: 12, font });
    page.drawText(`Total Amount: ₹${order.totalAmount}`, { x: 50, y: height - 160, size: 12, font });
    page.drawText(`Status: ${order.paymentStatus}`, { x: 50, y: height - 180, size: 12, font });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Invoice_${order.orderNumber}.pdf"`,
        },
    });
}
