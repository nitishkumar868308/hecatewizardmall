"use client";
import { X } from "lucide-react";

const DeleteSkuMappingModal = ({ open, onClose, data, onDelete }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Delete Mapping
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                    Are you sure you want to delete this SKU mapping?
                </p>

                <div className="flex gap-3 justify-end">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onDelete(data)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteSkuMappingModal;