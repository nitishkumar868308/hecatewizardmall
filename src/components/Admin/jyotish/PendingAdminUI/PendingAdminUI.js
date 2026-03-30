import React from 'react'
import {
    FileText,
    CheckCircle, XCircle,
} from "lucide-react";

const PendingAdminUI = ({
    selectedAstro,
    handleApprove,
    handleDisplayName,
    handleRevenueCut,
    handleAdminBio,
    handleServiceUpload,
    handleViewFile,
    serviceUploads,
    activateAfterApprove,
    setActivateAfterApprove,
    setShowRejectModal,
    handleImageUpload,
    handleExtraTitleChange,
    handleAddMoreDocument,
    handleExtraFileUpload,
    extraDocuments,
}) => {
    return (
        <>
            {

                <div className="space-y-6 animate-fade-in">

                    {/* ===== STATUS CARD ===== */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                                Account Status
                            </h4>

                            {selectedAstro.isApproved ? (
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                                    <CheckCircle className="h-5 w-5" />
                                    Approved & Active
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
                                    <XCircle className="h-5 w-5" />
                                    Pending Approval
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-slate-300">
                            <p><span className="text-slate-400">User ID:</span> #{selectedAstro.id}</p>
                            <p><span className="text-slate-400">Joined:</span> {new Date(selectedAstro.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* ===== ADMIN CONTROLS ===== */}
                    {!selectedAstro.isApproved && (
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">

                            <h4 className="text-sm font-black text-slate-600 uppercase tracking-wider">
                                Admin Controls
                            </h4>

                            {/* ===== DISPLAY NAME ===== */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter display name (visible to users)"
                                    className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    onChange={(e) =>
                                        handleDisplayName(selectedAstro.id, e.target.value)
                                    }
                                />
                            </div>

                            {/* ===== REVENUE SPLIT ===== */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase">
                                    Revenue Split (%)
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Astrologer Cut */}
                                    <div className="bg-indigo-50 p-4 rounded-xl border">
                                        <p className="text-xs text-slate-500 mb-1">Astrologer Earnings</p>
                                        <input
                                            type="number"
                                            placeholder="50%"
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                            onChange={(e) =>
                                                handleRevenueCut(selectedAstro.id, "astrologer", e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* Admin Cut */}
                                    <div className="bg-emerald-50 p-4 rounded-xl border">
                                        <p className="text-xs text-slate-500 mb-1">Platform Fee</p>
                                        <input
                                            type="number"
                                            placeholder="50%"
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                            onChange={(e) =>
                                                handleRevenueCut(selectedAstro.id, "admin", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ===== SERVICE CERTIFICATION UPLOAD ===== */}
                            <div className="space-y-5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Service Certifications
                                </label>

                                {selectedAstro.services?.map((service) => (
                                    <div
                                        key={service.id}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition"
                                    >
                                        {/* LEFT SIDE */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <FileText className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">
                                                    {service.serviceName}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Upload certification (PDF / Image)
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE (UPLOAD BUTTON) */}
                                        <div className="relative w-full sm:w-auto">
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
                                                Upload File

                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        try {
                                                            const urls = await handleImageUpload(file);
                                                            handleServiceUpload(service.id, urls);
                                                        } catch (err) {
                                                            console.error(err);
                                                        }
                                                    }}
                                                />
                                            </label>

                                            {/* Preview */}
                                            {serviceUploads[service.id] && (
                                                <button
                                                    onClick={() => handleViewFile(serviceUploads[service.id])}
                                                    className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1 hover:underline"
                                                >
                                                    ✅ View Uploaded File
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ===== EXTRA DOCUMENTS ===== */}
                            <div className="space-y-4">

                                {/* Add Button */}
                                <button
                                    onClick={handleAddMoreDocument}
                                    className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition"
                                >
                                    + Add More Document
                                </button>

                                {/* Dynamic Fields */}
                                {extraDocuments.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
                                    >
                                        {/* Title */}
                                        <input
                                            type="text"
                                            placeholder="Enter document title (e.g. Advanced Astrology Certificate)"
                                            className="w-full px-4 py-2 border rounded-lg text-sm"
                                            value={doc.title}
                                            onChange={(e) =>
                                                handleExtraTitleChange(doc.id, e.target.value)
                                            }
                                        />

                                        {/* Upload */}
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">
                                            Upload File
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleExtraFileUpload(doc.id, e.target.files[0])
                                                }
                                            />
                                        </label>

                                        {/* Preview */}
                                        {doc.preview && (
                                            <button
                                                onClick={() => handleViewFile(doc.preview)}
                                                className="text-xs text-emerald-600 font-bold flex items-center gap-1"
                                            >
                                                ✅ View Uploaded File
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* ===== ADMIN BIO ===== */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">
                                    Bio
                                </label>

                                <textarea
                                    rows={4}
                                    placeholder="Write a professional bio for this astrologer (visible to users)..."
                                    className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    onChange={(e) =>
                                        handleAdminBio(selectedAstro.id, e.target.value)
                                    }
                                />
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">

                                {/* Top Row */}
                                <div className="flex items-center justify-between gap-4">

                                    {/* Left Text */}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Set Status
                                        </span>

                                        <span className={`text-xs font-bold mt-1 ${activateAfterApprove ? "text-emerald-600" : "text-red-500"
                                            }`}>
                                            {activateAfterApprove ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>

                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => setActivateAfterApprove(prev => !prev)}
                                        className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${activateAfterApprove
                                            ? "bg-emerald-500 shadow-md shadow-emerald-200"
                                            : "bg-red-400 shadow-md shadow-red-200"
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${activateAfterApprove ? "translate-x-7" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Info Text */}
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    If you keep this <span className="font-semibold text-red-500">inactive</span>, the astrologer will be
                                    approved but won’t be visible or available to users until activated.
                                </p>
                            </div>

                            {/* ===== ACTION BUTTONS ===== */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">

                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() => handleApprove(selectedAstro.id)}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            }
        </>
    )
}

export default PendingAdminUI