"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, Minus } from "lucide-react";
import { AiOutlineClose } from "react-icons/ai";
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { fetchAddresses } from "@/app/redux/slices/address/addressSlice";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { registerUser } from '@/app/redux/slices/authSlice';
import toast from 'react-hot-toast';
import BillingAddress from "./BillingAddress";
import ShippingAddress from "./ShippingAddress";

function generateRandomPassword(length = 8) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

const CreateOrderModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    console.log("user", user)
    const { products } = useSelector((state) => state.products);
    const { list: users } = useSelector((state) => state.getAllUser);
    const { addresses } = useSelector((state) => state.address);
    console.log("users", users)
    console.log("addresses", addresses)
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [billingAddress, setBillingAddress] = useState(null);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [tempShipping, setTempShipping] = useState(null);
    const [selectedShipping, setSelectedShipping] = useState(null);


    const [notes, setNotes] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cart, setCart] = useState([]);

    const [platform, setPlatform] = useState("WIZARD_MALL");

    // PI number auto-generate (frontend temporary)
    const piNumber = useMemo(() => {
        const last = Date.now().toString().slice(-4);
        return `PI-${last}`;
    }, []);

    useEffect(() => {
        dispatch(fetchMe());
        dispatch(fetchAllProducts());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (!selectedUser) {
            setBillingAddress(null);

            return;
        }

        // ✅ BILLING FROM USER PROFILE
        if (
            selectedUser.address &&
            selectedUser.city &&
            selectedUser.state &&
            selectedUser.country
        ) {
            setBillingAddress({
                address: selectedUser.address,
                city: selectedUser.city,
                state: selectedUser.state,
                country: selectedUser.country,
                pincode: selectedUser.pincode,
            });
        } else {
            setBillingAddress(null);
        }

        // ✅ SHIPPING CHECK
        if (addresses && addresses.length > 0) {
            const defaultAddr = addresses.find(a => a.isDefault);
           
        } else {
            
        }

    }, [selectedUser, addresses]);


    const total = useMemo(
        () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        [cart]
    );

    const filteredUsers = useMemo(() => {
        if (!userSearch) return [];
        return users.filter((u) =>
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.phone?.includes(userSearch)
        );
    }, [userSearch, users]);

    const handleAddUser = async (e) => {
        e.preventDefault();

        const resultAction = await dispatch(
            registerUser({
                name,
                email,
                password: generateRandomPassword(),
            })
        );

        if (registerUser.fulfilled.match(resultAction)) {
            toast.success(resultAction.payload?.message || "User added successfully");

            setName("");
            setEmail("");
            setModalOpen(false);
            dispatch(fetchAllUsers());
            // OPTIONAL: newly created user ko select bhi kar sakta hai
            // setSelectedUser(resultAction.payload.user);
        } else {
            toast.error(resultAction.payload?.message || "Registration failed");
        }
    };



    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

            {/* LEFT PANEL — NOTES (same place as chat earlier) */}
            <aside className="w-80 bg-white border-r shadow-xl flex flex-col">
                <div className="border-b px-4 py-3 font-semibold text-lg bg-gray-50">
                    Notes / Info
                </div>

                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add order notes here..."
                    className="flex-1 w-full px-4 py-3 text-sm resize-none outline-none"
                />

                <div className="border-t p-3 bg-gray-50">
                    <button
                        className="w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition"
                    >
                        Add Notes
                    </button>
                </div>
            </aside>

            {/* RIGHT MAIN CONTENT */}
            <div className="flex-1 bg-white overflow-y-auto p-8 relative">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold hover:text-red-500"
                >
                    ×
                </button>

                {/* HEADER */}
                <div className="border-b pb-4 mb-6 grid grid-cols-3 items-center">

                    {/* LEFT — CREATED BY */}
                    <div>
                        <h2 className="text-3xl font-bold">Create Order</h2>

                        {user && (
                            <p className="text-sm text-gray-500 mt-1">
                                Created by: <b>{user.name}</b>
                                <br />
                                <span className="text-xs">{user.email}</span>
                            </p>
                        )}
                    </div>

                    {/* CENTER — PLATFORM SELECT */}
                    <div className="text-center">
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold outline-none cursor-pointer"
                        >
                            <option value="WIZARD_MALL">Hecate Wizard Mall</option>
                            <option value="QUICKGO">Hecate QuickGo</option>
                        </select>
                    </div>

                    {/* RIGHT — PI NUMBER */}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">PI Number</p>
                        <p className="font-semibold text-lg">
                            {piNumber}
                        </p>
                    </div>

                </div>



                {/* CUSTOMER / ADDRESS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-8">

                    {/* CUSTOMER COLUMN */}
                    <div className="relative">

                        {/* 🔍 SEARCH + ADD (CARD KE UPAR) */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    placeholder="Search customer name / email / phone"
                                    className="w-full pl-8 pr-3 py-2 border rounded-lg outline-none text-sm bg-white"
                                />
                            </div>

                            {/* ADD USER */}
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 bg-white"
                            >
                                <Plus size={16} />
                                Add
                            </button>

                        </div>

                        {/* 🔽 SEARCH DROPDOWN */}
                        {showDropdown && userSearch && (
                            <div className="absolute z-30 bg-white border rounded-lg w-full max-h-48 overflow-y-auto shadow-md">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setUserSearch("");
                                                setShowDropdown(false);
                                            }}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            <p className="font-medium">{u.name}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-3 text-center text-gray-500 text-sm">
                                        No user found
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 📦 CUSTOMER CARD */}
                        <div className="p-4 border rounded-xl bg-gray-50 mt-2 flex justify-between items-start">

                            <div>
                                <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>

                                {selectedUser ? (
                                    <>
                                        <p className="font-medium">{selectedUser.name}</p>
                                        <p className="text-gray-600 text-xs">{selectedUser.email}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-400 text-sm">No customer selected</p>
                                )}
                            </div>

                            {/* REMOVE BUTTON */}
                            {selectedUser && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="text-red-500 hover:text-red-600 text-xs font-medium"
                                >
                                    Remove
                                </button>
                            )}

                        </div>


                    </div>

                    {/* BILLING */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Billing Address</h3>

                        {!selectedUser ? (
                            <p className="text-gray-400 text-sm">Select a customer to see billing info</p>
                        ) : billingAddress ? (
                            <div className="text-sm text-gray-700">
                                <p>{billingAddress.address}</p>
                                <p>
                                    {billingAddress.city}, {billingAddress.state}
                                </p>
                                <p>
                                    {billingAddress.country} - {billingAddress.pincode}
                                </p>
                            </div>
                        ) : (
                            <button
                                className="text-xs text-blue-600 font-medium"
                                onClick={() => setBillingModalOpen(true)}
                            >
                                + Add Billing Address
                            </button>
                        )}
                    </div>



                    {/* SHIPPING */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Shipping Address</h3>

                        {!selectedUser ? (
                            <p className="text-gray-400 text-sm">Select a customer to see shipping info</p>
                        ) : billingAddress ? (
                            <div className="text-sm text-gray-700">
                                <p>{billingAddress.address}</p>
                                <p>
                                    {billingAddress.city}, {billingAddress.state}
                                </p>
                                <p>
                                    {billingAddress.country} - {billingAddress.pincode}
                                </p>
                            </div>
                        ) : (
                            <button
                                className="text-xs text-blue-600 font-medium"
                                onClick={() => setShippingModalOpen(true)}
                            >
                                + Select Shipping Address
                            </button>
                        )}
                    </div>
                </div>

                {/* PRODUCTS TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                        <thead className="bg-gray-900 ">
                            <tr className="uppercase text-xs text-gray-100">
                                <th className="p-2 text-center">#</th>
                                <th className="p-2 text-center">Product</th>
                                <th className="p-2 text-center">Variation</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-center">Rate</th>
                                <th className="p-2 text-center">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-gray-400">
                                        No items added
                                    </td>
                                </tr>
                            )}

                            {cart.map((item, idx) => (
                                <tr key={item.key} className="border-b hover:bg-gray-50">
                                    <td className="p-2 text-center">{idx + 1}</td>
                                    <td className="p-2 text-center font-medium">
                                        {item.name}
                                    </td>
                                    <td className="p-2 text-center text-xs text-gray-500">
                                        {item.variationName}
                                    </td>
                                    <td className="p-2 text-center">{item.qty}</td>
                                    <td className="p-2 text-center">₹{item.price}</td>
                                    <td className="p-2 text-center font-semibold">
                                        ₹{item.price * item.qty}
                                    </td>
                                </tr>
                            ))}

                            {/* TOTAL */}
                            <tr className="bg-gray-200 font-semibold">
                                <td className="p-3 text-left">Total</td>
                                <td colSpan={3}></td>
                                <td></td>
                                <td className="p-3 text-center">₹{total}</td>
                            </tr>

                            {/* SHIPPING */}
                            <tr className="bg-gray-100 font-medium">
                                <td colSpan={5} className="p-3 text-left">
                                    Shipping Charges
                                </td>
                                <td className="p-3 text-center">₹0</td>
                            </tr>

                            {/* GRAND TOTAL */}
                            <tr className="bg-gray-300 font-bold">
                                <td colSpan={5} className="p-3 text-left text-lg">
                                    Grand Total
                                </td>
                                <td className="p-3 text-center text-lg">
                                    ₹{total}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">

                    <div className="bg-white rounded-xl w-11/12 max-w-md p-6 relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <AiOutlineClose size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add User</h2>

                        <form onSubmit={handleAddUser} className="flex flex-col gap-4">

                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                            >
                                Add User
                            </button>

                        </form>
                    </div>
                </div>
            )}

            {billingModalOpen && (
                <BillingAddress
                    userId={selectedUser?.id}
                    user={selectedUser}
                    open={billingModalOpen}
                    setOpen={setBillingModalOpen}
                    onUpdateAddress={(updated) => setBillingAddress(updated)}
                />
            )}


            {shippingModalOpen && (
                <ShippingAddress
                    userId={selectedUser?.id}
                    user={selectedUser}
                    open={shippingModalOpen}           // modal open/close control
                    setOpen={setShippingModalOpen}     // close ke liye
                    addresses={addresses}              // user ke addresses
                    billingAddress={billingAddress}    // billing address include karna
                    onUpdateAddress={(updated) => setSelectedShipping(updated)}
                />
            )}


        </div>
    );
};

export default CreateOrderModal;
