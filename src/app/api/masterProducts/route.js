import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("body" , body)
        const res = await fetch(
            "https://staging-common.omni.increff.com/assure-magic2/master/articles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authusername": "HECATE_ERP-1200063404",
                    "authpassword": "9381c0d5-6884-4e40-8ded-588faf983eca",
                },
                body: JSON.stringify(body),
            }
        );

        const text = await res.text(); // first read as text
        console.log("text" , text)
        let data;
        try {
            data = JSON.parse(text); // try parsing JSON
        } catch (err) {
            console.error("Response is not valid JSON:", text);
            data = { rawResponse: text };
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
