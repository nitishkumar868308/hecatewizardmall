"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, ChevronRight } from "lucide-react";
import { fetchAstrologers } from "@/app/redux/slices/jyotish/Register/RegisterSlice";

const AstrologerDetail = () => {
    const dispatch = useDispatch();
    const { astrologers, loading } = useSelector((state) => state.jyotishRegister);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAstro, setSelectedAstro] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        dispatch(fetchAstrologers());
    }, [dispatch]);

    const filteredAstrologers = astrologers?.filter((astro) =>
        astro.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astro.services?.some(service => service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Astrologer{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            Experts
                        </span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or service..."
                            className="w-full pl-12 pr-4 py-4 bg-white border-0 ring-1 ring-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                                    <th className="px-8 py-6 text-right text-sm font-bold text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400">
                                            Loading astrologers...
                                        </td>
                                    </tr>
                                ) : filteredAstrologers?.length > 0 ? (
                                    filteredAstrologers.map((astro) => (
                                        <tr key={astro.id} className="group hover:bg-slate-50/80 transition-all">
                                            <td className="px-8 py-5 font-medium">{astro.fullName}</td>
                                            <td className="px-8 py-5 text-slate-600">{astro.email}</td>
                                            <td className="px-8 py-5 text-slate-600">{astro.phoneNumber}</td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => { setSelectedAstro(astro); setActiveTab("profile"); }}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400">
                                            No astrologers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {selectedAstro && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 relative">
                            <button
                                onClick={() => setSelectedAstro(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 mb-4">
                                {["profile", "documents", "services"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 font-medium ${activeTab === tab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="space-y-4">
                                {activeTab === "profile" && (
                                    <div>
                                        <p><strong>Name:</strong> {selectedAstro.fullName}</p>
                                        <p><strong>Email:</strong> {selectedAstro.email}</p>
                                        <p><strong>Phone:</strong> {selectedAstro.phoneNumber}</p>
                                        <p><strong>Gender:</strong> {selectedAstro.gender}</p>
                                        <p><strong>Bio:</strong> {selectedAstro.profile?.bio}</p>
                                        <p><strong>Address:</strong> {selectedAstro.profile?.address}, {selectedAstro.profile?.city}, {selectedAstro.profile?.state}, {selectedAstro.profile?.country}</p>
                                        <p><strong>Experience:</strong> {selectedAstro.profile?.experience} yrs</p>
                                        <p><strong>Languages:</strong> {selectedAstro.profile?.languages?.join(", ")}</p>
                                    </div>
                                )}
                                {activeTab === "documents" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedAstro.documents?.map((doc) => (
                                            <div key={doc.id} className="p-3 border rounded-lg">
                                                <p><strong>Type:</strong> {doc.type}</p>
                                                <p><strong>Verified:</strong> {doc.verified ? "Yes" : "No"}</p>
                                                <img src={doc.fileUrl} alt={doc.type} className="mt-2 max-h-40 w-full object-contain rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === "services" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedAstro.services?.map((service) => (
                                            <div key={service.id} className="p-3 border rounded-lg">
                                                <p><strong>Service Name:</strong> {service.serviceName}</p>
                                                <p><strong>Price:</strong> ${service.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AstrologerDetail;