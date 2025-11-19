"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(null);
    const [status, setStatus] = useState("Processing...");

    // Avoid hydration mismatch
    useEffect(() => {
        const id = searchParams.get("order_id");
        setOrderId(id);

        if (id) {
            setStatus("Payment Successful!");
        } else {
            setStatus("No order found.");
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
            <div className="bg-white shadow-lg rounded-2xl max-w-lg w-full p-10 text-center mt-10 mb-10">
                <div className="mb-6">
                    {status === "Payment Successful!" ? (
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mx-auto">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-400 rounded-full mx-auto animate-pulse"></div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-black mb-4">{status}</h1>

                {orderId && (
                    <p className="text-gray-700 mb-6">
                        Your order ID: <span className="font-mono text-black">{orderId}</span>
                    </p>
                )}

                <p className="text-gray-600 mb-8">
                    Thank you for your payment.
                </p>

                <a
                    href="/dashboard"
                    className="inline-block px-8 py-3 font-semibold text-black bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                    Go to Orders
                </a>
            </div>
        </div>
    );
}
