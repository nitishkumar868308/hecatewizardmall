"use client"
import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Camera } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/app/redux/slices/book_consultant/services/serviceSlice";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { fetchAstrologers, createAstrologer, updateAstrologer } from "@/app/redux/slices/book_consultant/astrologer/astrologerSlice";
import Loader from "../Include/Loader";
import { toast } from 'react-hot-toast';

const AstrologerModal = ({ isOpen, onClose, selectedAstrologer: selectedAstroProp }) => {
    const dispatch = useDispatch();
    const [selectedAstrologer, setSelectedAstrologer] = useState(selectedAstroProp || null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [profilePreview, setProfilePreview] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        displayName: "",
        phone: "",
        service: "",
        specialty: "",
        description: "",
    });


    useEffect(() => {
        if (selectedAstroProp) {
            const matchedService = services.find(s => s.title === selectedAstroProp.service && s.active)?.title || "";
            const matchedSpecialty = services.find(s => s.title === selectedAstroProp.specialty && s.active)?.title || "";

            // Find the astrologer user from allUsers
            const astroUser = astrologers.find(u => u.id === selectedAstroProp.userId);

            setSelectedAstrologer(astroUser || null); // <-- important for dropdown pre-select

            setFormData({
                fullName: selectedAstroProp.fullName || (astroUser?.name || ""),
                displayName: selectedAstroProp.displayName || "",
                phone: selectedAstroProp.phone || (astroUser?.phone || ""),
                service: matchedService,
                specialty: matchedSpecialty,
                description: selectedAstroProp.description || "",
                profileImage: selectedAstroProp.profileImage || null,
                documents: selectedAstroProp.documents?.map(d => d.fileUrl) || [],
            });

            if (selectedAstroProp.profileImage) {
                setProfilePreview(selectedAstroProp.profileImage);
            }
        } else {
            setSelectedAstrologer(null);
            setFormData({
                fullName: "",
                displayName: "",
                phone: "",
                service: "",
                specialty: "",
                description: "",
                profileImage: null,
                documents: [],
            });
            setProfilePreview(null);
        }
    }, [selectedAstroProp]);



    // Fetch users & services & astrologers
    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchServices());
        dispatch(fetchAstrologers());
    }, [dispatch]);

    const { list: allUsers = [], loading: userLoading } = useSelector((state) => state.getAllUser || {});
    const { services = [], loading: servicesLoading } = useSelector((state) => state.services || {});
    const { loading: astrologerLoading } = useSelector((state) => state.astrologers || {});

    const astrologers = allUsers.filter(user => user.role === "ASTROLOGER") || [];

    if (!isOpen) return null;

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) setProfilePreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAstrologerSelect = (e) => {
        const astro = astrologers.find(a => a.id === parseInt(e.target.value));
        setSelectedAstrologer(astro || null);
        if (astro) {
            setFormData(prev => ({
                ...prev,
                fullName: astro.name || "",
                displayName: astro.displayName || "",
                phone: astro.phone || "",
                service: astro.service || "",
                specialty: astro.specialty || "",
                description: astro.description || "",
            }));
        } else {
            setFormData({
                fullName: "",
                displayName: "",
                phone: "",
                service: "",
                specialty: "",
                description: "",
            });
        }
    };

    /* ================= IMAGE UPLOAD ================= */
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return Array.isArray(data.urls) ? data.urls[0] : data.urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, displayName, phone, service, specialty, description } = formData;
        if (!fullName || !displayName || !phone || !service || !specialty || !description) {
            toast.error("Please fill all required fields!");
            return;
        }

        try {
            // ===== Upload Profile Image =====
            let profileImageUrl = null;
            const profileInput = document.querySelector('input[type="file"][accept="image/*"]');
            if (profileInput?.files?.length) {
                profileImageUrl = await handleImageUpload(profileInput.files[0]); // Upload & get URL
            }

            // ===== Upload Documents =====
            const documentUrls = [];
            const docInput = document.querySelector('input[type="file"][multiple]');
            if (docInput?.files?.length) {
                for (let i = 0; i < docInput.files.length; i++) {
                    const url = await handleImageUpload(docInput.files[i]); // Upload each file
                    documentUrls.push(url);
                }
            }

            // ===== Prepare JSON payload =====
            const payload = {
                fullName,
                displayName,
                phone,
                service,
                specialty,
                description,
                profileImage: profileImageUrl, // must be a string URL
                documents: documentUrls,        // array of string URLs
                userId: selectedAstrologer?.id || undefined,
            };

            if (selectedAstrologer?.id) {
                payload.id = selectedAstrologer.id;
            }

            if (isEditMode && selectedAstroProp?.id) {
                // EDIT MODE: use update action
                payload.id = selectedAstroProp.id; // backend ko pata chale update hai
                const resultAction = await dispatch(updateAstrologer(payload));
                if (updateAstrologer.fulfilled.match(resultAction)) {
                    toast.success(resultAction.payload.message || "Astrologer updated successfully");
                } else {
                    toast.error(resultAction.payload?.message || "Failed to update astrologer");
                }
            } else {
                // CREATE MODE
                const resultAction = await dispatch(createAstrologer(payload));
                if (createAstrologer.fulfilled.match(resultAction)) {
                    toast.success(resultAction.payload.message || "Astrologer created successfully");
                } else {
                    toast.error(resultAction.payload?.message || "Failed to create astrologer");
                }
            }

            // Reset & close modal
            onClose();
            setSelectedAstrologer(null);
            setFormData({
                fullName: "",
                displayName: "",
                phone: "",
                service: "",
                specialty: "",
                description: "",
            });
            setSelectedFiles([]);
            setProfilePreview(null);

        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };


    const isEditMode = !!selectedAstrologer;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-5 bg-black text-white">
                    <h2 className="text-xl font-bold tracking-tight">
                        {isEditMode ? "Edit Astrologer Profile" : "Create Astrologer Profile"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-white text-black">
                    {(userLoading || servicesLoading || astrologerLoading) && <Loader />}



                    {/* Profile Photo */}
                    <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-gray-100">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Profile Photo</label>
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-black transition-all">
                                {profilePreview ? (
                                    <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <Camera className="text-gray-400 group-hover:text-black" size={30} />
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleProfileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                                <Upload size={12} />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center">Click to upload professional headshot (JPG, PNG)</p>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Select Astrologer (for update)</label>
                            <select
                                value={selectedAstrologer?.id || ""}
                                onChange={handleAstrologerSelect}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50"
                            >
                                <option value="">-- Select Astrologer --</option>
                                {astrologers.map(astro => (
                                    <option key={astro.id} value={astro.id}>
                                        {astro.name} ({astro.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Pt. Ramesh Kumar" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50" />
                        </div>

                    </div>

                    {/* Services & Specialty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Services */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Services</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50"
                            >
                                <option value="">Select Service</option>
                                {services
                                    .filter(s => s.active)
                                    .map(s => (
                                        <option key={s.id} value={s.title}>
                                            {s.title}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Specialty */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Specialty</label>
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50"
                            >
                                <option value="">Select Specialty</option>
                                {services
                                    .filter(s => s.active) // <-- only active specialties
                                    .map(s => (
                                        <option key={s.id} value={s.title}>
                                            {s.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>


                    {/* Astrologer Dropdown + Phone in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Display Name</label>
                            <input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="e.g. Astro Ramesh" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50" />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50 text-sm"
                            />
                        </div>
                    </div>


                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Write a short bio or description..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none bg-gray-50 resize-none" rows={3} />
                    </div>

                    {/* Documents */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            Verification Documents <span className="text-[10px] font-normal text-gray-400">(Optional)</span>
                        </label>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:bg-gray-50 hover:border-black transition-all group text-center cursor-pointer">
                            <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <p className="mt-2 text-sm font-medium">Select Multiple Files</p>
                                <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10 files</p>
                            </div>
                        </div>

                        {/* Old Documents */}
                        {formData.documents?.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-sm font-bold text-gray-700 mb-2">Old Documents</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {formData.documents.map((url, index) => (
                                        <div key={`existing-${index}`} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg group">
                                            <div className="flex items-center gap-2 truncate">
                                                <div className="bg-white p-1.5 rounded border text-gray-400">
                                                    <FileText size={14} />
                                                </div>
                                                <a href={url} target="_blank" className="text-xs font-semibold text-gray-600 truncate max-w-[120px]">
                                                    {url.split("/").pop()}
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Remove this old document from formData.documents
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        documents: prev.documents.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                title="Remove old document"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Newly selected files */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-sm font-bold text-gray-700 mb-2">New Documents</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg group">
                                            <div className="flex items-center gap-2 truncate">
                                                <div className="bg-white p-1.5 rounded border text-gray-400">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-600 truncate max-w-[120px]">{file.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                title="Remove new file"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold transition-all">Discard</button>
                        <button type="submit" className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold shadow-xl transition-all active:scale-95">{isEditMode ? "Update Astrologer" : "Save Astrologer"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AstrologerModal;
