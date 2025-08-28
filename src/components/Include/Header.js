"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./Login";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
    const [active, setActive] = useState("Home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openItem, setOpenItem] = useState(false);
    const router = useRouter();


    //const menuItems = ["Home", "Candles", "About", "Contact", "Oil"];
    const menuItems = ["Home", "Categories", "About", "Contact"];
    const categories = [
        {
            name: "Electronics",
            sub: ["Mobiles", "Laptops", "Cameras", "Headphones"],
            img: "/image/banner1.jpg",
        },
        {
            name: "Fashion",
            sub: ["Men", "Women", "Kids", "Accessories"],
            img: "/image/banner7.jpg",
        },
        {
            name: "Home & Furniture",
            sub: ["Sofas", "Beds", "Dining", "Lighting"],
            img: "/image/banner8.jpg",
        },
        {
            name: "Sports",
            sub: ["Cricket", "Football", "Tennis", "Gym"],
            img: "/image/banner6.jpg",
        },
        {
            name: "Books",
            sub: ["Fiction", "Non-fiction", "Comics", "Study"],
            img: "/image/banner1.jpg",
        },
        {
            name: "Beauty",
            sub: ["Makeup", "Skincare", "Haircare", "Perfume"],
            img: "/image/banner8.jpg",
        },
    ];
    // const dropdownItems = {
    //     Categories:
    //         [{ name: "Tech", subItems: [{ name: "AI" }, { name: "Blockchain" }], },
    //         { name: "Fashion", subItems: [{ name: "Men" }, { name: "Women" }], }, { name: "Sports" }, { name: "Music" },],
    // };
    const [activeCat, setActiveCat] = useState(categories[0])
    const pathname = usePathname();

    const handleMenuClick = (item) => {
        const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
        router.push(href);
        setActive(item);
        setMobileMenuOpen(false);
    };
    useEffect(() => {
        setOpenItem(null);
    }, [pathname]);

    return (
        <>
            <header className="w-full bg-[#161619] shadow-md sticky top-0 z-50">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <img
                                src="/image/logo PNG.png"
                                alt="Logo"
                                className="h-20 w-20 object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navigation Menu (Desktop) */}
                    {/* <nav className="hidden md:flex flex-1 justify-center">
                    <ul className="flex items-center gap-6">
                        {menuItems.map((item) => (
                            <li key={item}>
                                <Link href="">
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${active === item
                                            ? "bg-white text-[#161619]"
                                            : "text-white hover:bg-gray-700"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav> */}

                    {/* <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-6">
                            {menuItems.map((item) => {
                                // Generate proper href for each item
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = pathname === href;

                                return (
                                    <li key={item}>
                                        <Link
                                            href={href}
                                            className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isActive
                                                ? "bg-white text-[#161619]"
                                                : "text-white hover:bg-gray-700"
                                                }`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav> */}

                    <nav className="hidden md:flex flex-1 justify-center relative">
                        <ul className="flex items-center gap-6">
                            {menuItems.map((item) => {
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = pathname === href;

                                return (
                                    <li
                                        key={item}
                                        className="relative"
                                        onMouseEnter={() => setOpenItem(item)}
                                        onMouseLeave={() => setOpenItem(null)}
                                    >
                                        <Link
                                            href={href}
                                            className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isActive ? "bg-white text-[#161619]" : "text-white hover:bg-gray-700"
                                                }`}
                                        >
                                            {item}
                                        </Link>

                                        {/* Dropdown only for Categories */}
                                        {item === "Categories" && openItem === "Categories" && (
                                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[1200px] bg-[#161619] text-white shadow-lg py-8 px-10 grid grid-cols-3 gap-10 z-50">
                                                {categories.map((cat) => (
                                                    <div
                                                        key={cat.name}
                                                        className="flex items-start gap-6 border-b border-gray-700 pb-6 last:border-0"
                                                    >
                                                        {/* Text */}
                                                        <div className="flex-1">
                                                            <h3 className=" text-lg mb-3 font-functionPro">{cat.name}</h3>
                                                            <ul className="space-y-2">
                                                                {cat.sub.map((sub) => (
                                                                    <li key={sub}>
                                                                        <Link
                                                                            href={`/categories/${sub.toLowerCase()}`}
                                                                            className="text-gray-300 hover:text-white transition font-functionPro"
                                                                        >
                                                                            {sub}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Image */}
                                                        <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
                                                            <Image
                                                                src={cat.img}
                                                                alt={cat.name}
                                                                fill
                                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-6">
                            {menuItems.map((item) => {
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = pathname === href;

                                // Check if item has dropdown
                                const hasDropdown = dropdownItems && dropdownItems[item]?.length > 0;

                                return (
                                    <li key={item} className={`relative ${hasDropdown ? "group" : ""}`}>
                                        {hasDropdown ? (
                                            <>
                                                <span
                                                    className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer inline-block ${isActive ? "bg-white text-[#161619]" : "text-white hover:bg-gray-700"
                                                        }`}
                                                >
                                                    {item}
                                                </span>

                                          
                                                <ul className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                                                    {dropdownItems[item].map((subItem) => (
                                                        <li key={subItem.name} className="px-4 py-2 hover:bg-gray-100 relative group">
                                                            <Link
                                                                href={`/${item.toLowerCase()}/${subItem.name.toLowerCase()}`}
                                                                className="block"
                                                            >
                                                                {subItem.name}
                                                            </Link>

                                                          
                                                            {/* {subItem.subItems && subItem.subItems.length > 0 && (
                                                                <ul className="absolute left-full top-0 mt-0 ml-0 w-40 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                                                                    {subItem.subItems.map((nested) => (
                                                                        <li key={nested.name} className="px-4 py-2 hover:bg-gray-100">
                                                                            <Link
                                                                                href={`/${item.toLowerCase()}/${subItem.name.toLowerCase()}/${nested.name.toLowerCase()}`}
                                                                                className="block"
                                                                            >
                                                                                {nested.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )} 
                                                        </li>
                                                    ))}
                                                </ul>

                                            </>
                                        ) : (
                                            <Link
                                                href={href}
                                                className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isActive ? "bg-white text-[#161619]" : "text-white hover:bg-gray-700"
                                                    }`}
                                            >
                                                {item}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav> */}

                    {/* Icons */}
                    <div className="font-functionPro flex items-center gap-4 md:gap-6">
                        <button onClick={() => setIsOpen(true)} className="relative cursor-pointer">
                            <ShoppingCart className="h-6 w-6 text-white" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                3
                            </span>
                        </button>

                        {isOpen && (
                            <div className="fixed inset-0 z-50 flex">
                                {/* Overlay */}
                                <div
                                    className="font-functionPro fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                ></div>

                                {/* Drawer */}
                                <div
                                    className="ml-auto w-80 h-full bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-50"
                                    onClick={(e) => e.stopPropagation()} // <-- Drawer ke andar click pe close na ho
                                >
                                    <button
                                        className="self-end w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-red-500 hover:text-white shadow-md transition-colors duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ✕
                                    </button>
                                    <h2 className="text-xl font-bold text-center mt-4 mb-6">Your Cart</h2>
                                    <div className="flex-1 overflow-y-auto">
                                        <p>Cart items will be here...</p>
                                    </div>
                                    <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}



                        <button onClick={() => setLoginModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition text-white font-functionPro">
                            <User className="h-6 w-6" />
                            <span className="hidden md:inline font-medium">Login</span>
                        </button>

                        {/* Hamburger for mobile */}
                        <button
                            className="md:hidden cursor-pointer text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pb-3 font-functionPro">
                        <ul className="flex flex-col gap-3">
                            {menuItems.map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer ${active === item
                                            ? "bg-white text-[#161619]"
                                            : "text-white hover:bg-gray-700"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>

            <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
                <Login />
            </Modal>

        </>

    );
};

export default Header;
