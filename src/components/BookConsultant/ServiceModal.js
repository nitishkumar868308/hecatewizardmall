"use client";

import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../Include/Loader";

import { createService, updateService } from "@/app/redux/slices/book_consultant/services/serviceSlice";
import { fetchDurations } from "@/app/redux/slices/book_consultant/duration/durationSlice";

const ServiceModal = ({ isOpen, onClose, serviceToEdit }) => {
    const dispatch = useDispatch();
    const { durations } = useSelector((state) => state.duration);

    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [image, setImage] = useState("");

    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const [priceRows, setPriceRows] = useState([
        { durationId: "", price: "" }
    ]);


    useEffect(() => {
        dispatch(fetchDurations());
    }, [dispatch]);

    useEffect(() => {
        if (serviceToEdit) {
            setTitle(serviceToEdit.title);
            setShortDesc(serviceToEdit.shortDesc || "");
            setLongDesc(serviceToEdit.longDesc || "");
            setImage(serviceToEdit.image || "");

            setPriceRows(
                serviceToEdit.prices?.length
                    ? serviceToEdit.prices.map(p => ({
                        durationId: p.durationId,
                        price: p.price,
                    }))
                    : [{ durationId: "", price: "" }]
            );
        } else {
            resetForm();
        }
    }, [serviceToEdit]);


    const resetForm = () => {
        setTitle("");
        setShortDesc("");
        setLongDesc("");
        setImage("");
        setPriceRows([{ durationId: "", price: "" }]);
    };


    const selectedDurationIds = priceRows
        .map(r => r.durationId)
        .filter(Boolean);

    const availableDurations = (currentId) =>
        durations.filter(d =>
            // active duration OR already selected (edit case)
            (d.active || d.id === currentId) &&
            (!selectedDurationIds.includes(d.id) || d.id === currentId)
        );
    const handleRowChange = (index, field, value) => {
        const updated = [...priceRows];
        updated[index][field] = field === "price" ? Number(value) : Number(value);
        setPriceRows(updated);
    };

    const addRow = () => {
        setPriceRows([...priceRows, { durationId: "", price: "" }]);
    };

    const removeRow = (index) => {
        setPriceRows(priceRows.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);
        try {
            const url = await handleImageUpload(file);
            setImage(url);
            toast.success("Image uploaded successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setImageUploading(false);
        }
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!title) return toast.error("Title is required");

        const validRows = priceRows.filter(
            r => r.durationId && r.price && r.price > 0
        );

        if (validRows.length === 0) {
            return toast.error("Enter price for at least one duration");
        }

        setLoading(true);

        try {
            const payload = {
                title,
                shortDesc,
                longDesc,
                image,
                prices: validRows.map(r => ({
                    durationId: Number(r.durationId),
                    price: Number(r.price),
                })),
            };

            if (serviceToEdit) {
                await dispatch(updateService({ id: serviceToEdit.id, ...payload })).unwrap();
                toast.success("Service updated");
            } else {
                await dispatch(createService(payload)).unwrap();
                toast.success("Service created");
            }

            resetForm();
            onClose();
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold">
                        {serviceToEdit ? "Edit Service" : "Add Service"}
                    </h2>
                    <button onClick={onClose}><X /></button>
                </div>

                {/* Body */}
                <div className="mt-6 space-y-4">

                    <input
                        className="w-full border rounded-lg p-2.5"
                        placeholder="Service Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <input
                        className="w-full border rounded-lg p-2.5"
                        placeholder="Short Description"
                        value={shortDesc}
                        onChange={e => setShortDesc(e.target.value)}
                    />

                    <textarea
                        className="w-full border rounded-lg p-2.5"
                        rows={3}
                        placeholder="Long Description"
                        value={longDesc}
                        onChange={e => setLongDesc(e.target.value)}
                    />

                    {/* IMAGE UPLOAD */}
                    <div className="space-y-2">
                        <label className="block font-medium">Service Image</label>

                        {image && (
                            <img
                                src={image}
                                alt="service"
                                className="h-32 w-full object-cover rounded-lg border"
                            />
                        )}

                        <label className="flex items-center justify-center gap-2 cursor-pointer border rounded-lg p-3 hover:bg-gray-50">
                            <Upload size={18} />
                            {imageUploading ? "Uploading..." : "Upload Image"}
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </label>
                    </div>

                    {/* DURATION + PRICE */}
                    <div className="space-y-3">
                        <label className="font-medium block">Durations & Prices</label>

                        {priceRows.map((row, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                {/* Duration Select */}
                                <select
                                    className="flex-1 border rounded-lg p-2.5"
                                    value={row.durationId}
                                    onChange={(e) =>
                                        handleRowChange(index, "durationId", e.target.value)
                                    }
                                >
                                    <option value="">Select Duration</option>
                                    {availableDurations(row.durationId).map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.minutes} min
                                        </option>
                                    ))}
                                </select>

                                {/* Price */}
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Price"
                                    className="w-32 border rounded-lg p-2.5"
                                    value={row.price}
                                    onChange={(e) =>
                                        handleRowChange(index, "price", e.target.value)
                                    }
                                />

                                {/* Remove */}
                                {priceRows.length > 1 && (
                                    <button
                                        onClick={() => removeRow(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Add More */}
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-sm text-blue-600 font-medium hover:underline"
                        >
                            + Add more
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 border rounded-lg py-2">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gray-700 text-white rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader size="sm" /> : serviceToEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;
