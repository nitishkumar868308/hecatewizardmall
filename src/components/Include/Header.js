"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./Login";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logoutUser } from "@/app/redux/slices/meProfile/meSlice";
import {
    fetchHeaders,
} from "@/app/redux/slices/addHeader/addHeaderSlice";
import {
    fetchCategories,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import {
    fetchSubcategories,
} from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCart, updateLocalCartItem, updateCart, deleteCartItem } from "@/app/redux/slices/addToCart/addToCartSlice";
import SearchPage from "./SearchPage";
import ProductOffers from "../Product/ProductOffers/ProductOffers";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";

const Header = () => {
    const [active, setActive] = useState("Home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [openItem, setOpenItem] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { headers } = useSelector((state) => state.headers);
    const { categories, loading, error } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { items } = useSelector((state) => state.cart);
    console.log("user", user)
    const userCart = items?.filter((item) => item.userId === (user?.id)) || [];
    console.log("userCart", userCart)
    // const userCartCount = userCart.length;
    console.log("categories", categories)
    console.log("subcategories", subcategories)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { products } = useSelector((state) => state.products);
    const [userCartState, setUserCartState] = useState([]);
    useEffect(() => {
        setUserCartState(prev => {
            // Only update if different length or different ids
            const prevIds = prev.map(i => i.id).join(',');
            const newIds = userCart.map(i => i.id).join(',');
            if (prevIds !== newIds) {
                return userCart;
            }
            return prev;
        });
    }, [userCart]);


    const userCartCount = userCartState.length;
    console.log("userCartCount", userCartCount);
    useEffect(() => {
        dispatch(fetchCart())
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchHeaders());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    console.log("user", user)

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    //const menuItems = ["Home", "Candles", "About", "Contact", "Oil"];
    // const menuItems = ["Home", "Categories", "About", "Contact"];
    const menuItems = headers
        .filter(h => h.active === true)
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(h => h.name);

    // Step 1: Map all categories first
    const categoriesMap = {};
    categories
        .filter(cat => cat.active)
        .forEach(cat => {
            categoriesMap[cat.id] = {
                name: cat.name,
                sub: [], // initially empty
                img: cat.image || "/default-image.jpg",
            };
        });
    console.log("categoriesMap", categoriesMap)
    // Step 2: Fill subcategories
    subcategories
        .filter(sub => sub.active)
        .forEach(sub => {
            const catId = sub.category.id;
            if (categoriesMap[catId]) {
                categoriesMap[catId].sub.push(sub.name);
            }
        });

    // Step 3: Convert to array
    const mappedCategories = Object.values(categoriesMap);
    console.log("mappedCategories", mappedCategories)



    // const categories = [
    //     {
    //         name: "Electronics",
    //         sub: ["Mobiles", "Laptops", "Cameras", "Headphones"],
    //         img: "/image/banner1.jpg",
    //     },
    //     {
    //         name: "Fashion",
    //         sub: ["Men", "Women", "Kids", "Accessories"],
    //         img: "/image/banner7.jpg",
    //     },
    //     {
    //         name: "Home & Furniture",
    //         sub: ["Sofas", "Beds", "Dining", "Lighting"],
    //         img: "/image/banner8.jpg",
    //     },
    //     {
    //         name: "Sports",
    //         sub: ["Cricket", "Football", "Tennis", "Gym"],
    //         img: "/image/banner6.jpg",
    //     },
    //     {
    //         name: "Books",
    //         sub: ["Fiction", "Non-fiction", "Comics", "Study"],
    //         img: "/image/banner1.jpg",
    //     },
    //     {
    //         name: "Beauty",
    //         sub: ["Makeup", "Skincare", "Haircare", "Perfume"],
    //         img: "/image/banner8.jpg",
    //     },
    // ];
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

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const handleLogout = () => {
        dispatch(logoutUser());
        setDropdownOpen(false);
    };

    const updateQuantity = (index, delta) => {
        const item = userCart[index];
        const newQuantity = Math.max(1, item.quantity + delta);
        dispatch(updateLocalCartItem({ id: item.id, newQuantity }));
        dispatch(updateCart({ id: item.id, quantity: newQuantity }));
    };
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("baseUrl", baseUrl)

    const handleDelete = async () => {
        try {
            const result = await dispatch(deleteCartItem(selectedItemId)).unwrap();
            console.log("result", result)
            toast.success(result.message || "Item deleted successfully");
            dispatch(fetchCart())
            setIsConfirmOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete item");
        }
    };

    // Function to update color quantity
    const updateColorQuantity = (productId, color, delta) => {
        setUserCartState(prevCart => {
            return prevCart.map(item => {
                if (item.productId === productId && item.attributes?.color === color) {
                    const newQty = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(item => item.quantity > 0); // remove if 0
        });
    };

    // Group cart ignoring color for card
    const groupedCart = useMemo(() => {
        return userCartState.reduce((acc, item) => {
            const key = item.productId + '-' + Object.entries(item.attributes || {})
                .filter(([k]) => k !== 'color')
                .map(([k, v]) => `${k}:${v}`).join('|');

            if (!acc[key]) {
                acc[key] = {
                    productId: item.productId,
                    productName: item.productName,
                    attributes: { ...item.attributes, color: null },
                    currency: item.currency,
                    itemIds: [item.id], // ✅ store original item id
                    colors: [{ color: item.attributes?.color, quantity: item.quantity, pricePerItem: item.pricePerItem, image: item.image, itemId: item.id }]
                };
            } else {
                acc[key].itemIds.push(item.id);
                const colorIndex = acc[key].colors.findIndex(c => c.color === item.attributes?.color);
                if (colorIndex >= 0) {
                    acc[key].colors[colorIndex].quantity += item.quantity;
                } else {
                    acc[key].colors.push({ color: item.attributes?.color, quantity: item.quantity, pricePerItem: item.pricePerItem, image: item.image, itemId: item.id });
                }
            }
            return acc;
        }, {});
    }, [userCartState]);

    const removeColorFromCart = (productId, color) => {
        setUserCartState(prevCart =>
            prevCart.filter(item => !(item.productId === productId && item.attributes?.color === color))
        );
    };


    const removeProductFromCart = (item) => {
        setUserCartState(prevCart =>
            prevCart.filter(cartItem => !item.itemIds.includes(cartItem.id))
        );
    };



    return (
        <>
            <header className="w-full bg-[#161619] shadow-md md:relative fixed md:static top-0 z-50">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <img
                                src="/image/HWM LOGO 1 GREY 100.png"
                                alt="Logo"
                                className="h-20 w-24 object-contain"
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
                                            <div className="absolute left-1/2 transform -translate-x-[48%]
 top-full mt-1 w-[1400px] bg-[#161619] text-white shadow-lg py-8 px-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-50">
                                                {mappedCategories.map((cat, index) => {
                                                    console.log("cat?.img", cat?.img)
                                                    const imgSrc = cat?.img
                                                        ? encodeURI(cat.img.startsWith("http") ? cat.img : cat.img)
                                                        : "/default-image.jpg";
                                                    console.log("imgSrc", imgSrc);

                                                    return (
                                                        <div
                                                            key={cat.id || `${cat.name}-${index}`}
                                                            className="flex items-start gap-6 border-b border-gray-700 pb-6 last:border-0"
                                                        >

                                                            <div className="flex-1">
                                                                <h3 className=" text-lg mb-3 font-functionPro">{cat.name}</h3>
                                                                <ul className="space-y-2">
                                                                    {cat.sub.map((sub) => (
                                                                        <li key={sub}>
                                                                            <Link
                                                                                href={`/categories?category=${encodeURIComponent(cat.name)}&&subcategory=${encodeURIComponent(sub)}`}
                                                                                className="text-gray-300 hover:text-white transition font-functionPro"
                                                                            >
                                                                                {sub}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>


                                                            <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
                                                                <Image
                                                                    src={imgSrc}
                                                                    alt={cat.name}
                                                                    fill
                                                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
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
                        <SearchPage />

                        <button onClick={() => setIsOpen(true)} className="relative cursor-pointer">
                            <ShoppingCart className="h-6 w-6 text-white" />
                            {userCartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {userCartCount}
                                </span>
                            )}
                        </button>




                        {isOpen && (
                            <div className="fixed inset-0 z-50 flex">
                                {/* Overlay */}
                                <div
                                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                ></div>

                                {/* Drawer */}
                                <div
                                    className="ml-auto w-100 h-full bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="self-end w-8 h-8 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white shadow-md transition-colors duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ✕
                                    </button>

                                    <h2 className="text-2xl font-bold text-center mt-4 mb-6">Your Cart</h2>

                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {userCartCount > 0 ? (
                                            Object.values(groupedCart).map((item, index) => {
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                const totalQuantity = item.colors.reduce((sum, c) => sum + c.quantity, 0);

                                                return (
                                                    <div key={index} className="relative flex flex-col gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50">

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemId(item); // poora grouped item pass karo
                                                                setIsConfirmOpen(true);
                                                            }}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>

                                                        {/* Product Name */}
                                                        <div className="flex items-center gap-3 cursor-pointer">
                                                            <Link href={`/product/${item.productId}`} onClick={() => setIsOpen(false)}>
                                                                <img src={item.colors[0].image || "/placeholder.png"} alt={item.productName} className="w-16 h-16 object-cover rounded-md border" />
                                                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.productName}</h3>
                                                            </Link>
                                                        </div>

                                                        {/* Variation details */}
                                                        {Object.entries(item.attributes).filter(([k]) => k !== 'color').map(([k, v]) => (
                                                            <p key={k} className="text-xs text-gray-500">{k}: {v}</p>
                                                        ))}

                                                        {/* Color + quantity controls */}
                                                        {item.colors.map((c, idx) => (
                                                            <div key={idx} className="flex items-center justify-between gap-2 mt-1">
                                                                <span className="text-xs text-gray-500">{c.color}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <button onClick={() => updateColorQuantity(item.productId, c.color, -1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
                                                                    <span className="px-2 text-sm">{c.quantity}</span>
                                                                    <button onClick={() => updateColorQuantity(item.productId, c.color, 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">+</button>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-700">{item.currency} {(c.pricePerItem * c.quantity).toFixed(2)}</span>
                                                                <button
                                                                    onClick={() => removeColorFromCart(item.productId, c.color)}
                                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                                >
                                                                    ✕
                                                                </button>

                                                            </div>
                                                        ))}

                                                        {/* Offers */}
                                                        {fullProduct && (
                                                            <div className="mt-1 text-xs text-green-700 space-y-1">
                                                                {Array.isArray(fullProduct.offers) &&
                                                                    fullProduct.offers
                                                                        .filter((offer) => {
                                                                            if (offer.discountType === "rangeBuyXGetY") {
                                                                                const { start, end } = offer.discountValue || {};
                                                                                return totalQuantity >= start && totalQuantity <= end;
                                                                            }
                                                                            if (offer.discountType === "bulk") {
                                                                                return totalQuantity >= fullProduct.minQuantity;
                                                                            }
                                                                            return offer.applied;
                                                                        })
                                                                        .map((offer, idx) => {
                                                                            const rangeMsg =
                                                                                offer.discountType === "rangeBuyXGetY"
                                                                                    ? `Pay ${totalQuantity - (offer.discountValue?.free || 0)}, get ${offer.discountValue?.free} free ✅`
                                                                                    : offer.description;
                                                                            return (
                                                                                <div key={idx} className="flex justify-between items-center">
                                                                                    <span className="font-medium">{rangeMsg}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                            </div>
                                                        )}

                                                        {/* Total Price */}
                                                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap self-end mt-2">
                                                            {item.currency} {item.colors.reduce((sum, c) => sum + c.pricePerItem * c.quantity, 0).toFixed(2)}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )}
                                    </div>

                                    {/* Checkout Button */}
                                    {userCartCount > 0 && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    router.push(`/checkout`);
                                                }}
                                                className="w-full bg-gray-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 
                                        {userCartCount > 0 ? (
                                            userCart.map((item, index) => {
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="relative flex items-center gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                                                    >
                                               
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemId(item.id); // delete karne wala item
                                                                setIsConfirmOpen(true);      // modal open
                                                            }}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>

                                                        <div className="flex items-center gap-3 cursor-pointer">
                                                            <Link href={`/product/${item.productId}`} className="flex items-center gap-3" onClick={() => setIsOpen(false)} >
                                                                <img
                                                                    src={item.image || "/placeholder.png"}
                                                                    alt={item.productName}
                                                                    className="w-16 h-16 object-cover rounded-md border"
                                                                />
                                                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                                    {item.productName}
                                                                </h3>
                                                            </Link>
                                                        </div>

                                                  
                                                        <div className="flex-1 flex flex-col gap-1 ml-2">
                                                            <p className="text-xs text-gray-500">
                                                                {Object.entries(item.attributes || {})
                                                                    .map(([key, val]) => `${key}: ${val}`)
                                                                    .join(", ")}
                                                            </p>

                                                        
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <button
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                    onClick={() => updateQuantity(index, -1)}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-2 text-sm">{item.quantity}</span>
                                                                <button
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                    onClick={() => updateQuantity(index, 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <p className="text-sm font-medium text-gray-700 mt-1">
                                                                {item.currency} {(item.pricePerItem * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>

                                                  <ProductOffers product={fullProduct} quantity={item.quantity} /> 

                                                  
                                                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap self-center ml-auto">
                                                            {item.currency} {(item.pricePerItem * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>


                                                )
                                            })

                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )} */}


                        {/* <button onClick={() => setLoginModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition text-white font-functionPro">
                            <User className="h-6 w-6" />
                            <span className="hidden md:inline font-medium">Login</span>
                        </button> */}

                        <div className="relative">
                            {!user ? (
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition text-white font-functionPro"
                                >
                                    <User className="h-6 w-6" />
                                    <span className="hidden md:inline font-medium">Login</span>
                                </button>
                            ) : (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    {/* <div className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition text-white font-functionPro">
                                        <span className="font-medium">Welcome,</span>
                                        <div className="h-12 w-12 rounded-full bg-gray-500 flex items-center justify-center text-black font-bold">
                                            {getInitials(user.name)}
                                        </div>
                                    </div> */}
                                    <div className="flex items-center gap-3 cursor-pointer group">

                                        <div className="text-white text-sm sm:text-base md:text-lg font-medium">
                                            Welcome,
                                        </div>


                                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white bg-gray-500 flex items-center justify-center">
                                            {user.profileImage ? (
                                                <Image
                                                    src={user.profileImage}
                                                    alt={user.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-black font-bold text-lg">
                                                    {getInitials(user.name)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {dropdownOpen && (
                                        <div
                                            className="absolute z-50 bg-white shadow-lg rounded-md font-functionPro cursor-pointer"
                                            style={{
                                                top: "calc(100% - 6px)",
                                                right: 0,
                                                maxWidth: "90vw",
                                            }}
                                        >
                                            <Link
                                                href={
                                                    user.role === "USER"
                                                        ? "/dashboard"
                                                        : "/admin/dashboard"
                                                }
                                            >
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </button>
                                            </Link>

                                            <button
                                                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-red-500 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}

                                </div>

                            )}
                        </div>

                        {/* Hamburger for mobile */}
                        <button
                            className="md:hidden cursor-pointer text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div >

                {/* Mobile Menu */}
                {
                    mobileMenuOpen && (
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
                    )
                }
            </header >

            <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
                <Login onClose={() => setLoginModalOpen(false)} />
            </Modal>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Delete"
                message="Are you sure you want to remove this item from your cart?"
                onConfirm={handleDelete}
            />
        </>

    );
};

export default Header;
