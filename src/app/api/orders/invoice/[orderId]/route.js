// app/api/orders/invoice/[orderId]/route.js
import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const { orderId } = params;
        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderId },
            include: { user: true, items: true }, // assuming items relation exists
        });

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const currency = order.paymentCurrency || "INR";

        let y = height - 50;

        // Header
        page.drawText("Healing Herbs Oils Shop", { x: 50, y, size: 18, font: boldFont, color: rgb(0, 0.2, 0.6) });
        page.drawText("INVOICE", { x: 450, y, size: 20, font: boldFont, color: rgb(0, 0, 0) });
        y -= 30;
        page.drawText(`Invoice #: ${order.orderNumber}`, { x: 50, y, size: 12, font });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 450, y, size: 12, font });
        y -= 40;

        // Customer Info Box
        page.drawText("Bill To:", { x: 50, y, size: 14, font: boldFont });
        y -= 20;
        page.drawText(`Name: ${order.user?.name || order.shippingName || "N/A"}`, { x: 50, y, size: 12, font });
        page.drawText(`Email: ${order.user?.email || "N/A"}`, { x: 50, y: y - 20, size: 12, font });
        page.drawText(`Payment Status: ${order.paymentStatus}`, { x: 50, y: y - 40, size: 12, font });
        y -= 70;

        // Table Header
        page.drawText("Item", { x: 50, y, size: 12, font: boldFont });
        page.drawText("Qty", { x: 300, y, size: 12, font: boldFont });
        page.drawText("Price", { x: 350, y, size: 12, font: boldFont });
        page.drawText("Total", { x: 450, y, size: 12, font: boldFont });
        y -= 20;

        // Items
        for (let item of order.items) {
            page.drawText(item.name, { x: 50, y, size: 12, font });
            page.drawText(`${item.quantity}`, { x: 300, y, size: 12, font });
            page.drawText(`${currency} ${item.price}`, { x: 350, y, size: 12, font });
            page.drawText(`${currency} ${item.price * item.quantity}`, { x: 450, y, size: 12, font });
            y -= 20;
        }

        y -= 20;
        page.drawText(`Total Amount: ${currency} ${order.totalAmount}`, { x: 400, y, size: 14, font: boldFont });

        // Footer
        page.drawText("Thank you for shopping with us!", { x: 50, y: 50, size: 12, font });
        page.drawText(`© ${new Date().getFullYear()} Healing Herbs Oils Shop`, { x: 50, y: 35, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Invoice_${order.orderNumber}.pdf"`,
            },
        });
    } catch (err) {
        console.error("Invoice generation failed:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: err.message }), { status: 500 });
    }
}
