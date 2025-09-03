"use client";
import React from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";

const Header = ({ toggleSidebar }) => {
    const { user } = useSelector((state) => state.me);

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <header className="bg-[#161619] shadow-md px-6 py-4 flex justify-between items-center font-functionPro text-white">
            <div className="flex items-center gap-3">
                {/* Hamburger for mobile */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                >
                    <Menu className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <>
                        {/* Ye sirf text mobile me hide karega, avatar hamesha visible rahega */}
                        <span className="text-gray-200 hidden sm:block cursor-pointer">
                            Welcome, {getInitials(user.name)} 👋
                        </span>
                        <img
                            src={user.avatar || "https://i.pravatar.cc/40"}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                        />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
