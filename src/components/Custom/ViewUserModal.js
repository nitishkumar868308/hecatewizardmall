"use client";

import React from "react";

export default function ViewUserModal({ user, isOpen, onClose }) {
    if (!isOpen || !user) return null;
    console.log("user.orders", user.orders)
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto pt-10">
            <div className="bg-white rounded-2xl w-11/12 max-w-6xl p-8 relative shadow-xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-3xl font-bold cursor-pointer hover:text-red-500 transition"
                >
                    ×
                </button>

                {/* Header */}
                <div className="border-b pb-4 mb-6 flex justify-between items-center">
                    <h2 className="text-3xl font-bold">User Details</h2>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Provider: {user.provider || "LOCAL"}
                    </span>
                </div>

                {/* Basic Info & Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    {/* Basic Info */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-2 text-gray-700">Basic Info</h3>
                        <p className="font-medium">Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone || "-"}</p>

                    </div>

                    {/* Billing Address */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-2 text-gray-700">Billing Address</h3>
                        <p>{user.address || "-"}</p>
                        <p>
                            {user.city || "-"}, {user.state || "-"} {user.pincode || "-"}
                        </p>
                        <p>{user.country || "-"}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-2 text-gray-700">Shipping Address</h3>
                        <p>{user.shippingAddress || user.address || "-"}</p>
                        <p>
                            {user.shippingCity || user.city || "-"}, {user.shippingState || user.state || "-"}{" "}
                            {user.shippingPincode || user.pincode || "-"}
                        </p>
                        <p>{user.shippingCountry || user.country || "-"}</p>
                    </div>

                    {/* Extra Info */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-2 text-gray-700">Extra Info</h3>
                        <p>Gender: {user.gender || "-"}</p>
                        <p>Role: {user.role}</p>
                        {/* Total Orders Amount */}
                        <p>
                            Paid Total Orders Amount: ₹
                            {user.orders
                                ? user.orders
                                    .filter(order => order.paymentStatus === "PAID") // Failed/Canceled ignore
                                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                                    .toFixed(2)
                                : "0.00"}
                        </p>

                        {/* Total Orders Count */}
                        <p>
                            Paid Total Orders: {user.orders ? user.orders.filter(order => order.paymentStatus === "PAID").length : 0}
                        </p>

                        {/* <p>Email Verified: {user.emailVerified ? "Yes" : "No"}</p> */}
                    </div>
                </div>

                {/* Notes / Profile Image */}
                {/* {(user.note || user.profileImage) && (
                    <div className="border-t px-4 py-4 font-semibold text-lg bg-gray-50 mt-6 flex flex-col md:flex-row gap-6">
                        {user.note && (
                            <div className="flex-1">
                                <p className="font-semibold mb-2">Notes / Info:</p>
                                <p className="text-sm font-normal">{user.note}</p>
                            </div>
                        )}
                        {user.profileImage && (
                            <div className="flex-1 flex justify-center items-center">
                                <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-xl object-cover shadow"
                                />
                            </div>
                        )}
                    </div>
                )} */}

                {/* Cart Items */}
                {user.items && user.items.length > 0 ? (
                    <div className="mt-8 max-h-[500px] overflow-y-auto overflow-x-auto">
                        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Cart Items</h3>
                        <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                            <thead className="bg-gray-900 text-xs text-gray-100 uppercase sticky top-0">
                                <tr>
                                    <th className="p-2 text-center">#</th>
                                    <th className="p-2 text-center">Image</th>
                                    <th className="p-2 text-center">Product</th>
                                    <th className="p-2 text-center">Variation</th>
                                    <th className="p-2 text-center">Qty</th>
                                    <th className="p-2 text-center">Rate</th>
                                    <th className="p-2 text-center">Amount</th>
                                    <th className="p-2 text-center">Platform</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.items.map((item, idx) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 text-center">{idx + 1}</td>
                                        <td className="p-2 flex justify-center">
                                            <img
                                                src={item.image}
                                                alt={item.attributes?.color || "Product Image"}
                                                className="w-16 h-16 rounded-lg object-cover shadow"
                                            />
                                        </td>
                                        <td className="p-2 text-center">{item.productName}</td>
                                        <td className="p-2 text-center">
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(item.attributes).map(([k, v]) => (
                                                    <p key={k}><b>{k}:</b> {v}</p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-center">{item.pricePerItem}</td>
                                        <td className="p-2 text-center font-bold">{item.totalPrice}</td>
                                        <td className="p-2 text-center font-bold">
                                            {item.purchasePlatform === "website"
                                                ? "Hecate Wizard Mall"
                                                : item.purchasePlatform === "xpress"
                                                    ? "Hecate QuickGo"
                                                    : item.purchasePlatform // baki case me original value dikha do
                                            }
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500 font-medium text-center">No items in user cart.</p>
                )}


            </div>
        </div>
    );
}
