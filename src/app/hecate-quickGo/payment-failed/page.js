"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentFailedPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const id = searchParams.get("order_id");
        setOrderId(id);
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>

            <p className="text-lg text-gray-700 mb-6">
                Sorry, your payment for order <strong>{orderId}</strong> could not be completed.
            </p>

            <button
                onClick={() => router.push("/hecate-quickGo/checkout")}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Go Back to Checkout
            </button>
        </div>
    );
};

export default PaymentFailedPage;
