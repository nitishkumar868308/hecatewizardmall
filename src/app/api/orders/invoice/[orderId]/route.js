// app/api/orders/invoice/[orderId]/route.js
import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const { orderId } = params;
        console.log("orderId", orderId)
        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderId },
            include: { user: true },
        });

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // 🟦 Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 750]);
        const { height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const currencySymbol = order.paymentCurrency || "INR";
        console.log("pdfDoc", pdfDoc)
        console.log("page", pdfDoc)

        // 🧾 Title
        page.drawText("INVOICE", { x: 250, y: height - 60, size: 22, font, color: rgb(0, 0.2, 0.6) });

        // 🧍 Customer Info        
        page.drawText(`Customer Name: ${order.user?.name || order.shippingName || "N/A"}`, { x: 50, y: height - 120, size: 12, font });
        page.drawText(`Email: ${order.user?.email || "N/A"}`, { x: 50, y: height - 140, size: 12, font });
        page.drawText(`Order ID: ${order.orderNumber}`, { x: 50, y: height - 160, size: 12, font });
        page.drawText(`Payment Status: ${order.paymentStatus}`, { x: 50, y: height - 180, size: 12, font });
        page.drawText(`Total Amount:  ${currencySymbol} ${order.totalAmount}`, { x: 50, y: height - 200, size: 12, font });

        // 🧾 Footer
        page.drawText("Thank you for shopping with us!", { x: 50, y: 80, size: 12, font });
        page.drawText(`© ${new Date().getFullYear()} Healing Herbs Oils Shop`, { x: 50, y: 60, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

        const pdfBytes = await pdfDoc.save();
        console.log("pdfBytes", pdfBytes)
        // 🟦 Return PDF response
        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Invoice_${order.orderNumber}.pdf"`,
            },
        });

    } catch (err) {
        console.error("Invoice generation failed ❌:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: err.message }), { status: 500 });
    }
}
