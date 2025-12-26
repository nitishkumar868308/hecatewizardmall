"use client";
import React, { useState } from "react";
import { Home, Users, Settings, LogOut, X, ChevronDown, ChevronUp, LayoutGrid, Clapperboard, MapPin, Package, FileText, Archive, Warehouse, ShoppingCart, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuOpenProduct, setMenuOpenProduct] = useState(false);
    const [menuOpenTax, setMenuOpenTax] = useState(false);
    const [manuOpenLocation, setMenuOpenLocation] = useState(false);
    const [manuOpenOrder, setMenuOpenOrder] = useState(false);
    const [manuOpenWareHouseLocation, setMenuOpenWareHouseLocation] = useState(false);
    const [manuOpenWareHouseFullfillment, setMenuOpenWareHouseFullfillment] = useState(false);

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
                className={`fixed top-0 left-0 h-full w-64 bg-[#161619] shadow-lg p-6 overflow-y-auto scrollbar-hide  transform transition-transform duration-300 font-functionPro 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
            >
                {/* Close btn mobile */}
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-bold text-white text-center">Admin</h2>
                    <button onClick={toggleSidebar}>
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* Logo Desktop */}
                <div className="flex items-center justify-center w-full px-4 md:px-8">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/image/logo PNG.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </a>
                </div>





                {/* Sidebar Navigation */}
                <nav className="flex flex-col gap-2 mt-8 text-gray-700">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition"

                    >
                        <Home className="w-5 h-5" /> Home
                    </Link>

                    {/* Menus with dropdown */}
                    <div>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <LayoutGrid className="w-5 h-5" /> Menus
                            </span>
                            {menuOpen ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {menuOpen && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/header"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add Menu
                                </Link>
                                <Link
                                    href="/admin/category"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add Category
                                </Link>
                                <Link
                                    href="/admin/subcategory"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add Subcategory
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setMenuOpenTax(!menuOpenTax)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <FileText className="w-5 h-5" /> Tax
                            </span>
                            {menuOpenTax ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {menuOpenTax && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/countryTaxes"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Country Taxes
                                </Link>
                                {/* <Link
                                    href="/admin/category"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add Category
                                </Link> */}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/banners"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                    >
                        <ImageIcon className="w-5 h-5" /> Banners
                    </Link>

                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                    >
                        <Users className="w-5 h-5" /> Users
                    </Link>

                    <div>
                        <button
                            onClick={() => setMenuOpenOrder(!manuOpenOrder)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5" /> Orders
                            </span>
                            {manuOpenOrder ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {manuOpenOrder && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    All Orders
                                </Link>
                                <Link
                                    href="/admin/create_order"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Create Order
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setMenuOpenProduct(!menuOpenProduct)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <Package className="w-5 h-5" /> Products
                            </span>
                            {menuOpenProduct ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {menuOpenProduct && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/products"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    All Products
                                </Link>
                                <Link
                                    href="/admin/attribute"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Attribute
                                </Link>
                                <Link
                                    href="/admin/offer"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Offer
                                </Link>
                                <Link
                                    href="/admin/countryPricing"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Country Pricing
                                </Link>
                                <Link
                                    href="/admin/tags"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Tags
                                </Link>
                                <Link
                                    href="/admin/externalMarket"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    External Market
                                </Link>
                                <Link
                                    href="/admin/shippingPricing"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Shipping Pricing
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/videoStory"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                    >
                        <Clapperboard className="w-5 h-5" /> Video Story
                    </Link>

                    <div>
                        <button
                            onClick={() => setMenuOpenLocation(!manuOpenLocation)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <MapPin className="w-5 h-5" /> Add Location
                            </span>
                            {manuOpenLocation ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {manuOpenLocation && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/loctaion_State"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add State
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setMenuOpenWareHouseLocation(!manuOpenWareHouseLocation)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <Archive className="w-5 h-5" /> Ware House
                            </span>
                            {manuOpenWareHouseLocation ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {manuOpenWareHouseLocation && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/warehouse_location"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Add WareHouse Location
                                </Link>
                                <Link
                                    href="/admin/send_to_warehouse"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Send to Warehouse
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setMenuOpenWareHouseFullfillment(!manuOpenWareHouseFullfillment)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <Warehouse className="w-5 h-5" />FullFillment Center
                            </span>
                            {manuOpenWareHouseFullfillment ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Dropdown items */}
                        {manuOpenWareHouseFullfillment && (
                            <div className="ml-8 mt-2 flex flex-col gap-2">
                                <Link
                                    href="/admin/delhi_store"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Delhi FullFillment Center
                                </Link>
                                <Link
                                    href="/admin/send_to_warehouse"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white hover:bg-white hover:text-black transition cursor-pointer"
                                >
                                    Banglore FullFillment Center
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* <Link
                        href="/admin/delhi_store"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                    >
                        <Warehouse className="w-5 h-5" /> Delhi Store
                    </Link> */}

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
                    >
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>

                {/* Logout Button */}
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
