"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Search, Eye, Trash2, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AstrologerModal from "@/components/BookConsultant/AstrologerModal";
import ViewModal from "@/components/BookConsultant/ViewModal";
import {
    fetchAstrologers,
    toggleAstrologerActive,
    deleteAstrologer,
} from "@/app/redux/slices/book_consultant/astrologer/astrologerSlice";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import Loader from "@/components/Include/Loader";
import { toast } from "react-hot-toast";

const AstrologerPage = () => {
    const dispatch = useDispatch();

    // Astrologers
    const { list: astrologers = [], loading: astroLoading } = useSelector(
        (state) => state.astrologers || {}
    );
    console.log("astrologers", astrologers)

    // Users
    const { list: users = [], loading: usersLoading } = useSelector(
        (state) => state.getAllUser || {}
    );
    const [editAstrologer, setEditAstrologer] = useState(null);
    const [isAstroModalOpen, setIsAstroModalOpen] = useState(false);
    const [viewModalData, setViewModalData] = useState({
        isOpen: false,
        title: "",
        subtitle: "",
        children: null,
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchAstrologers());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleToggleActive = async (astrologer) => {
        try {
            await dispatch(toggleAstrologerActive(astrologer.id));
            toast.success(
                astrologer.active ? "Astrologer deactivated" : "Astrologer activated"
            );
        } catch {
            toast.error("Failed to toggle status");
        }
    };

    const handleDelete = async (astrologer) => {
        if (confirm(`Are you sure you want to delete ${astrologer.fullName}?`)) {
            try {
                await dispatch(deleteAstrologer(astrologer.id));
                toast.success("Astrologer deleted successfully");
            } catch {
                toast.error("Failed to delete astrologer");
            }
        }
    };

    // Merge user info into astrologer
    const astrologersWithUser = astrologers.map((astro) => {
        const user = users.find((u) => u.id === astro.userId);
        return {
            ...astro,
            userName: user?.name || "-",
            userEmail: user?.email || "-",
            displayName: astro.displayName || "-",
        };
    });

    // Filtered astrologers
    const filteredAstrologers = astrologersWithUser.filter(
        (a) =>
            a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isLoading = astroLoading || usersLoading;

    const openViewModal = (astro) => {
        setViewModalData({
            isOpen: true,
            title: "Astrologer Profile",
            subtitle: `ID: #${astro.id} • Joined ${new Date(astro.createdAt).toLocaleDateString()}`,
            children: (
                <div className="space-y-8 text-black">
                    {/* 1. Top Section: Profile & Identity */}
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="relative shrink-0">
                            <img
                                src={astro.profileImage || "/default-avatar.png"}
                                alt={astro.fullName}
                                className="h-28 w-28 rounded-2xl object-cover shadow-md border-2 border-white"
                            />
                            <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${astro.active ? "bg-black text-white" : "bg-gray-400 text-white"}`}>
                                {astro.active ? "● Active" : "○ Inactive"}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Full Name</p>
                                <h3 className="text-2xl font-black text-black leading-none">{astro.fullName}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Display Name</p>
                                    <p className="text-sm font-semibold text-gray-700">{astro.displayName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Phone Number</p>
                                    <p className="text-sm font-semibold text-gray-700">{astro.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Expertise Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Primary Service</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-black text-white text-xs font-bold">
                                {astro.service}
                            </span>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Specialization</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-200 text-black text-xs font-bold">
                                {astro.specialty}
                            </span>
                        </div>
                    </div>

                    {/* 3. Description */}
                    {astro.description && (
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">About Astrologer</p>
                            <p className="text-sm text-gray-600 leading-relaxed italic">"{astro.description}"</p>
                        </div>
                    )}

                    {/* 4. Documents Section */}
                    {astro.documents && astro.documents.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] pl-1">Verification Documents</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {astro.documents.map((doc, i) => (
                                    <div key={i} className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-black transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-bold text-gray-800 truncate">Doc #{doc.id}</p>
                                                <p className="text-[10px] text-gray-400">Verification File</p>
                                            </div>
                                        </div>
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white rounded-full text-black hover:bg-black hover:text-white shadow-sm transition-all border border-gray-100"
                                            title="Download/View"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ),
        });
    };



    return (
        <DefaultPageAdmin>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Astrologers List</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search astrologer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full md:w-64"
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setIsAstroModalOpen(true)}
                            className="cursor-pointer flex items-center gap-2 bg-gray-600 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Astrologer</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">#</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Profile</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Display Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAstrologers.map((astro, index) => (
                                        <tr key={astro.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-700">{index + 1}.</td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={astro.profileImage || "/default-avatar.png"}
                                                    alt={astro.fullName}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">{astro.userName}</td>
                                            <td className="px-6 py-4 text-gray-600">{astro.displayName}</td>
                                            <td className="px-6 py-4 text-gray-600">{astro.userEmail}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${astro.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {astro.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 flex items-center gap-3 mt-3">
                                                {/* Toggle */}
                                                <div
                                                    onClick={() => handleToggleActive(astro)}
                                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${astro.active ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${astro.active ? "translate-x-7" : "translate-x-0"
                                                            }`}
                                                    />
                                                </div>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => {
                                                        setEditAstrologer(astro); // Set selected astrologer
                                                        setIsAstroModalOpen(true); // Open modal
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                                                >
                                                    <Edit size={18} />
                                                </button>


                                                {/* View */}
                                                <button
                                                    onClick={() => openViewModal(astro)}
                                                    className="text-gray-600 hover:text-gray-800 flex items-center justify-center"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(astro)}
                                                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredAstrologers.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center text-gray-500 py-6">
                                                No astrologers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Astrologer Modal */}
            <AstrologerModal
                isOpen={isAstroModalOpen}
                onClose={() => {
                    setIsAstroModalOpen(false);
                    setEditAstrologer(null);
                }}
                selectedAstrologer={editAstrologer}
            />

            {/* Dynamic View Modal */}
            <ViewModal
                isOpen={viewModalData.isOpen}
                onClose={() => setViewModalData((prev) => ({ ...prev, isOpen: false }))}
                title={viewModalData.title}
                subtitle={viewModalData.subtitle}
            >
                {viewModalData.children}
            </ViewModal>
        </DefaultPageAdmin>
    );
};

export default AstrologerPage;
