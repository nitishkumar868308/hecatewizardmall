"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Clock } from 'lucide-react';
import DefaultPageAdmin from '@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin';
import DurationModal from '@/components/BookConsultant/DurationModal';
import { useDispatch, useSelector } from "react-redux";
import { fetchDurations, deleteDuration, updateDuration } from "@/app/redux/slices/book_consultant/duration/durationSlice";
import { Edit, Trash } from "lucide-react";
import ConfirmDeleteModal from "@/components/BookConsultant/ConfirmDeleteModal";
import Loader from '@/components/Include/Loader';
import toast from "react-hot-toast";

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDuration, setEditingDuration] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [durationToDelete, setDurationToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const dispatch = useDispatch();
    const { durations, loading } = useSelector((state) => state.duration);

    useEffect(() => {
        dispatch(fetchDurations());
    }, [dispatch]);

    const handleEdit = (item) => {
        setEditingDuration(item);
        setIsModalOpen(true);
    };

    // handle delete icon click
    const handleDeleteClick = (item) => {
        setDurationToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!durationToDelete) return;

        setDeleteLoading(true);
        try {
            await dispatch(deleteDuration(durationToDelete.id)).unwrap();
            toast.success("Duration deleted successfully");
            setDeleteModalOpen(false);
            setDurationToDelete(null);
        } catch (err) {
            toast.error(err?.message || "Failed to delete duration");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            const updated = await dispatch(
                updateDuration({ id: item.id, active: !item.active })
            ).unwrap();

            toast.success(`Duration ${updated.minutes} min is now ${updated.active ? "Active" : "Inactive"}`);
        } catch (err) {
            toast.error(err?.message || "Failed to update status");
        }
    };


    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-6 space-y-6">

                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Duration Settings</h1>
                    </div>

                    {/* Add Duration Button */}
                    <button
                        onClick={() => {
                            setEditingDuration(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 cursor-pointer bg-gray-600 text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-blue-100 font-medium"
                    >
                        <Plus size={20} />
                        Add Duration
                    </button>

                </div>

                {/* Search & Filter Bar */}
                {/* <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search duration..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div> */}

                {/* Modern Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold">#</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Minutes</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Description</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Created</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">
                                            <Loader size="lg" />
                                        </td>
                                    </tr>
                                ) : durations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6 text-gray-500">
                                            No durations found
                                        </td>
                                    </tr>
                                ) : (
                                    durations.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            {/* Serial No */}
                                            <td className="px-6 py-4 font-medium">
                                                {index + 1}.
                                            </td>

                                            {/* Minutes */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <Clock size={18} />
                                                    </div>
                                                    <span>{item.minutes} Min</span>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.description?.trim() || "No description"}
                                            </td>

                                            {/* Created Date */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium">
                                                {item.active ? (
                                                    <span className="text-green-600 font-semibold">Active</span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">Inactive</span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">

                                                {/* Toggle Active Switch */}
                                                <div
                                                    onClick={() => handleToggleActive(item)}
                                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.active ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${item.active ? "translate-x-7" : "translate-x-0"
                                                            }`}
                                                    />
                                                </div>


                                                {/* Edit */}
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Modal Component */}
                <DurationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingDuration(null);
                    }}
                    durationToEdit={editingDuration}
                />

                <ConfirmDeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setDurationToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    loading={deleteLoading}
                />


            </div>
        </DefaultPageAdmin>
    );
};

export default Page;