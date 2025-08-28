"use client";
import React from "react";
import { Home, BarChart, Users, Settings, LogOut, X } from "lucide-react";
import Link from "next/link";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 font-functionPro 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Close btn mobile */}
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-bold text-blue-600 text-center">Admin</h2>
                    <button onClick={toggleSidebar}>
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* Logo Desktop */}
                <h2 className="text-2xl font-bold text-blue-600 mb-8 hidden md:block text-center">
                    Admin
                </h2>

                {/* <nav className="flex flex-col gap-4 text-gray-700 ">
                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                        <Home className="w-5 h-5" /> Home
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                        <BarChart className="w-5 h-5" /> Analytics
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                        <Users className="w-5 h-5" /> Users
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                        <Settings className="w-5 h-5" /> Settings
                    </button>
                </nav> */}

                <nav className="flex flex-col gap-4 text-gray-700">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                        <Home className="w-5 h-5" /> Home
                    </Link>

                    <Link href="/analytics" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                        <BarChart className="w-5 h-5" /> Analytics
                    </Link>

                    <Link href="/users" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                        <Users className="w-5 h-5" /> Users
                    </Link>

                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>

                <div className="mt-auto pt-6">
                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
