"use client";
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-auto mt-15">
            <div className="relative w-full max-w-lg sm:max-w-md md:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-6">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white shadow-lg transition-colors duration-200 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;
