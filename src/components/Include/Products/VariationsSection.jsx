"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const VariationsSection = ({
    currentVariations,
    expandedVariations,
    toggleExpand,
    removeVariation,
    variationDetails,
    handleVariationChange,
    productFields = [],
    handleImageUpload,
}) => {
    return (
        <div className="max-h-[600px] overflow-y-auto space-y-5 p-2 sm:p-4">
            {currentVariations.map((variation) => {
                const variationKey = JSON.stringify(variation);

                return (
                    <div
                        key={variationKey}
                        className="border border-gray-200 rounded-3xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300"
                    >
                        {/* Header */}
                        <div
                            className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 cursor-pointer transition-all duration-300"
                            onClick={() => toggleExpand(variationKey)}
                        >
                            <span className="font-semibold text-gray-800 text-base sm:text-lg">
                                {Object.values(variation).join(" / ")}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-gray-700">
                                    {expandedVariations[variationKey] ? "−" : "+"}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeVariation(variationKey);
                                    }}
                                    className="text-red-600 hover:text-red-800 font-semibold text-sm px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Expanded Section */}
                        <AnimatePresence initial={false}>
                            {expandedVariations[variationKey] && (
                                <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 bg-gray-50 border-t grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-b-3xl"
                                >
                                    {productFields.map((field) => {
                                        if (field.key === "category" || field.key === "subcategory")
                                            return null;

                                        const value =
                                            field.type === "file"
                                                ? variationDetails[variationKey]?.[field.key]
                                                : variationDetails[variationKey]?.[field.key] ?? "";

                                        if (field.type === "textarea") {
                                            return (
                                                <div key={field.key} className="flex flex-col space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.placeholder}
                                                    </label>
                                                    <textarea
                                                        placeholder={field.placeholder}
                                                        value={value || ""}
                                                        onChange={(e) =>
                                                            handleVariationChange(
                                                                variationKey,
                                                                field.key,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                                        rows={3}
                                                    />
                                                </div>
                                            );
                                        } else if (field.type === "file") {
                                            return (
                                                <div key={field.key} className="flex flex-col space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.placeholder}
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 
                                     file:rounded-full file:border-0 
                                     file:text-sm file:font-medium
                                     file:bg-blue-50 file:text-blue-600
                                     hover:file:bg-blue-100 cursor-pointer transition"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            const uploadedUrl = await handleImageUpload(file);
                                                            handleVariationChange(
                                                                variationKey,
                                                                "image",
                                                                uploadedUrl
                                                            );
                                                        }}
                                                    />
                                                    {variationDetails[variationKey]?.preview && (
                                                        <img
                                                            src={variationDetails[variationKey].preview}
                                                            alt={variationKey}
                                                            className="w-36 h-36 object-cover rounded-2xl border shadow-md"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={field.key} className="flex flex-col space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.placeholder}
                                                    </label>
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        value={value || ""}
                                                        onChange={(e) =>
                                                            handleVariationChange(
                                                                variationKey,
                                                                field.key,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default VariationsSection;
