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
import toast from 'react-hot-toast';
import Loader from "@/components/Include/Loader";

const ShippingPricing = () => {
    const dispatch = useDispatch();
    const { shippingPricings } = useSelector((state) => state.shippingPricing);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [newPrice, setNewPrice] = useState("");
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [editPricing, setEditPricing] = useState({ id: null, name: "", price: "", description: "" });
    const [deleteId, setDeleteId] = useState(null);

    const [loading, setLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        dispatch(fetchShippingPricing());
    }, [dispatch]);

    // Filter list
    const filtered = shippingPricings.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Add new shipping pricing
    const handleAdd = async () => {
        if (!newName.trim()) return toast.error("Name cannot be empty");
        if (!newPrice) return toast.error("Price is required");

        setLoading(true);

        try {
            await dispatch(
                createShippingPricing({
                    name: newName.trim(),
                    price: Number(newPrice),
                    description: newDescription,
                    active: true
                })
            ).unwrap();

            toast.success("Shipping pricing added");
            setModalOpen(false);
            setNewName("");
            setNewPrice("");
            setNewDescription("");
        } catch (err) {
            toast.error(err.message || "Failed to add");
        }
        setLoading(false);
    };

    // Edit shipping pricing
    const handleEdit = async () => {
        if (!editPricing.name.trim()) return toast.error("Name cannot be empty");
        if (!editPricing.price) return toast.error("Price is required");

        setLoading(true);

        try {
            await dispatch(
                updateShippingPricing({
                    id: editPricing.id,
                    name: editPricing.name,
                    price: Number(editPricing.price),
                    description: editPricing.description
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
            await dispatch(
                updateShippingPricing({ id, active: !current })
            ).unwrap();
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
                        onClick={() => setModalOpen(true)}
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
                                <td className="px-4 py-4 font-medium text-gray-700">
                                    {p.name}
                                </td>
                                <td className="px-4 py-4 font-medium text-gray-700">
                                    ₹{p.price}
                                </td>

                                <td className="px-4 py-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={p.active}
                                            onChange={() => toggleActive(p.id, p.active)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-12 h-6 flex items-center p-1 rounded-full duration-300 ${p.active ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${p.active ? "translate-x-6" : "translate-x-0"
                                                    }`}
                                            />
                                        </span>
                                    </label>
                                </td>

                                <td className="px-4 py-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setEditPricing({
                                                id: p.id,
                                                name: p.name,
                                                price: p.price,
                                                description: p.description || ""
                                            });
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
                                <td
                                    colSpan="5"
                                    className="text-center py-6 text-gray-400 italic"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Add Shipping Pricing</h2>

                        <input
                            type="text"
                            placeholder="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border px-4 py-2 w-full rounded mb-3"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border px-4 py-2 w-full rounded mb-4"
                        />

                        <textarea
                            placeholder="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="border px-4 py-2 w-full rounded mb-4 h-24 resize-none"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Edit Shipping Pricing</h2>

                        <input
                            type="text"
                            placeholder="Name"
                            value={editPricing.name}
                            onChange={(e) => setEditPricing({ ...editPricing, name: e.target.value })}
                            className="border px-4 py-2 w-full rounded mb-3"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={editPricing.price}
                            onChange={(e) => setEditPricing({ ...editPricing, price: e.target.value })}
                            className="border px-4 py-2 w-full rounded mb-4"
                        />

                        <textarea
                            placeholder="Description"
                            value={editPricing.description}
                            onChange={(e) =>
                                setEditPricing({ ...editPricing, description: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded mb-4 h-24"
                        ></textarea>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-gray-700 text-white rounded"
                            >
                                Update
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
