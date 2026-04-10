import React from 'react'
import { CheckCircle, XCircle, FileText } from "lucide-react";

const InactiveAdminUI = ({
    selectedAstro,
    handleApprove,
    handleDisplayName,
    handleRevenueCut,
    handleAdminBio,
    handleServiceUpload,
    handleViewFile,
    serviceUploads,
    handlePenaltyChange,
    handleImageUpload,
    handleRemoveCertificate,
    handleExtraDocChange,
    handleRemoveExtraDocument,
    handleDeletePenalty,
    handleToggleStatus
}) => {
    console.log("selectedAstro", selectedAstro)

    return (
        <>
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
                            defaultValue={selectedAstro.displayName || ""}
                            placeholder="Enter display name (visible to users)"
                            className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            onChange={(e) =>
                                handleDisplayName(selectedAstro.id, e.target.value)
                            }
                            disabled
                        />
                    </div>

                    {/* ===== REVENUE SPLIT ===== */}
                    <div className="space-y-3 ">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                            Revenue Split (%)
                        </label>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Astrologer Cut */}
                            <div className="bg-indigo-50 p-4 rounded-xl border">
                                <p className="text-xs text-slate-500 mb-1">Astrologer Earnings</p>
                                <input
                                    type="number"
                                    defaultValue={selectedAstro.revenueAstrologer || ""}
                                    placeholder="50%"
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    onChange={(e) =>
                                        handleRevenueCut(selectedAstro.id, "astrologer", e.target.value)
                                    }
                                    disabled
                                />
                            </div>

                            {/* Admin Cut */}
                            <div className="bg-emerald-50 p-4 rounded-xl border">
                                <p className="text-xs text-slate-500 mb-1">Platform Fee</p>
                                <input
                                    type="number"
                                    placeholder="50%"
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    defaultValue={selectedAstro.revenueAdmin || ""}
                                    onChange={(e) =>
                                        handleRevenueCut(selectedAstro.id, "admin", e.target.value)
                                    }
                                    disabled
                                />
                            </div>

                            {/* GST */}
                            <div className="bg-yellow-50 p-4 rounded-xl border">
                                <p className="text-xs text-slate-500 mb-1">GST (%)</p>
                                <input
                                    type="number"
                                    defaultValue={selectedAstro.gst || ""}
                                    placeholder="18%"
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    onChange={(e) =>
                                        handleRevenueCut(selectedAstro.id, "gst", e.target.value)
                                    }
                                    disabled
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
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 disabled">
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
                                            disabled
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

                                    {selectedAstro.certificates
                                        ?.filter(cert => cert.serviceId === service.id)
                                        .map(cert => (
                                            <div key={cert.id} className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => handleViewFile(cert.fileUrl)}
                                                    className="text-xs text-blue-600 font-bold hover:underline"
                                                >
                                                    📄 View Existing Certificate
                                                </button>
                                                <button
                                                    disabled
                                                    onClick={() => handleRemoveCertificate(cert.id)}
                                                    className="text-xs text-red-500 font-bold hover:underline"
                                                >
                                                    ❌ Remove
                                                </button>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== EXTRA DOCUMENTS ===== */}
                    <div className="space-y-4">

                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">
                                Extra Documents
                            </label>

                            <button
                                disabled
                                onClick={() => handleExtraDocChange("addMore")}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold"
                            >
                                + Add More
                            </button>
                        </div>

                        {(selectedAstro.extraDocuments || []).map((doc, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border"
                            >

                                {/* TITLE INPUT */}
                                <input
                                    disabled
                                    type="text"
                                    placeholder="Enter document title (e.g. Aadhaar, PAN...)"
                                    className="px-3 py-2 border rounded-lg text-sm"
                                    value={doc.title || ""}
                                    onChange={(e) =>
                                        handleExtraDocChange("title", e.target.value, index)
                                    }
                                />

                                {/* UPLOAD */}
                                <label className="cursor-pointer px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg font-bold flex items-center justify-center">
                                    Upload
                                    <input
                                        disabled
                                        type="file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const url = await handleImageUpload(file);
                                            handleExtraDocChange("upload", url, index);
                                        }}
                                    />
                                </label>

                                {/* ACTIONS */}
                                <div className="flex items-center gap-3">

                                    {doc?.fileUrl && (
                                        <button
                                            onClick={() => handleViewFile(doc.fileUrl)}
                                            className="text-xs text-blue-600 font-bold hover:underline"
                                        >
                                            📄 View
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (doc.id) {
                                                handleRemoveExtraDocument(doc.id, index); // ✅ API call
                                            } else {
                                                handleExtraDocChange("remove", null, index); // ✅ frontend only (new doc)
                                            }
                                        }}
                                        disabled
                                        className="text-xs text-red-500 font-bold hover:underline"
                                    >
                                        ❌ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== ADMIN BIO ===== */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                            Bio
                        </label>

                        <textarea
                            disabled
                            rows={4}
                            defaultValue={selectedAstro.bio || ""}
                            placeholder="Write a professional bio for this astrologer (visible to users)..."
                            className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            onChange={(e) =>
                                handleAdminBio(selectedAstro.id, e.target.value)
                            }
                        />
                    </div>

                    {/* ===== PENALTY SECTION ===== */}
                    <div className="space-y-4">

                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">
                                Penalties
                            </label>

                            <button
                                disabled
                                onClick={() => handlePenaltyChange(selectedAstro.id, "addMore")}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold"
                            >
                                + Add More
                            </button>
                        </div>

                        {(selectedAstro.penalties || []).map((p, index) => {
                            const statusColor = {
                                PENDING: "bg-red-100 text-red-600",
                                PARTIAL: "bg-yellow-100 text-yellow-600",
                                PAID: "bg-emerald-100 text-emerald-600",
                            };

                            return (
                                <div
                                    key={index}
                                    className="bg-slate-50 p-4 rounded-xl border space-y-4 relative"
                                >

                                    {/* 🔥 TOP HEADER */}
                                    <div className="flex justify-between items-start">

                                        {/* LEFT: STATUS + DATES */}
                                        <div className="flex flex-col gap-1">

                                            {/* STATUS BADGE */}
                                            <span
                                                className={`text-[10px] font-bold px-2 py-1 rounded-full w-fit ${statusColor[p.status] || "bg-gray-100 text-gray-600"}`}
                                            >
                                                {p.status || "PENDING"}
                                            </span>

                                            {/* DATES */}
                                            <div className="text-[10px] text-slate-400">
                                                <p>
                                                    Created: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                                                </p>
                                                <p>
                                                    Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ❌ REMOVE BUTTON */}
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this penalty?")) {
                                                    handleDeletePenalty(p, index);
                                                }
                                            }}
                                            className="text-red-500 text-xs font-bold hover:underline"
                                            disabled
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>

                                    {/* 🔽 INPUT GRID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                                        {/* Amount */}
                                        <div className="flex flex-col">
                                            <label className="text-xs text-slate-500 mb-1">
                                                Penalty Amount
                                            </label>
                                            <input
                                                type="number"
                                                className="px-3 py-2 border rounded-lg text-sm"
                                                value={p.amount || ""}
                                                onChange={(e) =>
                                                    handlePenaltyChange(selectedAstro.id, "amount", e.target.value, index)
                                                }
                                                disabled
                                            />
                                        </div>

                                        {/* Reason */}
                                        <div className="flex flex-col">
                                            <label className="text-xs text-slate-500 mb-1">
                                                Reason
                                            </label>
                                            <input
                                                type="text"
                                                className="px-3 py-2 border rounded-lg text-sm"
                                                value={p.reason || ""}
                                                onChange={(e) =>
                                                    handlePenaltyChange(selectedAstro.id, "reason", e.target.value, index)
                                                }
                                                disabled
                                            />
                                        </div>

                                        {/* Settlement */}
                                        <div className="flex flex-col">
                                            <label className="text-xs text-slate-500 mb-1">
                                                Settlement
                                            </label>
                                            <input
                                                type="number"
                                                className="px-3 py-2 border rounded-lg text-sm"
                                                value={p.settlement || ""}
                                                onChange={(e) =>
                                                    handlePenaltyChange(selectedAstro.id, "settlement", e.target.value, index)
                                                }
                                                disabled
                                            />
                                        </div>

                                        {/* Paid (Disabled) */}
                                        <div className="flex flex-col">
                                            <label className="text-xs text-slate-500 mb-1">
                                                Paid <span className="text-red-400">(Auto)</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="px-3 py-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                                value={p.paidAmount || ""}
                                                disabled
                                            />
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">

                        {/* Top Row */}
                        <div className="flex items-center justify-between gap-4">

                            {/* Left Text */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">
                                    Set Status
                                </span>

                                <span className={`text-xs font-bold mt-1 ${selectedAstro.isActive ? "text-emerald-600" : "text-red-500"}`}>
                                    {selectedAstro.isActive ? "ACTIVE" : "INACTIVE"}
                                </span>
                            </div>

                            {/* Toggle Button */}
                            <button
                               onClick={handleToggleStatus}
                                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${selectedAstro.isActive
                                    ? "bg-emerald-500 shadow-md shadow-emerald-200"
                                    : "bg-red-400 shadow-md shadow-red-200"
                                    }`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${selectedAstro.isActive ? "translate-x-7" : "translate-x-0"}`}
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
                    {/* <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">

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
                            Update
                        </button>
                    </div> */}
                </div>

            </div>
        </>
    )
}

export default InactiveAdminUI