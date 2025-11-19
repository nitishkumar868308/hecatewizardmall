"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchShippingPricing,
    createShippingPricing,
    updateShippingPricing,
    deleteShippingPricing,
} from "@/app/redux/slices/shippingPricing/shippingPricingSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "@/components/Include/Loader";

const ShippingPricing = () => {
    const dispatch = useDispatch();
    const { shippingPricings } = useSelector((state) => state.shippingPricing);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [currentPricing, setCurrentPricing] = useState({
        name: "",
        price: "",
        description: "",
        country: "",
        code: "",
        currency: "",
        currencySymbol: "",
        type: "Air",
    });

    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=cca3,name,currencies"
                );
                const data = await res.json();
                if (!Array.isArray(data)) return;

                const formatted = data.map((c) => {
                    const currencyKey = c.currencies ? Object.keys(c.currencies)[0] : null;
                    const currencySymbol =
                        c.currencies && currencyKey && c.currencies[currencyKey]?.symbol
                            ? c.currencies[currencyKey].symbol
                            : "";

                    return {
                        code: c.cca3,
                        name: c.name?.common || "",
                        currency: currencyKey || "",
                        currencySymbol,
                    };
                });

                setCountries(formatted);
                setFilteredCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
            }
        };
        fetchCountries();
    }, []);

    // Fetch Shipping Pricings
    useEffect(() => {
        dispatch(fetchShippingPricing());
    }, [dispatch]);

    // Filter Shipping Pricing List
    const filtered = shippingPricings.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Add Shipping Pricing
    const handleAdd = async () => {
        if (!currentPricing.name.trim()) return toast.error("Name cannot be empty");
        if (!currentPricing.price) return toast.error("Price is required");
        if (!currentPricing.country) return toast.error("Country is required");
        if (!currentPricing.type) return toast.error("Type is required");

        setLoading(true);

        try {
            await dispatch(
                createShippingPricing({
                    name: currentPricing.name.trim(),
                    price: Number(currentPricing.price),
                    description: currentPricing.description,
                    country: currentPricing.country,
                    code: currentPricing.code,
                    currency: currentPricing.currency,
                    currencySymbol: currentPricing.currencySymbol,
                    type: currentPricing.type,
                    active: true,
                })
            ).unwrap();

            toast.success("Shipping pricing added");
            setModalOpen(false);
            setCurrentPricing({
                name: "",
                price: "",
                description: "",
                country: "",
                code: "",
                currency: "",
                currencySymbol: "",
                type: "Air",
            });
        } catch (err) {
            toast.error(err.message || "Failed to add");
        }

        setLoading(false);
    };

    // Edit Shipping Pricing
    const handleEdit = async () => {
        if (!currentPricing.name.trim()) return toast.error("Name cannot be empty");
        if (!currentPricing.price) return toast.error("Price is required");
        if (!currentPricing.country) return toast.error("Country is required");
        if (!currentPricing.type) return toast.error("Type is required");

        setLoading(true);

        try {
            await dispatch(
                updateShippingPricing({
                    id: currentPricing.id,
                    name: currentPricing.name,
                    price: Number(currentPricing.price),
                    description: currentPricing.description,
                    country: currentPricing.country,
                    code: currentPricing.code,
                    currency: currentPricing.currency,
                    currencySymbol: currentPricing.currencySymbol,
                    type: currentPricing.type,
                })
            ).unwrap();

            toast.success("Updated successfully");
            setEditModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update");
        }

        setLoading(false);
    };

    // Toggle Status
    const toggleActive = async (id, current) => {
        setLoading(true);
        try {
            await dispatch(updateShippingPricing({ id, active: !current })).unwrap();
            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed");
        }
        setLoading(false);
    };

    // Delete
    const handleDelete = async () => {
        setLoading(true);
        try {
            await dispatch(deleteShippingPricing(deleteId)).unwrap();
            toast.success("Deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Delete failed");
        }
        setLoading(false);
    };

    return (
        <DefaultPageAdmin>
            {loading && <Loader />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Shipping Pricing</h1>

                <div className="flex gap-2 flex-wrap items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64"
                    />
                    <button
                        onClick={() => {
                            setModalOpen(true);
                            setCurrentPricing({
                                name: "",
                                price: "",
                                description: "",
                                country: "",
                                code: "",
                                currency: "",
                                currencySymbol: "",
                                type: "Air",
                            });
                        }}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                S.No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Country
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((p, idx) => (
                            <tr key={p.id} className="hover:bg-gray-50 border-b">
                                <td className="px-4 py-4">{idx + 1}</td>
                                <td className="px-4 py-4 font-medium text-gray-700">{p.name}</td>
                                <td className="px-4 py-4 font-medium text-gray-700">{p.country}</td>
                                <td className="px-4 py-4 font-medium text-gray-700">{p.type}</td>
                                <td className="px-4 py-4 font-medium text-gray-700">₹{p.price}</td>
                                <td className="px-4 py-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={p.active}
                                            onChange={() => toggleActive(p.id, p.active)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-12 h-6 flex items-center p-1 rounded-full duration-300 ${
                                                p.active ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                        >
                                            <span
                                                className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${
                                                    p.active ? "translate-x-6" : "translate-x-0"
                                                }`}
                                            />
                                        </span>
                                    </label>
                                </td>
                                <td className="px-4 py-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setCurrentPricing({ ...p });
                                            setEditModalOpen(true);
                                        }}
                                        className="text-blue-500 hover:text-blue-800 cursor-pointer"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(p.id);
                                            setDeleteModalOpen(true);
                                        }}
                                        className="text-red-500 hover:text-red-800 cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-400 italic">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {(modalOpen || editModalOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => {
                                modalOpen ? setModalOpen(false) : setEditModalOpen(false);
                            }}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">
                            {modalOpen ? "Add Shipping Pricing" : "Edit Shipping Pricing"}
                        </h2>

                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Name"
                            value={currentPricing.name}
                            onChange={(e) =>
                                setCurrentPricing({ ...currentPricing, name: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded mb-3"
                        />

                        {/* Country */}
                        <div className="flex flex-col relative mb-3">
                            <input
                                type="text"
                                placeholder="Search Country"
                                value={currentPricing.country}
                                onChange={(e) => {
                                    const searchValue = e.target.value.toLowerCase();
                                    setFilteredCountries(
                                        countries.filter(
                                            (c) =>
                                                c.name.toLowerCase().includes(searchValue) ||
                                                c.code.toLowerCase().includes(searchValue)
                                        )
                                    );
                                    setShowDropdown(true);
                                    setCurrentPricing({
                                        ...currentPricing,
                                        country: e.target.value,
                                    });
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="border px-4 py-2 w-full rounded"
                            />
                            {showDropdown && filteredCountries.length > 0 && (
                                <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow max-h-44 overflow-auto">
                                    {filteredCountries.map((c) => (
                                        <li
                                            key={c.code}
                                            className="px-4 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setCurrentPricing({
                                                    ...currentPricing,
                                                    country: c.name,
                                                    code: c.code,
                                                    currency: c.currency,
                                                    currencySymbol: c.currencySymbol,
                                                });
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {c.name} <span className="text-gray-500">({c.code})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Type */}
                        <select
                            value={currentPricing.type}
                            onChange={(e) =>
                                setCurrentPricing({ ...currentPricing, type: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded mb-4"
                        >
                            <option value="Air">Air</option>
                            <option value="Road">Road</option>                            
                        </select>

                        {/* Price */}
                        <input
                            type="number"
                            placeholder="Price"
                            value={currentPricing.price}
                            onChange={(e) =>
                                setCurrentPricing({ ...currentPricing, price: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded mb-4"
                        />

                        {/* Description */}
                        <textarea
                            placeholder="Description"
                            value={currentPricing.description}
                            onChange={(e) =>
                                setCurrentPricing({ ...currentPricing, description: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded mb-4 h-24 resize-none"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() =>
                                    modalOpen ? setModalOpen(false) : setEditModalOpen(false)
                                }
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={modalOpen ? handleAdd : handleEdit}
                                className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
                            >
                                {modalOpen ? "Add" : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center relative">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold mb-3">Confirm Delete</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete?</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default ShippingPricing;
