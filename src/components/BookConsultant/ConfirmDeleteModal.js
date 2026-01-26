// components/BookConsultant/ConfirmDeleteModal.js
"use client";
import React from "react";
import { X, Trash2 } from "lucide-react";
import Loader from "../Include/Loader";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <p className="mt-4 text-gray-600">
                    Are you sure you want to delete this ? This action cannot be undone.
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border rounded-lg py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader size="sm" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={18} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
