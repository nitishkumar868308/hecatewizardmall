"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const router = useRouter();

    return (
        <PrivateRoute roles={["USER"]}>
            <div className="bg-gray-50 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

                {/* Tabs for desktop */}
                <div className="hidden md:flex space-x-4 mb-8 ">
                    {["orders", "addresses", "profile"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Accordion for mobile */}
                <div className="md:hidden space-y-3 mb-8">
                    {["orders", "addresses", "profile"].map((tab) => (
                        <div key={tab} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
                                className="w-full text-left px-5 py-4 font-medium flex justify-between items-center text-gray-700 hover:bg-gray-50 transition"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className="text-xl font-bold">{activeTab === tab ? "-" : "+"}</span>
                            </button>
                            {activeTab === tab && (
                                <div className="p-5 border-t bg-gray-50 cursor-pointer">{renderContent(tab)}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop content */}
                <div className="hidden md:block bg-white shadow-lg rounded-lg p-8">
                    {renderContent(activeTab)}
                </div>
            </div>
        </PrivateRoute>
    );
}

// Render content based on active tab
function renderContent(tab) {
    switch (tab) {
        case "orders":
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                    <ul className="space-y-4">
                        <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl shadow-sm hover:shadow-lg transition bg-white">
                            <div className="flex items-start md:items-center space-x-4">
                                {/* Placeholder image */}
                                <img
                                    src="/products/product1.webp"
                                    alt="Order"
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                    <span className="font-semibold text-gray-800 text-lg">Order #1234</span>
                                    <p className="text-gray-500 text-sm mt-1">Placed on 1 Aug 2025</p>
                                </div>
                            </div>
                            <span className="mt-3 md:mt-0 px-3 py-1 rounded-full font-medium text-green-700 bg-green-100">
                                Delivered
                            </span>
                        </li>
                        <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl shadow-sm hover:shadow-lg transition bg-white">
                            <div className="flex items-start md:items-center space-x-4">
                                {/* Placeholder image */}
                                <img
                                    src="/products/product2.webp"
                                    alt="Order"
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                    <span className="font-semibold text-gray-800 text-lg">Order #1235</span>
                                    <p className="text-gray-500 text-sm mt-1">Placed on 3 Aug 2025</p>
                                </div>
                            </div>
                            <span className="mt-3 md:mt-0 px-3 py-1 rounded-full font-medium text-yellow-700 bg-yellow-100">
                                Processing
                            </span>
                        </li>
                    </ul>
                </div>

            );
        case "addresses":
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Your Addresses</h2>
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {[
                            { label: "Home", address: "123 Street, City, State, 12345" },
                            { label: "Office", address: "456 Street, City, State, 67890" },
                        ].map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{item.label}</p>
                                    <p className="text-gray-500 text-sm mt-1">{item.address}</p>
                                </div>
                                <div className="flex space-x-3">
                                    {/* Edit Icon */}
                                    <button className="text-blue-600 hover:text-blue-800 transition cursor-pointer">
                                        <Edit className="h-4 w-4" />
                                    </button>

                                    {/* Delete Icon */}
                                    <button className="text-red-600 hover:text-red-800 transition cursor-pointer">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            );
        case "profile":
            return (
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm">
                        {/* Profile Image */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <label className="mb-4 font-medium text-gray-700">Profile Picture</label>
                            <div className="relative">
                                <img
                                    src="/products/product1.webp" // Replace with user image URL
                                    alt="Profile"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-200"
                                />
                                <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>


                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Gender</label>
                            <select className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-2 font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="123 Street, City, State, 12345"
                            />
                        </div>

                        {/* Submit button */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form >
                </div >



            );
        default:
            return <p className="text-gray-500">Select a tab</p>;
    }
}
