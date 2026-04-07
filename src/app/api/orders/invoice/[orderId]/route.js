import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = "MY_SUPER_SECRET";

let currentPage = page;

const addNewPage = () => {
    currentPage = pdfDoc.addPage([600, 800]);
    y = 750;

    // 👉 Table Header (IMPORTANT)
    currentPage.drawRectangle({
        x: 50,
        y: y - 5,
        width: 500,
        height: 25,
        color: rgb(0.2, 0.4, 0.8),
    });

    const white = rgb(1, 1, 1);

    currentPage.drawText("S.No", { x: 55, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Image", { x: 90, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Item", { x: 140, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("HSN", { x: 280, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Qty", { x: 340, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Price", { x: 390, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Tax", { x: 450, y, size: 10, font: fontBold, color: white });
    currentPage.drawText("Total", { x: 500, y, size: 10, font: fontBold, color: white });

    y -= 30;
};

const drawWrappedText = (text, x, y, maxWidth, font, size) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let word of words) {
        const testLine = line + word + " ";
        const width = font.widthOfTextAtSize(testLine, size);

        if (width > maxWidth) {
            currentPage.drawText(line, { x, y: currentY, size, font });
            line = word + " ";
            currentY -= 10;
        } else {
            line = testLine;
        }
    }

    if (line) {
        currentPage.drawText(line, { x, y: currentY, size, font });
        currentY -= 10;
    }

    return currentY;
};

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

        // ================= PRODUCTS =================
        const productIds = order.items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                category: { include: { countryTaxes: true } },
            },
        });

        const productMap = {};
        products.forEach(p => { productMap[p.id] = p; });

        // ================= PDF =================
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let y = 750;

        // ================= TEXT WRAP =================
        const drawMultilineText = (text, x, y, maxWidth, font, size, lineHeight = 10) => {
            const words = text.split(" ");
            let line = "";
            let currentY = y;

            for (let word of words) {
                const testLine = line + word + " ";
                const width = font.widthOfTextAtSize(testLine, size);

                if (width > maxWidth) {
                    page.drawText(line, { x, y: currentY, size, font });
                    line = word + " ";
                    currentY -= lineHeight;
                } else {
                    line = testLine;
                }
            }

            if (line) {
                page.drawText(line, { x, y: currentY, size, font });
                currentY -= lineHeight;
            }

            return currentY;
        };

        // ================= HEADER =================
        page.drawRectangle({
            x: 0,
            y: 720,
            width: 600,
            height: 80,
            color: rgb(0.96, 0.96, 0.98),
        });

        try {
            const logoBytes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/image/logohwm.png`)
                .then(res => res.arrayBuffer());
            // const logo = await pdfDoc.embedJpg(logoBytes);
            const logo = await pdfDoc.embedPng(logoBytes);
            page.drawImage(logo, { x: 50, y: 735, width: 50, height: 50 });
        } catch { }

        page.drawText("Hecate Wizard Mall", { x: 110, y: 765, size: 18, font: fontBold });
        page.drawText("TAX INVOICE", { x: 450, y: 765, size: 18, font: fontBold });

        page.drawText("27 Deepali, Pitampura, New Delhi - 110034", { x: 110, y: 745, size: 9, font });
        page.drawText(`GSTIN: 07ABCDE1234F1Z5`, { x: 110, y: 733, size: 9, font });

        // ================= INVOICE INFO =================
        let invoiceTopY = 740;

        page.drawText(`Invoice No: ${order.invoiceNumber || "-"}`, { x: 450, y: invoiceTopY, size: 9, font });
        page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
            x: 450,
            y: invoiceTopY - 14,
            size: 9,
            font,
        });

        y = invoiceTopY - 60;

        // ================= 3 COLUMN LAYOUT =================

        const col1X = 50;
        const col2X = 220;
        const col3X = 390;
        const colWidth = 150;

        // ===== BILL TO =====
        page.drawText("BILL TO", { x: col1X, y: y + 15, size: 10, font: fontBold });

        let billY = y;
        page.drawText(order.billingName || "-", { x: col1X, y: billY, size: 11, font: fontBold });

        billY -= 14;
        billY = drawMultilineText(order.billingAddress || "-", col1X, billY, colWidth, font, 9);

        billY -= 5;
        page.drawText(
            `${order.billingCity}, ${order.billingState} - ${order.billingPincode}`,
            { x: col1X, y: billY, size: 9, font }
        );


        // ===== SHIP TO =====
        page.drawText("SHIP TO", { x: col2X, y: y + 15, size: 10, font: fontBold });

        let shipY = y;
        page.drawText(order.shippingName || "-", { x: col2X, y: shipY, size: 11, font: fontBold });

        shipY -= 14;
        shipY = drawMultilineText(order.shippingAddress || "-", col2X, shipY, colWidth, font, 9);

        shipY -= 5;
        page.drawText(
            `${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`,
            { x: col2X, y: shipY, size: 9, font }
        );


        // ===== PAYMENT DETAILS =====
        page.drawText("PAYMENT DETAILS", { x: col3X, y: y + 15, size: 10, font: fontBold });

        let paymentY = y;

        paymentY -= 14;
        page.drawText(`Method: ${order.paymentMethod || "-"}`, {
            x: col3X,
            y: paymentY,
            size: 9,
            font,
        });

        paymentY -= 12;
        page.drawText(`Payment Status: ${order.paymentStatus}`, {
            x: col3X,
            y: paymentY,
            size: 9,
            font,
        });

        // paymentY -= 12;
        // page.drawText(`Order Status: ${order.status}`, {
        //     x: col3X,
        //     y: paymentY,
        //     size: 9,
        //     font,
        // });


        // ===== DYNAMIC HEIGHT FIX =====
        y = Math.min(billY, shipY, paymentY) - 30;

        // ================= TABLE HEADER =================
        page.drawRectangle({
            x: 50,
            y: y - 5,
            width: 500,
            height: 25,
            color: rgb(0.2, 0.4, 0.8),
        });

        const white = rgb(1, 1, 1);

        page.drawText("S.No", { x: 55, y, size: 10, font: fontBold, color: white });
        page.drawText("Image", { x: 90, y, size: 10, font: fontBold, color: white });
        page.drawText("Item", { x: 140, y, size: 10, font: fontBold, color: white });
        page.drawText("HSN", { x: 280, y, size: 10, font: fontBold, color: white });
        page.drawText("Qty", { x: 340, y, size: 10, font: fontBold, color: white });
        page.drawText("Price", { x: 390, y, size: 10, font: fontBold, color: white });
        page.drawText("Tax", { x: 450, y, size: 10, font: fontBold, color: white });
        page.drawText("Total", { x: 500, y, size: 10, font: fontBold, color: white });

        y -= 30;

        // ================= ITEMS =================
        let index = 1;

        for (const item of order.items || []) {
            if (y < 120) {
                addNewPage();
            }
            const product = productMap[item.productId];
            console.log("product", product)
            const hsn = product?.category?.hsn || "N/A";
            const taxObj = product?.category?.countryTaxes?.find(t => t.country === "India");
            console.log("taxObj", taxObj)
            const taxPercent = taxObj?.generalTax || 0;
            console.log("taxPercent ", taxPercent)

            page.drawText(String(index++), { x: 55, y, size: 9, font });

            try {
                const imgUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`;
                const imgBytes = await fetch(imgUrl).then(res => res.arrayBuffer());

                const img = imgUrl.endsWith(".png")
                    ? await pdfDoc.embedPng(imgBytes)
                    : await pdfDoc.embedJpg(imgBytes);

                page.drawImage(img, { x: 85, y: y - 10, width: 30, height: 30 });
            } catch { }

            // ================= OFFER LOGIC =================
            let offerText = "";

            // ===== RANGE OFFER (item.productOffer se) =====
            if (
                item.productOfferApplied &&
                item.productOffer &&
                item.productOffer.discountType === "rangeBuyXGetY"
            ) {
                const offer = item.productOffer;

                offerText = `Buy ${offer.buyQty}-${offer.maxQty} Get ${offer.getQty} Free`;
            }

            // ===== BULK PRICE (product se) =====
            if (
                product?.bulkPrice &&
                product?.minQuantity &&
                item.quantity >= Number(product.minQuantity)
            ) {
                offerText = `Bulk Price Applied (Min ${product.minQuantity})`;
            }

            // ================= DRAW =================
            let newY = drawWrappedText(
                item.productName || "-",
                140,
                y,
                120, // 👈 CONTROL WIDTH (IMPORTANT)
                fontBold,
                9
            );

            // 👉 OFFER TEXT niche show karo
            if (offerText) {
                page.drawText(offerText, {
                    x: 140,
                    y: y - 10,
                    size: 8,
                    font
                });
            }

            page.drawText(hsn, { x: 280, y, size: 9, font });
            page.drawText(String(item.quantity), { x: 340, y, size: 9, font });
            page.drawText(`Rs${item.pricePerItem}`, { x: 390, y, size: 9, font });
            page.drawText(`${taxPercent}%`, { x: 450, y, size: 9, font });

            // 👉 IMPORTANT: totalPrice hi use karna hai (already calculated)
            page.drawText(`Rs${item.totalPrice}`, { x: 500, y, size: 9, font: fontBold });

            // 👉 spacing fix (offer ho to extra space)
            y -= offerText ? 50 : 40;
            y = newY - 20;
        }

        // ================= TOTAL =================
        y -= 30;

        // Right align start position
        const labelX = 380;
        const valueX = 520;

        // ===== Subtotal =====
        page.drawText("Subtotal:", { x: labelX, y, size: 10, font });
        page.drawText(`Rs ${order.subtotal.toFixed(2)}`, { x: valueX, y, size: 10, font });
        y -= 18;


        // ===== PROMO LOGIC =====
        let promoDiscount = 0;
        let promoText = "";

        if (order.promoCode) {
            const promo = await prisma.promoCode.findUnique({
                where: { code: order.promoCode }
            });

            if (promo) {
                if (promo.discountType === "FLAT") {
                    promoDiscount = promo.discountValue;
                    promoText = `Promo (${order.promoCode} - Flat Rs ${promo.discountValue})`;
                } else if (promo.discountType === "PERCENTAGE") {
                    promoDiscount = (order.subtotal * promo.discountValue) / 100;
                    promoText = `Promo (${order.promoCode} - ${promo.discountValue}%)`;
                }
            }
        }


        // ===== PROMO =====
        if (promoDiscount > 0) {
            page.drawText(promoText, { x: labelX, y, size: 10, font });

            page.drawText(
                `- Rs ${promoDiscount.toFixed(2)}`,
                { x: valueX, y, size: 10, font }
            );
            y -= 18;
        }


        // ===== DONATION =====
        if (order.donationAmount && order.donationAmount > 0) {
            page.drawText("Donation:", { x: labelX, y, size: 10, font });

            page.drawText(
                `Rs ${order.donationAmount.toFixed(2)}`,
                { x: valueX, y, size: 10, font }
            );
            y -= 18;
        }


        // ===== SHIPPING =====
        page.drawText("Shipping:", { x: labelX, y, size: 10, font });
        page.drawText(
            `Rs ${order.shippingCharges.toFixed(2)}`,
            { x: valueX, y, size: 10, font }
        );

        y -= 20;


        // ===== LINE =====
        page.drawLine({
            start: { x: labelX, y },
            end: { x: 550, y },
            thickness: 1,
            color: rgb(0.7, 0.7, 0.7),
        });

        y -= 20;


        // ===== FINAL TOTAL BOX =====
        // page.drawRectangle({
        //     x: labelX - 10,
        //     y: y - 10,
        //     width: 180,
        //     height: 30,
        //     color: rgb(0.9, 0.95, 1),
        // });

        // ===== TOTAL TEXT =====
        page.drawText("Total:", {
            x: labelX,
            y,
            size: 12,
            font: fontBold
        });

        page.drawText(`Rs ${order.totalAmount.toFixed(2)}`, {
            x: valueX,
            y,
            size: 12,
            font: fontBold
        });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=Invoice_${order.orderNumber}.pdf`,
            },
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Error generating invoice" }), { status: 500 });
    }
}