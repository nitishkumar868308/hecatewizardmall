"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const BannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [editIndex, setEditIndex] = useState(null);

    const [platform, setPlatform] = useState({
        xpress: false,
        website: false,
    });

    const [form, setForm] = useState({
        image: null,
        country: "",
        state: "",
        text: "",
        active: true,
    });

    const openAddModal = () => {
        setModalType("add");
        setEditIndex(null);
        setPlatform({ xpress: false, website: false });
        setForm({ image: null, country: "", state: "", text: "", active: true });
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        const banner = banners[index];
        setModalType("edit");
        setEditIndex(index);
        setPlatform(banner.platform);
        setForm(banner);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!form.image || !form.country || !form.state) {
            toast.error("Please fill all required fields");
            return;
        }

        const newBanner = { ...form, platform };

        if (modalType === "add") {
            setBanners([...banners, newBanner]);
            toast.success("Banner added successfully");
        } else {
            const updated = [...banners];
            updated[editIndex] = newBanner;
            setBanners(updated);
            toast.success("Banner updated successfully");
        }

        setIsModalOpen(false);
    };

    const handleDelete = (index) => {
        const updated = banners.filter((_, i) => i !== index);
        setBanners(updated);
        toast.success("Banner deleted successfully");
    };

    return (
        <DefaultPageAdmin>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Add Banner
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs">Image</th>
                            <th className="px-4 py-3 text-left text-xs">Platform</th>
                            <th className="px-4 py-3 text-left text-xs">Country</th>
                            <th className="px-4 py-3 text-left text-xs">State</th>
                            <th className="px-4 py-3 text-left text-xs">Status</th>
                            <th className="px-4 py-3 text-left text-xs">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {banners.map((b, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <img
                                        src={URL.createObjectURL(b.image)}
                                        className="w-20 h-12 object-cover rounded border"
                                        alt="banner"
                                    />
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {b.platform.xpress && "QuickGo "}
                                    {b.platform.website && "Wizard Mall"}
                                </td>

                                <td className="px-4 py-3">{b.country}</td>
                                <td className="px-4 py-3">{b.state}</td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${b.active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {b.active ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-3">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => openEditModal(idx)}
                                            className="flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(idx)}
                                            className="flex items-center gap-1 text-red-600 hover:underline"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {banners.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">
                                    No banners found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            {modalType === "add" ? "Add Banner" : "Edit Banner"}
                        </Dialog.Title>

                        {/* PLATFORM */}
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                                Select Platform
                            </p>

                            <div className="flex justify-center gap-10">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={platform.xpress}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, xpress: e.target.checked })
                                        }
                                    />
                                    Hecate QuickGo
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={platform.website}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, website: e.target.checked })
                                        }
                                    />
                                    Hecate Wizard Mall
                                </label>
                            </div>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Banner Image
                            </label>

                            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-36 cursor-pointer hover:border-blue-400 transition">
                                {form.image ? (
                                    <img
                                        src={URL.createObjectURL(form.image)}
                                        className="h-full object-contain rounded"
                                        alt="preview"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Click to upload banner image</p>
                                        <p className="text-xs">(PNG, JPG, WEBP)</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setForm({ ...form, image: e.target.files[0] })
                                    }
                                />
                            </label>
                        </div>

                        {/* COUNTRY */}
                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">Country</label>
                            <input
                                className="border rounded px-3 py-2 w-full"
                                placeholder="Select Country"
                                value={form.country}
                                onChange={(e) =>
                                    setForm({ ...form, country: e.target.value })
                                }
                            />
                        </div>

                        {/* STATE */}
                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">State</label>
                            <input
                                className="border rounded px-3 py-2 w-full"
                                placeholder="Select State"
                                value={form.state}
                                onChange={(e) =>
                                    setForm({ ...form, state: e.target.value })
                                }
                            />
                        </div>

                        {/* TEXT */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">
                                Banner Text
                            </label>
                            <textarea
                                className="border rounded px-3 py-2 w-full"
                                rows={3}
                                placeholder="Enter banner text"
                                value={form.text}
                                onChange={(e) =>
                                    setForm({ ...form, text: e.target.value })
                                }
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="border px-4 py-2 rounded cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </DefaultPageAdmin>
    );
};

export default BannerPage;
