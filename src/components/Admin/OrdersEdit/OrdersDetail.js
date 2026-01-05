"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import OrderChat from "@/components/Common/OrderChat";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { useDispatch, useSelector } from "react-redux";

export default function OrderDetail({
    selectedOrder,
    isOpen,
    onClose,
    handleUpdateDetail,
    generateInvoiceNumber
}) {
    console.log("selectedOrder", selectedOrder)
    const dispatch = useDispatch();
    const [status, setStatus] = useState(selectedOrder?.status || "");
    const { user } = useSelector((state) => state.me);
    console.log("user", user)

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    if (!isOpen || !selectedOrder) return null;
    const orderByLabelMap = {
        "hecate-quickgo": "Hecate QuickGo",
        "website": "Hecate Wizard Mall",
    };
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

            {/* LEFT CHAT PANEL */}
            <div className="w-80 bg-white border-r shadow-xl flex flex-col">

                {/* Chat Header */}
                <div className="border-b px-4 py-3 font-semibold text-lg bg-gray-50">
                    Chat / Messages
                </div>
                <OrderChat
                    orderId={selectedOrder.id}
                    currentUser={user?.id}        // <- id bhejna
                    currentUserRole={user?.role}
                    receiverId={user?.role === "ADMIN" ? selectedOrder.userId : 1} // <--- customer id
                    receiverRole={user?.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}
                />






                {/* Chat Messages */}
                {/* <div className="flex-1 p-4 space-y-3 overflow-y-auto">

                    <div className="text-center text-gray-400 text-sm">
                        No messages yet...
                    </div>

                </div>

      
                <div className="border-t bg-gray-50 p-2 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                        Send
                    </button>
                </div> */}

                {/* Notes */}
                <div className="border-t px-4 py-3 font-semibold text-lg bg-gray-50">
                    Notes / Info
                </div>

                <textarea
                    className="w-full h-40 border-none px-4 py-3 text-sm resize-none outline-none bg-white"
                    placeholder="Add notes here..."
                ></textarea>

            </div>

            {/* RIGHT INVOICE PANEL */}
            <div className="flex-1 bg-white overflow-y-auto p-8 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold cursor-pointer hover:text-red-500 transition"
                >
                    ×
                </button>

                {/* Header */}
                <div className="border-b pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">Order Invoice</h2>

                        <p className="text-sm text-gray-600 mt-1">
                            Invoice No:{" "}
                            <b>
                                {generateInvoiceNumber(
                                    selectedOrder.id,
                                    selectedOrder.createdAt
                                )}
                            </b>
                        </p>

                        <p className="text-sm text-gray-500">
                            Order Number: {selectedOrder.orderNumber}
                        </p>
                    </div>


                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Order By: {orderByLabelMap[selectedOrder.orderBy.toLowerCase()] || selectedOrder.orderBy}
                    </span>

                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Order Status: {selectedOrder.status}
                    </span>
                </div>

                {/* CUSTOMER DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

                    {/* CUSTOMER */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>
                        <p className="font-medium">{selectedOrder.shippingName}</p>
                        <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
                    </div>

                    {/* BILLING */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">
                            Billing Address
                        </h3>
                        <p>{selectedOrder.billingAddress}</p>
                        <p>
                            {selectedOrder.billingCity}, {selectedOrder.billingState}
                        </p>
                        <p>{selectedOrder.billingPincode}</p>
                    </div>

                    {/* SHIPPING */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">
                            Shipping Address
                        </h3>
                        <p>{selectedOrder.shippingAddress}</p>
                        <p>
                            {selectedOrder.shippingCity}, {selectedOrder.shippingState}
                        </p>
                        <p>{selectedOrder.shippingPincode}</p>
                    </div>

                    {/* PAYMENT */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Payment</h3>
                        <p className="font-medium">
                            Method: {selectedOrder.paymentMethod}
                        </p>
                        <p className="text-green-700 font-medium">
                            Status: {selectedOrder.paymentStatus}
                        </p>
                    </div>



                </div>

                {/* TABLE */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                        <thead className="bg-gray-100">
                            <tr className="uppercase text-xs text-gray-700">
                                <th className="p-2 text-center">#</th>
                                <th className="p-2 text-center">Image</th>
                                <th className="p-2 text-center">Product</th>
                                <th className="p-2 text-center">Variation</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-center">Rate</th>
                                <th className="p-2 text-center">Offer</th>
                                <th className="p-2 text-center">Amount</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {selectedOrder.items?.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="p-2 text-center">{idx + 1}</td>

                                    <td className="p-2">
                                        <div className="flex justify-center items-center">
                                            <img
                                                src={item.image}
                                                alt={item.attributes?.color || "Product Image"}
                                                className="w-16 h-16 rounded-lg object-cover shadow"
                                            />
                                        </div>
                                    </td>

                                    <td className="p-2 font-medium text-center">{item.productName}</td>

                                    <td className="p-2 text-center">
                                        {item.attributes && (
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(item.attributes).map(([k, v]) => (
                                                    <p key={k}>
                                                        <b>{k}:</b> {v}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-center">₹{item.pricePerItem}</td>

                                    <td className="p-2 text-center">
                                        {item.offerApplied ? (
                                            <span className="text-green-600 font-semibold">Applied</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>

                                    <td className="p-2 text-center font-bold">₹{item.totalPrice}</td>

                                    <td className="p-2 text-center space-x-1">
                                        <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                            Query
                                        </button>
                                        <button className="px-2 py-1 text-xs bg-yellow-400 text-white rounded">
                                            Update
                                        </button>
                                        <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* TOTAL ROW - ITEMS */}
                            <tr className="bg-gray-200 font-semibold">
                                {/* Product column → TOTAL */}
                                <td className="p-3 text-left text-sm">Total</td>


                                {/* # column empty */}
                                <td></td>

                                {/* Image column empty */}
                                <td></td>

                                {/* Variation column empty */}
                                <td></td>

                                {/* Qty column → total qty */}
                                <td className="p-3 text-center text-sm">
                                    {selectedOrder.quantity}
                                </td>

                                {/* Price column empty */}
                                <td></td>

                                {/* Offer column empty */}
                                <td></td>

                                {/* Total amount column */}
                                <td className="p-3 text-center text-sm">
                                    ₹{selectedOrder.subtotal}
                                </td>

                                {/* Actions column empty */}
                                <td></td>
                            </tr>



                            {/* SHIPPING ROW */}
                            <tr className="bg-gray-100 font-medium">
                                <td colSpan={7} className="text-left  p-3 text-sm">
                                    Shipping Charges
                                </td>
                                <td className="text-center p-3 text-sm">
                                    ₹{selectedOrder.shippingCharges}
                                </td>
                                <td></td>
                            </tr>

                            {/* GRAND TOTAL */}
                            <tr className="bg-gray-300 font-bold">
                                <td colSpan={7} className="text-left  p-3 text-lg">
                                    Grand Total
                                </td>
                                <td className="text-center p-3 text-lg">
                                    ₹{selectedOrder.totalAmount}
                                </td>
                                <td></td>
                            </tr>


                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
