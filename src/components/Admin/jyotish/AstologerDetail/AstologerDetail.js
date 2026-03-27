"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Search, Mail, Phone, MapPin, Award, Globe,
    Calendar, ShieldCheck, X, User, FileText,
    Briefcase, Users, Star, ArrowRight, ExternalLink, CheckCircle, XCircle, ShieldX, UserCog
} from "lucide-react";
import { fetchAstrologers, updateAstrologer } from "@/app/redux/slices/jyotish/Register/RegisterSlice";
import toast from "react-hot-toast";
import PendingAdminUI from "../PendingAdminUI/PendingAdminUI";
import VerifiedAdminUI from "../VerifiedAdminUI/VerifiedAdminUI";

const AstrologerDetail = () => {
    const dispatch = useDispatch();
    const { astrologers, loading } = useSelector((state) => state.jyotishRegister);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAstro, setSelectedAstro] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");
    const [detailTab, setDetailTab] = useState("profile");
    const [serviceUploads, setServiceUploads] = useState({});
    const [displayNames, setDisplayNames] = useState({});
    const [revenueCuts, setRevenueCuts] = useState({});
    const [activateAfterApprove, setActivateAfterApprove] = useState(false);
    const [adminBios, setAdminBios] = useState({});
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [penalties, setPenalties] = useState({});
    console.log("astrologers", astrologers)

    useEffect(() => {
        if (selectedAstro) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedAstro]);

    useEffect(() => {
        dispatch(fetchAstrologers());
    }, [dispatch]);

    useEffect(() => {
        if (selectedAstro) {
            setRevenueCuts(prev => ({
                ...prev,
                [selectedAstro.id]: {
                    astrologer: selectedAstro.revenueAstrologer ?? 0,
                    admin: selectedAstro.revenueAdmin ?? 0,
                }
            }));
        }
    }, [selectedAstro]);

    useEffect(() => {
        if (!selectedAstro) {
            // Drawer close hone par uploaded files reset karo
            setServiceUploads({});
            setDisplayNames({});
            setRevenueCuts({});
            setAdminBios({});
            setPenalties({});
        }
    }, [selectedAstro]);

    const filteredAstrologers = astrologers?.filter((astro) => {

        // ✅ REJECTED (sabse pehle)
        if (activeTab === "rejected") {
            if (!astro.isRejected) return false;
        }

        // ✅ PENDING (IMPORTANT FIX)
        else if (activeTab === "pending") {
            if (astro.isApproved || astro.isRejected) return false;
        }

        // ✅ VERIFIED
        else if (activeTab === "verified") {
            if (!(astro.isApproved && astro.isActive) || astro.isRejected) return false;
        }

        // ✅ INACTIVE
        else if (activeTab === "inactive") {
            if (astro.isActive || astro.isRejected) return false;
        }

        // 🔍 Search
        return (
            astro.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            astro.services?.some(service =>
                service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });

    const handleServiceUpload = (serviceId, url) => {
        setServiceUploads((prev) => ({
            ...prev,
            [serviceId]: url // ✅ direct string store karo
        }));
    };

    const handleViewFile = (url) => {
        if (!url) {
            alert("File not available");
            return;
        }

        const fullUrl = `${window.location.origin}${url}`; // ✅ full URL banaya
        window.open(fullUrl, "_blank");
    };

    const handleDisplayName = (astroId, value) => {
        setDisplayNames((prev) => ({
            ...prev,
            [astroId]: value
        }));
    };

    const handleAdminBio = (astroId, value) => {
        setAdminBios((prev) => ({
            ...prev,
            [astroId]: value
        }));
    };

    const handleRevenueCut = (astroId, type, value) => {
        const numValue = Number(value);

        const existing = revenueCuts[astroId] || { astrologer: 0, admin: 0 };

        const updated = {
            ...existing,
            [type]: numValue
        };

        const total = Number(updated.astrologer) + Number(updated.admin);

        // ✅ Validation OUTSIDE setState
        if (total > 100) {
            toast.error("Total percentage cannot exceed 100% ❌");
            return;
        }

        // ✅ Safe update
        setRevenueCuts(prev => ({
            ...prev,
            [astroId]: {
                ...prev[astroId],
                [type]: numValue
            }
        }));
    };


    const validateRevenue = (astroId) => {
        const cuts = revenueCuts[astroId];

        if (!cuts) {
            toast.error("Please enter revenue split ❌");
            return false;
        }

        const total = Number(cuts.astrologer) + Number(cuts.admin);

        if (total !== 100) {
            toast.error("Total must be exactly 100% ❌");
            return false;
        }

        return true;
    };

    const handleApprove = async (astroId) => {
        if (!validateRevenue(astroId)) return;

        const payload = {
            id: astroId,
            displayName: displayNames[astroId],
            isApproved: true,
            isActive: selectedAstro.isApproved ? selectedAstro.isActive : activateAfterApprove,
            revenueAstrologer: revenueCuts[astroId]?.astrologer,
            revenueAdmin: revenueCuts[astroId]?.admin,
            bio: adminBios[astroId],
            serviceDocs: serviceUploads,
            penalty: penalties[astroId]?.penalty ?? selectedAstro.penalty,
            settlementAmount: penalties[astroId]?.settlementAmount ?? selectedAstro.settlementAmount,
            paidPenalty: penalties[astroId]?.paidPenalty ?? selectedAstro.paidPenalty
        };

        try {
            const res = await dispatch(updateAstrologer(payload)).unwrap();

            // ✅ backend message show
            toast.success(res?.message || "Astrologer approved successfully ✅");
            await dispatch(fetchAstrologers());
            setSelectedAstro(null);
        } catch (err) {
            console.error(err);

            // ✅ backend error message show
            toast.error(err?.message || err || "Something went wrong ❌");
        }
    };

    const handleReject = async (astroId) => {
        if (!rejectReason) {
            toast.error("Please enter reject reason ❌");
            return;
        }

        const payload = {
            id: astroId,
            isRejected: true,
            rejectReason
        };

        try {
            const res = await dispatch(updateAstrologer(payload)).unwrap();

            toast.success(res?.message || "Astrologer rejected ❌");

            setShowRejectModal(false);
            setRejectReason("");
            setSelectedAstro(null);

        } catch (err) {
            console.error(err);
            toast.error(err?.message || "Reject failed ❌");
        }
    };


    const handlePenaltyChange = (astroId, field, value) => {
        setPenalties(prev => ({
            ...prev,
            [astroId]: {
                ...prev[astroId],
                [field]: value
            }
        }));
        console.log(`Astro ${astroId} - ${field} updated to ${value}`);
    };

    const handleRemoveCertificate = async (certId) => {
        try {
            await dispatch(removeCertificate({ id: certId })).unwrap();
            toast.success("Certificate removed ✅");
            await dispatch(fetchAstrologers());
        } catch (err) {
            toast.error(err?.message || "Failed to remove certificate ❌");
        }
    };


    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 selection:bg-indigo-100">
            {/* Top Navigation / Stats Decor */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Users className="text-indigo-600 h-6 w-6" />
                            Expert <span className="text-indigo-600">Directory</span>
                        </h1>
                    </div>

                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search experts by name or specialty..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-10">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={Users} label="Total Experts" count={astrologers?.length || 0} color="bg-indigo-600" />
                    <StatCard icon={ShieldCheck} label="Verified Status" count={`${astrologers?.filter(a => a.isApproved).length || 0} / ${astrologers?.length || 0}`} color="bg-emerald-500" />
                </div>

                {/* Tabs for filtering astrologers */}
                <div className="flex gap-4 mb-6">
                    {["pending", "verified", "inactive", "rejected"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === tab
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-indigo-50"
                                }`}
                        >
                            {tab === "pending" && "Pending Approval"}
                            {tab === "verified" && "Verified"}
                            {tab === "inactive" && "Inactive / Disabled"}
                            {tab === "rejected" && "Rejected"}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-slate-200">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-slate-500 animate-pulse">Loading Master Astrologers...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAstrologers?.length > 0 ? (
                            filteredAstrologers.map((astro) => (
                                <div
                                    key={astro.id}
                                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-indigo-100 transition-colors"></div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                            {astro.fullName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{astro.fullName}</h3>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{astro.gender}</p>
                                            {astro.isApproved ? (
                                                <div className="flex items-center gap-1 mt-1 text-emerald-500">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">VERIFIED</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 mt-1 text-red-500">
                                                    <ShieldX className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">NOT VERIFIED</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span className="truncate">{astro.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Award className="h-4 w-4 text-slate-400" />
                                            <span>{astro.profile?.experience || 0} Years Experience</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedAstro(astro); setDetailTab("profile"); }}
                                        className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold rounded-xl transition-all group/btn"
                                    >
                                        View Full Profile
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800">No Experts Found</h3>
                                <p className="text-slate-500 mt-1">Try adjusting your search keywords.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- Details Side Panel (Drawer) --- */}
            {selectedAstro && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedAstro(null)} />

                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in">
                        {/* Header Panel */}
                        <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <button
                                onClick={() => setSelectedAstro(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white z-20"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl font-black">
                                    {selectedAstro.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black">{selectedAstro.fullName}</h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-500/30">
                                            ID: #{selectedAstro.id.toString().slice(-5)}
                                        </span>
                                        <span
                                            className={`flex items-center gap-1 text-xs font-bold ${selectedAstro.isActive ? "text-emerald-400" : "text-red-500"
                                                }`}
                                        >
                                            {selectedAstro.isActive ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <XCircle className="h-4 w-4" />
                                            )}
                                            {selectedAstro.isActive ? "ACTIVE" : "NOT ACTIVE"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-100 px-8 bg-white sticky top-0 z-20">
                            {[
                                { id: "profile", label: "Overview", icon: User },
                                { id: "documents", label: "Verification", icon: FileText },
                                { id: "services", label: "Services", icon: Briefcase },
                                { id: "admin", label: "Admin Actions", icon: UserCog }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setDetailTab(tab.id)}
                                    className={`flex items-center gap-2 py-5 px-4 text-sm font-bold transition-all relative ${detailTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {detailTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                            {detailTab === "profile" && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DetailItem icon={Mail} label="Email Address" value={selectedAstro.email} />
                                        <DetailItem icon={Phone} label="Contact Number" value={`${selectedAstro.countryCode} ${selectedAstro.phoneLocal}`} />
                                        <DetailItem icon={Award} label="Total Experience" value={`${selectedAstro.profile?.experience || 0} Years`} />
                                        <DetailItem icon={Globe} label="Languages" value={selectedAstro.profile?.languages?.join(", ") || "N/A"} />
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Biography</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {selectedAstro.profile?.bio || "No biography provided for this expert."}
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location</h4>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-1">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{selectedAstro.profile?.address || "N/A"}</p>
                                                <p className="text-sm text-slate-500">{selectedAstro.profile?.city}, {selectedAstro.profile?.state}, {selectedAstro.profile?.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-200">
                                        <span>Registered: {new Date(selectedAstro.createdAt).toLocaleDateString()}</span>
                                        <span>Last Updated: {new Date(selectedAstro.updatedAt).toLocaleDateString()}</span>
                                    </div>

                                </div>
                            )}

                            {detailTab === "documents" && (
                                <div className="grid grid-cols-1 gap-6 animate-fade-in">

                                    {/* ✅ Profile ID Proof Display */}
                                    {selectedAstro.profile?.idProofType && selectedAstro.profile?.idProofValue && (
                                        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <h4 className="font-bold text-blue-800 uppercase text-xs tracking-wider">
                                                        ID Proof ({selectedAstro.profile.idProofType})
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="text-sm text-slate-700">
                                                {selectedAstro.profile.idProofValue}
                                            </div>
                                        </div>
                                    )}

                                    {/* ✅ Existing documents */}
                                    {selectedAstro.documents?.length > 0 ? (
                                        selectedAstro.documents.map((doc) => (
                                            <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{doc.type}</h4>
                                                    </div>
                                                    {doc.verified && (
                                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
                                                            VERIFIED
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-100">
                                                    <img src={doc.fileUrl} alt={doc.type} className="w-full h-full object-contain" />
                                                    <a href={doc.fileUrl} target="_blank" className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <ExternalLink className="text-white h-8 w-8" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState icon={FileText} message="No legal documents available." />
                                    )}
                                </div>
                            )}

                            {detailTab === "services" && (
                                <div className="grid grid-cols-1 gap-4 animate-fade-in">
                                    {selectedAstro.services?.length > 0 ? selectedAstro.services.map((service) => (
                                        <div key={service.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-300 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <Star className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{service.serviceName}</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Standard Consultation</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-indigo-600">{service.currencySymbol}{service.price}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{service.currency}</div>
                                            </div>
                                        </div>
                                    )) : <EmptyState icon={Briefcase} message="No services defined yet." />}
                                </div>
                            )}

                            {activeTab === "pending" && detailTab === "admin" && (
                                <PendingAdminUI
                                    selectedAstro={selectedAstro}
                                    handleApprove={handleApprove}
                                    handleDisplayName={handleDisplayName}
                                    handleRevenueCut={handleRevenueCut}
                                    handleAdminBio={handleAdminBio}
                                    handleServiceUpload={handleServiceUpload}
                                    handleViewFile={handleViewFile}
                                    serviceUploads={serviceUploads}
                                    activateAfterApprove={activateAfterApprove}
                                    setActivateAfterApprove={setActivateAfterApprove}
                                    setShowRejectModal={setShowRejectModal}
                                    handleImageUpload={handleImageUpload}
                                />
                            )}

                            {activeTab === "verified" && detailTab === "admin" && (
                                <VerifiedAdminUI
                                    selectedAstro={selectedAstro}
                                    handleApprove={handleApprove}
                                    handleDisplayName={handleDisplayName}
                                    handleRevenueCut={handleRevenueCut}
                                    handleAdminBio={handleAdminBio}
                                    handleServiceUpload={handleServiceUpload}
                                    handleViewFile={handleViewFile}
                                    serviceUploads={serviceUploads}
                                    activateAfterApprove={activateAfterApprove}
                                    setActivateAfterApprove={setActivateAfterApprove}
                                    setShowRejectModal={setShowRejectModal}
                                    handlePenaltyChange={handlePenaltyChange}
                                    handleImageUpload={handleImageUpload}
                                    handleRemoveCertificate={handleRemoveCertificate}
                                />
                            )}

                            {/*
                            {activeTab === "inactive" && detailTab === "admin" && (
                                <InactiveAdminUI />
                            )}

                            {activeTab === "rejected" && detailTab === "admin" && (
                                <RejectedAdminUI />
                            )} */}


                        </div>
                    </div>
                </div>
            )}

            {
                showRejectModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setShowRejectModal(false)}
                        />

                        {/* Modal */}
                        <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl animate-fade-in">

                            <h3 className="text-lg font-bold mb-4 text-slate-800">
                                Reject Astrologer
                            </h3>

                            <textarea
                                rows={4}
                                placeholder="Enter rejection reason..."
                                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-2 bg-gray-200 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => handleReject(selectedAstro.id)}
                                    className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style jsx global>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
        </div>
    );
};



// --- Helper Components ---

const StatCard = ({ icon: Icon, label, count, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-800">{count}</p>
        </div>
    </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:bg-indigo-50/30 transition-colors">
        <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
            <Icon className="h-5 w-5" />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
        </div>
    </div>
);

const EmptyState = ({ icon: Icon, message }) => (
    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
        <Icon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-500 font-bold">{message}</p>
    </div>
);

const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    let data;
    try {
        data = await res.json();
        console.log("Upload API Response:", data);
    } catch (err) {
        throw new Error("Server did not return valid JSON");
    }

    if (!res.ok) throw new Error(data.message || "Upload failed");

    return data.urls;
};


export default AstrologerDetail;