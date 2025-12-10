import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const form = await req.formData();
    const orderId = form.get("txnid");
    const status = form.get("status")?.toLowerCase(); // normalize
    const baseUrl = new URL(req.url).origin;

    if (!orderId) return new Response("Order ID missing", { status: 400 });

    const orderRecord = await prisma.orders.findUnique({
      where: { orderNumber: orderId },
    });

    if (!orderRecord) return new Response("Order not found", { status: 404 });

    // Update DB only if payment failed/cancelled
    if (status === "failure" || status === "usercancelled") {
      await prisma.orders.update({
        where: { id: orderRecord.id },
        data: { status: "FAILED", paymentStatus: "FAILED" },
      });
      console.log(`Order ${orderId} marked as Failed`);
    }

    // Redirect based on stored orderBy
    const redirectPath =
      orderRecord.orderBy === "website"
        ? `/payment-failed?order_id=${orderId}`
        : `/hecate-quickGo/payment-failed?order_id=${orderId}`;

    return Response.redirect(`${baseUrl}${redirectPath}`);
  } catch (err) {
    console.error("PayU Failure Handler Error:", err);
    return new Response("Server Error", { status: 500 });
  }
}
