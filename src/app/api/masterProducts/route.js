import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        const res = await fetch(
            "https://staging-common.omni.increff.com/assure-magic2/master/articles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authusername: "HECATE_ERP-1200063404",
                    authpassword: "9381c0d5-6884-4e40-8ded-588faf983eca",
                },
                body: JSON.stringify(body),
            }
        );

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { rawResponse: text };
        }

        // 🔴 Handle known error types
        if (!res.ok || data?.code) {
            let userMessage = "Master product creation failed";

            if (data.code === "RESOURCE_EXISTS") {
                userMessage = "Product already exists in master system";
            }

            if (data.code === "BAD_DATA") {
                userMessage = data.message || "Invalid product data";
            }

            return NextResponse.json(
                {
                    success: false,
                    code: data.code,
                    message: userMessage,
                    originalMessage: data.message,
                },
                { status: 400 }
            );
        }

        // ✅ Success
        return NextResponse.json(
            {
                success: true,
                message: "Master product created successfully",
                articleMasters: data.articleMasters || [],
            },
            { status: 200 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
