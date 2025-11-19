export async function POST(req) {
    try {
        const form = await req.formData();
        const orderId = form.get("txnid");
        const status = form.get("status");

        const baseUrl = new URL(req.url).origin;

        if (status === "success") {
            return Response.redirect(
                `${baseUrl}/payment-success?order_id=${orderId}`
            );
        } else {
            return Response.redirect(
                `${baseUrl}/payment-failed?order_id=${orderId}`
            );
        }
    } catch (err) {
        return new Response("Error", { status: 500 });
    }
}
