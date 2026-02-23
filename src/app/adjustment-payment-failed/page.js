"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import React from "react";

export default function AdjustmentFailedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const txnId = searchParams.get("txnId");

    return (
        <div className=" flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center border border-gray-100 mt-10 mb-10">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <XCircle size={64} className="text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Failed
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-4">
                    Your transaction could not be completed. Please try again.
                </p>

                {txnId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Transaction ID: <span className="font-medium">{txnId}</span>
                    </p>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
                    >
                        Go to Order
                    </button>

                    {/* <button
                        onClick={() => router.back()}
                        className="w-full border border-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
                    >
                        Try Again
                    </button> */}
                </div>

            </div>
        </div>
    );
}