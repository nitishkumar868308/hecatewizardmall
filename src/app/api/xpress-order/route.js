export async function POST(req) {
    try {
        const body = await req.json();

        const response = await fetch(
            "https://apisix-gateway.nextscm.com/api/orders/outwards",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            "HECATE-1200063404:a4bfb2fa-3592-4239-b8c9-cb300df45e99"
                        ).toString("base64"),
                },
                body: JSON.stringify(body),
            }
        );

        // 🔥 important fix
        const text = await response.text();
        const data = text ? JSON.parse(text) : { message: "Order created" };

        return Response.json(data);

    } catch (err) {
        console.error("Increff API Error:", err);

        return Response.json(
            { error: err.message || "Increff API failed" },
            { status: 500 }
        );
    }
}