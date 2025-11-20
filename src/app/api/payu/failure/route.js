import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const form = await req.formData();
    const orderId = form.get("txnid");

    if (!orderId) return new Response("Order ID missing", { status: 400 });

    const orderRecord = await prisma.orders.findUnique({ where: { orderNumber: orderId } });
    if (orderRecord) {
      await prisma.orders.delete({ where: { id: orderRecord.id } });
    }

    const baseUrl = new URL(req.url).origin;
    return Response.redirect(`${baseUrl}/payment-failed?order_id=${orderId}`);
  } catch (err) {
    console.error("PayU Failure Handler Error:", err);
    return new Response("Server Error", { status: 500 });
  }
}
