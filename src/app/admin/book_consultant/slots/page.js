"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash, Search, Filter } from 'lucide-react';
import DefaultPageAdmin from '@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin';
import ServiceModal from '@/components/BookConsultant/ServiceModal';
import ConfirmDeleteModal from "@/components/BookConsultant/ConfirmDeleteModal";
import Loader from '@/components/Include/Loader';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Redux slices
import { fetchServices, deleteService, updateService } from "@/app/redux/slices/book_consultant/services/serviceSlice";
import { fetchDurations } from "@/app/redux/slices/book_consultant/duration/durationSlice";

const ServicePage = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [search, setSearch] = useState("");

    const { services, loading } = useSelector((state) => state.services);
    const { durations } = useSelector((state) => state.duration);

    useEffect(() => {
        dispatch(fetchServices());
        dispatch(fetchDurations());
    }, [dispatch]);

    const handleEdit = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;
        setDeleteLoading(true);
        try {
            await dispatch(deleteService(serviceToDelete.id)).unwrap();
            toast.success("Service deleted successfully");
            setDeleteModalOpen(false);
            setServiceToDelete(null);
        } catch (err) {
            toast.error(err?.message || "Failed to delete service");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleActive = async (service) => {
        try {
            const updated = await dispatch(
                updateService({ id: service.id, active: !service.active })
            ).unwrap();
            toast.success(`Service "${updated.title}" is now ${updated.active ? "Active" : "Inactive"}`);
        } catch (err) {
            toast.error(err?.message || "Failed to update status");
        }
    };

    const filteredServices = useMemo(() => {
        if (!search.trim()) return services;

        return services.filter(service =>
            service.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [services, search]);


    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>

                    {/* <button
                        onClick={() => {
                            setEditingService(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 cursor-pointer bg-gray-600 text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-lg font-medium"
                    >
                        <Plus size={20} /> Add Service
                    </button> */}
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    {/* Left Side: Search Bar (Compact) */}
                    <div className="relative w-full sm:max-w-xs group">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search Services..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 
                       outline-none transition-all duration-200 shadow-sm hover:border-gray-300"
                        />
                    </div>

                    {/* Right Side: Action Buttons & Filters */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={16} />
                            Filter
                        </button> */}

                        <button
                            onClick={() => {
                                setEditingService(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 cursor-pointer bg-gray-600 text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-lg font-medium"
                        >
                            <Plus size={20} /> Add Service
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold">#</th>
                                <th className="px-6 py-4 text-sm font-semibold">Title</th>
                                <th className="px-6 py-4 text-sm font-semibold">Short Desc</th>
                                <th className="px-6 py-4 text-sm font-semibold">Durations & Prices</th>
                                <th className="px-6 py-4 text-sm font-semibold">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">
                                        <Loader size="lg" />
                                    </td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No services found
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service, index) => (
                                    <tr key={service.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium">{index + 1}.</td>
                                        <td className="px-6 py-4">{service.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{service.shortDesc || "No short description"}</td>

                                        {/* Durations & Prices */}
                                        <td className="px-6 py-4">
                                            <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700 max-w-[200px]">
                                                {durations.map((d) => {
                                                    const priceObj = service.prices?.find(
                                                        p => p.durationId === d.id
                                                    );

                                                    if (!priceObj) return null;

                                                    return (
                                                        <React.Fragment key={d.id}>
                                                            <span className="font-medium">
                                                                {d.minutes} min = ₹{priceObj.price}
                                                            </span>
                                                            {/* <span className="font-semibold ">
                                                                ₹{priceObj.price}
                                                            </span> */}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </td>



                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(service.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {service.active ? (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {/* Toggle Active */}
                                            <div
                                                onClick={() => handleToggleActive(service)}
                                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${service.active ? "bg-green-500" : "bg-gray-300"}`}
                                            >
                                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${service.active ? "translate-x-7" : "translate-x-0"}`} />
                                            </div>

                                            {/* Edit */}
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDeleteClick(service)}
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

                {/* Service Modal */}
                <ServiceModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingService(null);
                    }}
                    serviceToEdit={editingService}
                />

                {/* Delete Modal */}
                <ConfirmDeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setServiceToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    loading={deleteLoading}
                />
            </div>
        </DefaultPageAdmin>
    );
};

export default ServicePage;
