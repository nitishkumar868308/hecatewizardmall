"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { createDuration, updateDuration } from "@/app/redux/slices/book_consultant/duration/durationSlice";
import toast from "react-hot-toast";
import Loader from "../Include/Loader";

const DurationModal = ({ isOpen, onClose, durationToEdit }) => { // <- receive props
    const dispatch = useDispatch();

    const [minutes, setMinutes] = useState("15");
    const [customMinutes, setCustomMinutes] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    // Pre-fill data if edit
    useEffect(() => {
        if (durationToEdit) {
            setMinutes(durationToEdit.minutes.toString());
            setDescription(durationToEdit.description || "");
            if (![15,30,60].includes(durationToEdit.minutes)) {
                setMinutes("custom");
                setCustomMinutes(durationToEdit.minutes);
            }
        } else {
            setMinutes("15");
            setCustomMinutes("");
            setDescription("");
        }
    }, [durationToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const finalMinutes = minutes === "custom" ? Number(customMinutes) : Number(minutes);

        if (minutes === "custom" && !customMinutes) {
            toast.error("Custom minutes cannot be empty");
            return;
        }

        if (!finalMinutes || finalMinutes <= 0) {
            toast.error("Please enter valid minutes");
            return;
        }

        setLoading(true);

        try {
            if (durationToEdit) {
                // Edit mode
                const res = await dispatch(updateDuration({
                    id: durationToEdit.id,
                    minutes: finalMinutes,
                    description,
                })).unwrap();
                toast.success(res?.message || "Duration updated successfully");
            } else {
                // Add mode
                const res = await dispatch(createDuration({
                    minutes: finalMinutes,
                    description,
                })).unwrap();
                toast.success(res?.message || "Duration created successfully");
            }

            // Reset
            setMinutes("15");
            setCustomMinutes("");
            setDescription("");
            onClose();
        } catch (error) {
            // Backend error
            toast.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xl font-semibold">
                        {durationToEdit ? "Edit Duration" : "Add New Duration"}
                    </h3>
                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <select
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="w-full rounded-lg border p-2.5"
                    >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">60 Minutes</option>
                        <option value="custom">Custom</option>
                    </select>

                    {minutes === "custom" && (
                        <input
                            type="number"
                            min="1"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            className="w-full rounded-lg border p-2.5"
                            placeholder="Enter minutes"
                        />
                    )}

                    <textarea
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg border p-2.5"
                        placeholder="Description (optional)"
                    />
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 border rounded-lg py-2">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gray-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader size="sm" />
                                Saving...
                            </>
                        ) : (
                            durationToEdit ? "Update Duration" : "Save Duration"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DurationModal;
