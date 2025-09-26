"use client";
import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useSelector, useDispatch } from "react-redux";
import { fetchMarketLinks, deleteMarketLink } from "@/app/redux/slices/externalMarket/externalMarketSlice";
import AddEditMarketLinkModal from "@/components/Custom/AddEditMarketLinkModal";
import { Plus, Trash2, Edit, X } from "lucide-react";
import toast from "react-hot-toast";

const ExternalMarket = () => {
    const dispatch = useDispatch();
    const { links } = useSelector((state) => state.marketLinks);
    console.log("links", links)
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => { dispatch(fetchMarketLinks()); }, [dispatch]);

    const filteredLinks = links.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = async () => {
        try {
            await dispatch(deleteMarketLink(deleteId)).unwrap();
            toast.success("Deleted successfully");
            setDeleteModalOpen(false);
        } catch {
            toast.error("Failed to delete");
        }
    };

    return (
        <DefaultPageAdmin>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">External Market Links</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search Product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => { setEditData(null); setModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Link
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">S.No</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Country</th>
                            <th className="px-4 py-2 text-left">Code</th>
                            <th className="px-4 py-2 text-left">URL</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLinks.map((l, idx) => (
                            <tr key={l.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{l.name}</td>
                                <td className="px-4 py-2">{l.countryName}</td>
                                <td className="px-4 py-2">{l.countryCode}</td>

                                <td className="px-4 py-2"><a href={l.url} target="_blank">{l.url}</a></td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button onClick={() => { setEditData(l); setModalOpen(true); }} className="text-blue-500"><Edit /></button>
                                    <button onClick={() => { setDeleteId(l.id); setDeleteModalOpen(true); }} className="text-red-500"><Trash2 /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredLinks.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No links found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <AddEditMarketLinkModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editData={editData}
            />

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button onClick={() => setDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this link?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default ExternalMarket;
