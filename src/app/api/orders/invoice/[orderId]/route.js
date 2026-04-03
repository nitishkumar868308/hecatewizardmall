import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = "MY_SUPER_SECRET";

export async function GET(req, { params }) {
    try {
        const { orderId } = await params;

        // ================= TOKEN =================
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new Response(JSON.stringify({ message: "Token required" }), { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET);
        } catch {
            return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
        }

        if (decoded.orderId !== orderId) {
            return new Response(JSON.stringify({ message: "Unauthorized access" }), { status: 403 });
        }

        // ================= ORDER =================
        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderId },
            include: { user: true },
        });

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // ================= PRODUCTS + CATEGORY =================
        const productIds = order.items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                category: {
                    include: { countryTaxes: true },
                },
            },
        });

        const productMap = {};
        products.forEach(p => { productMap[p.id] = p; });

        // ================= PDF SETUP =================
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        let y = 750;

        // ================= HEADER DESIGN =================
        // Background strip for header
        page.drawRectangle({
            x: 0,
            y: 720,
            width: 600,
            height: 80,
            color: rgb(0.96, 0.96, 0.98),
        });

        // Logo
        try {
            const logoBytes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/image/logo.jpg`)
                .then(res => res.arrayBuffer());
            const logo = await pdfDoc.embedJpg(logoBytes);
            page.drawImage(logo, { x: 50, y: 735, width: 50, height: 50 });
        } catch { }

        page.drawText("Hecate Wizard Mall", { x: 110, y: 765, size: 18, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        page.drawText("TAX INVOICE", { x: 450, y: 765, size: 18, font: fontBold, color: rgb(0.2, 0.4, 0.8) });

        // Company Details
        y = 745;
        page.drawText("27 Deepali, Pitampura, New Delhi - 110034", { x: 110, y, size: 9, font });
        page.drawText(`GSTIN: 07ABCDE1234F1Z5`, { x: 110, y: y - 12, size: 9, font });

        // ================= INVOICE INFO BLOCK =================
        y = 680;
        const infoX = 400;
        page.drawText("Invoice Details", { x: infoX, y: y + 15, size: 10, font: fontBold });
        page.drawText(`Invoice No:  ${order.invoiceNumber || "-"}`, { x: infoX, y, size: 9, font });
        page.drawText(`Order No:    ${order.orderNumber}`, { x: infoX, y: y - 14, size: 9, font });
        page.drawText(`Date:           ${new Date(order.createdAt).toLocaleDateString()}`, { x: infoX, y: y - 28, size: 9, font });

        // ================= ADDRESSES =================
        y = 680;
        // Bill To
        page.drawText("BILL TO", { x: 50, y: y + 15, size: 10, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(order.billingName || "-", { x: 50, y, size: 11, font: fontBold });
        page.drawText(order.billingAddress || "-", { x: 50, y: y - 14, size: 9, font, maxWidth: 200 });
        page.drawText(`${order.billingCity}, ${order.billingState} - ${order.billingPincode}`, { x: 50, y: y - 28, size: 9, font });

        // Ship To (Parallel)
        page.drawText("SHIP TO", { x: 230, y: y + 15, size: 10, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(order.shippingName || "-", { x: 230, y, size: 11, font: fontBold });
        page.drawText(order.shippingAddress || "-", { x: 230, y: y - 14, size: 9, font, maxWidth: 150 });
        page.drawText(`${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`, { x: 230, y: y - 28, size: 9, font });

        // ================= TABLE HEADER =================
        y = 590;
        page.drawRectangle({
            x: 50,
            y: y - 5,
            width: 500,
            height: 25,
            color: rgb(0.2, 0.4, 0.8),
        });

        const headColor = rgb(1, 1, 1);
        page.drawText("Item Description", { x: 60, y, size: 10, font: fontBold, color: headColor });
        page.drawText("HSN", { x: 280, y, size: 10, font: fontBold, color: headColor });
        page.drawText("Qty", { x: 340, y, size: 10, font: fontBold, color: headColor });
        page.drawText("Price", { x: 390, y, size: 10, font: fontBold, color: headColor });
        page.drawText("Tax", { x: 450, y, size: 10, font: fontBold, color: headColor });
        page.drawText("Total", { x: 500, y, size: 10, font: fontBold, color: headColor });

        y -= 30;

        // ================= ITEMS LOOP =================
        for (const item of order.items || []) {
            const product = productMap[item.productId];
            const hsn = product?.category?.hsn || "N/A";
            const taxObj = product?.category?.countryTaxes?.find(t => t.country === "India");
            const taxPercent = taxObj?.taxPercentage || 0;

            // Row Bottom Line
            page.drawLine({
                start: { x: 50, y: y - 15 },
                end: { x: 550, y: y - 15 },
                thickness: 0.5,
                color: rgb(0.9, 0.9, 0.9),
            });

            // Product Name & Variant
            page.drawText(item.productName || "-", { x: 60, y, size: 9, font: fontBold });
            if (item.attributes) {
                const variant = Object.entries(item.attributes).map(([k, v]) => `${k}:${v}`).join(", ");
                page.drawText(variant, { x: 60, y: y - 10, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
            }

            page.drawText(hsn, { x: 280, y, size: 9, font });
            page.drawText(String(item.quantity), { x: 340, y, size: 9, font });
            page.drawText(`Rs${item.pricePerItem}`, { x: 390, y, size: 9, font });
            page.drawText(`${taxPercent}%`, { x: 450, y, size: 9, font });
            page.drawText(`Rs${item.totalPrice}`, { x: 500, y, size: 9, font: fontBold });

            y -= 35;
        }

        // ================= SUMMARY BLOCK =================
        y -= 20;
        const summaryX = 380;
        const valueX = 500;

        const drawRow = (label, value, isBold = false) => {
            page.drawText(label, { x: summaryX, y, size: 9, font: isBold ? fontBold : font });
            page.drawText(value, { x: valueX, y, size: 9, font: isBold ? fontBold : font });
            y -= 18;
        };

        drawRow("Subtotal:", `Rs${order.subtotal}`);
        drawRow("Shipping:", `Rs${order.shippingCharges || 0}`);
        if (order.discountAmount) drawRow("Discount:", `-Rs${order.discountAmount}`);
        if (order.taxAmount) drawRow("Total GST:", `Rs${order.taxAmount}`);

        y -= 5;
        page.drawRectangle({ x: summaryX - 10, y: y - 5, width: 180, height: 25, color: rgb(0.2, 0.4, 0.8) });
        page.drawText("GRAND TOTAL", { x: summaryX, y, size: 11, font: fontBold, color: rgb(1, 1, 1) });
        page.drawText(`Rs${order.totalAmount}`, { x: valueX, y, size: 11, font: fontBold, color: rgb(1, 1, 1) });

        // ================= FOOTER =================
        page.drawText("TERMS & CONDITIONS:", { x: 50, y: 100, size: 9, font: fontBold });
        page.drawText("1. Goods once sold will not be taken back.", { x: 50, y: 88, size: 8, font });
        page.drawText("2. This is a computer generated invoice and does not require a physical signature.", { x: 50, y: 78, size: 8, font });

        page.drawText("Thank you for shopping with us!", { x: 220, y: 40, size: 10, font: fontBold, color: rgb(0.2, 0.4, 0.8) });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Invoice_${order.orderNumber}.pdf"`,
            },
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Error generating invoice" }), { status: 500 });
    }
}