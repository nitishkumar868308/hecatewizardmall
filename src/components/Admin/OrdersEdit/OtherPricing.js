"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAdjustment, fetchOrderAdjustments } from "@/app/redux/slices/order-adjustments/orderAdjustmentsSlice";
import Loader from "@/components/Include/Loader";
import toast from "react-hot-toast";

const OtherPricing = ({ orderId }) => {
    const dispatch = useDispatch();
    const { loading, adjustments = [] } = useSelector(
        (state) => state.orderAdjustments
    );
    console.log("adjustments", adjustments)

    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        adjustmentType: "SHIPPING",
        impact: "DEBIT",
        amount: "",
        reason: "",
        manualType: "",
    });

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderAdjustments(orderId))
        }
    }, [dispatch, orderId])

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!orderId) {
            alert("Order ID missing");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            alert("Please enter valid amount");
            return;
        }

        if (
            formData.adjustmentType === "MANUAL" &&
            !formData.manualType
        ) {
            alert("Please enter manual adjustment type");
            return;
        }

        const payload = {
            orderId: Number(orderId),
            ...formData,
            amount: Number(formData.amount),
            isManual: formData.adjustmentType === "MANUAL",
            manualType:
                formData.adjustmentType === "MANUAL"
                    ? formData.manualType
                    : null,
        };

        const result = await dispatch(createOrderAdjustment(payload));

        if (result.meta.requestStatus === "fulfilled") {
            toast.success("Adjustment created successfully");
            setIsOpen(false);
            setFormData({
                adjustmentType: "SHIPPING",
                impact: "DEBIT",
                amount: "",
                reason: "",
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

            {/* Header + Add Button */}
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Order Adjustments
                </h2>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                >
                    + Add Adjustment
                </button>
            </div>

            {/* Table */}
            {/* <div className="overflow-x-auto max-h-64 overflow-y-auto  rounded-xl">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">#.</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Reason</th>
                            <th className="px-4 py-3">Created At</th>
                            <th className="px-4 py-3">Paid At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adjustments.length > 0 ? (
                            adjustments.map((item, index) => (
                                <tr
                                    key={index}
                                    className=" hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.adjustmentType}
                                    </td>
                                    <td className="px-4 py-3">
                                        ₹{item.amount}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.status}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.reason}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "—"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.paidAt
                                            ? new Date(item.paidAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "—"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No adjustments added yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div> */}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-6">

                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg font-semibold">
                                Create Order Adjustment
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adjustment Type
                                </label>
                                <select
                                    name="adjustmentType"
                                    value={formData.adjustmentType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                >
                                    <option value="SHIPPING">Shipping</option>
                                    <option value="TAX">Tax</option>
                                    <option value="DISCOUNT">Discount</option>
                                    <option value="ITEM_ADD">Item Add</option>
                                    <option value="ITEM_SHIPPING">
                                        Shipping + Product
                                    </option>
                                    <option value="MANUAL">MANUAL</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Impact
                                </label>
                                <select
                                    name="impact"
                                    value={formData.impact}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                >
                                    <option value="DEBIT">
                                        Debit (Customer Pays)
                                    </option>
                                    <option value="CREDIT">
                                        Credit (Refund / Reduce)
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason / Note
                                </label>
                                <textarea
                                    rows="2"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Explain reason for adjustment..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        </div>

                        {formData.adjustmentType === "MANUAL" && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manual Adjustment Type
                                </label>
                                <input
                                    type="text"
                                    name="manualType"
                                    value={formData.manualType}
                                    onChange={handleChange}
                                    placeholder="Enter custom adjustment type"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition 
                                ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-900"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} />
                                    Processing...
                                </>
                            ) : (
                                "Create & Send Payment Link"
                            )}
                        </button>
                    </div>

                </div>


            )}
        </div>
    );
};

export default OtherPricing;