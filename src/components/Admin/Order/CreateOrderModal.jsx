"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, Plus, Minus, MapPin } from "lucide-react";
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { fetchAddresses } from "@/app/redux/slices/address/addressSlice";

const CreateOrderModal = ({ onClose }) => {
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    const { list: users } = useSelector((state) => state.getAllUser);
    const { addresses } = useSelector((state) => state.address);

    const [userSearch, setUserSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [showShippingModal, setShowShippingModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllProducts());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(fetchAddresses(selectedUser.id));
        }
    }, [selectedUser, dispatch]);

    const addToCart = (product, variation = null) => {
        const key = variation ? `${product.id}-${variation.id}` : product.id;
        if (cart.find((i) => i.key === key)) return;

        setCart([
            ...cart,
            {
                key,
                name: product.name,
                image: variation?.image || product.image?.[0],
                variationName: variation?.variationName || "Default",
                price: Number(variation?.price || product.price),
                qty: 1,
            },
        ]);
    };

    const total = useMemo(
        () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        [cart]
    );

    const userAddresses = addresses?.filter(addr => addr.userId === selectedUser?.id) || [];
    const billingAddress = userAddresses.find(a => a.type === "BILLING");
    const shippingAddresses = userAddresses.filter(a => a.type === "SHIPPING");

    return (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
            <div className="relative w-full min-h-screen flex justify-center items-start pt-10 px-4">
                <div className="relative w-full  bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row h-[90vh] overflow-hidden">

                    {/* LEFT PANEL: Users */}
                    <aside className="lg:w-1/4 bg-gray-50 p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Customers</h3>
                        </div>
                        <input
                            type="text"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            placeholder="Search by name/email"
                            className="w-full mb-4 px-4 py-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-black text-sm"
                        />
                        <div className="space-y-2">
                            {users
                                ?.filter(
                                    u =>
                                        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                                        u.email?.toLowerCase().includes(userSearch.toLowerCase())
                                )
                                .map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => setSelectedUser(u)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition 
                      ${selectedUser?.id === u.id ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                                            {u.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{u.name}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </aside>

                    {/* MIDDLE PANEL: Products */}
                    <main className="lg:w-2/4 p-6 overflow-y-auto">
                        {/* Search Bar */}
                        <div className="flex gap-3 mb-6">
                            <Search className="w-5 h-5 mt-3 text-gray-400" />
                            <input
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Search product"
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {/* Products List */}
                        <div className="space-y-6">
                            {products
                                ?.filter((p) => p.name?.toLowerCase().includes(productSearch.toLowerCase()))
                                .map((p) => {
                                    const mainSelected = cart.find((i) => i.key === p.id);

                                    return (
                                        <div key={p.id} className="border rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden">

                                            {/* Main Product */}
                                            <div className="flex items-center justify-between p-4 border-b">
                                                <div className="flex items-center gap-4">
                                                    <img src={p.image?.[0]} className="h-24 w-24 object-cover rounded-lg" />
                                                    <div>
                                                        <p className="text-sm font-semibold">{p.name}</p>
                                                        <p className="text-xs text-gray-500">Main Product - ₹{p.price}</p>
                                                    </div>
                                                </div>

                                                {/* Quantity & Add Button */}
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2 border rounded px-2 py-1">
                                                        <button
                                                            onClick={() =>
                                                                setCart((c) =>
                                                                    c.map((i) =>
                                                                        i.key === p.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="text-sm font-medium">{mainSelected?.qty || 1}</span>
                                                        <button
                                                            onClick={() =>
                                                                mainSelected
                                                                    ? setCart((c) =>
                                                                        c.map((i) =>
                                                                            i.key === p.id ? { ...i, qty: i.qty + 1 } : i
                                                                        )
                                                                    )
                                                                    : addToCart(p)
                                                            }
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(p)}
                                                        className="text-xs bg-black text-white rounded-xl px-3 py-1 hover:bg-gray-800 transition"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Variations */}
                                            {p.variations?.length > 0 && (
                                                <div className="p-4 space-y-3">
                                                    {p.variations.map((v) => {
                                                        const selected = cart.find((i) => i.key === `${p.id}-${v.id}`);
                                                        return (
                                                            <div
                                                                key={v.id}
                                                                className="flex items-center justify-between gap-4 border rounded-xl p-3 hover:shadow-sm transition"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <img src={v.image || p.image?.[0]} className="h-20 w-20 object-cover rounded-lg" />
                                                                    <div>
                                                                        <p className="text-sm font-medium">{v.variationName}</p>
                                                                        <p className="text-xs text-gray-500">Variation - ₹{v.price}</p>
                                                                    </div>
                                                                </div>

                                                                {/* Quantity & Add */}
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <div className="flex items-center gap-2 border rounded px-2 py-1">
                                                                        <button
                                                                            onClick={() =>
                                                                                setCart((c) =>
                                                                                    c.map((i) =>
                                                                                        i.key === `${p.id}-${v.id}`
                                                                                            ? { ...i, qty: Math.max(1, i.qty - 1) }
                                                                                            : i
                                                                                    )
                                                                                )
                                                                            }
                                                                        >
                                                                            <Minus size={16} />
                                                                        </button>
                                                                        <span className="text-sm font-medium">{selected?.qty || 1}</span>
                                                                        <button
                                                                            onClick={() =>
                                                                                selected
                                                                                    ? setCart((c) =>
                                                                                        c.map((i) =>
                                                                                            i.key === `${p.id}-${v.id}`
                                                                                                ? { ...i, qty: i.qty + 1 }
                                                                                                : i
                                                                                        )
                                                                                    )
                                                                                    : addToCart(p, v)
                                                                            }
                                                                        >
                                                                            <Plus size={16} />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => addToCart(p, v)}
                                                                        className="text-xs bg-black text-white rounded-xl px-3 py-1 hover:bg-gray-800 transition"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </main>




                    {/* RIGHT PANEL: Order Summary */}
                    <aside className="lg:w-1/4 bg-gray-50 p-6 overflow-y-auto flex flex-col">
                        <h3 className="font-semibold text-lg mb-3">Order Summary</h3>

                        {/* Billing Address */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2">Billing Address</h4>
                            {billingAddress ? (
                                <div className="p-3 border rounded-xl bg-white text-sm text-gray-700">
                                    <p>{billingAddress.name}</p>
                                    <p>{billingAddress.address}</p>
                                    <p>{billingAddress.city}, {billingAddress.state}</p>
                                    <p>{billingAddress.country}</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowBillingModal(true)}
                                    className="w-full py-2 rounded-xl border border-dashed border-gray-400 text-sm hover:bg-gray-100 transition"
                                >
                                    Add Billing Address
                                </button>
                            )}
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                            {shippingAddresses.length > 0 ? (
                                shippingAddresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        className="p-3 border rounded-xl bg-white mb-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                                    >
                                        <p>{addr.name}</p>
                                        <p>{addr.address}</p>
                                        <p>{addr.city}, {addr.state}</p>
                                        <p>{addr.country}</p>
                                    </div>
                                ))
                            ) : (
                                <button
                                    onClick={() => setShowShippingModal(true)}
                                    className="w-full py-2 rounded-xl border border-dashed border-gray-400 text-sm hover:bg-gray-100 transition"
                                >
                                    Add Shipping Address
                                </button>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {cart.length === 0 ? (
                                <p className="text-sm text-gray-500">No items in cart</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.key} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.variationName}</p>
                                        </div>
                                        <p className="text-sm font-semibold">₹{item.price * item.qty}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Total & Create Order */}
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between font-semibold mb-3">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <button className="w-full bg-black text-white py-3 rounded-xl text-sm hover:bg-gray-800 transition">
                                Create Order
                            </button>
                        </div>
                    </aside>

                    {/* Modals for Billing / Shipping (Currently just open placeholder) */}
                    {showBillingModal && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
                                <h3 className="font-semibold text-lg mb-4">Add Billing Address</h3>
                                {/* Form will go here */}
                                <button
                                    className="mt-4 w-full py-2 bg-black text-white rounded-xl"
                                    onClick={() => setShowBillingModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    {showShippingModal && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
                                <h3 className="font-semibold text-lg mb-4">Add Shipping Address</h3>
                                {/* Form will go here */}
                                <button
                                    className="mt-4 w-full py-2 bg-black text-white rounded-xl"
                                    onClick={() => setShowShippingModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;
