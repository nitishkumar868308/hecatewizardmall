"use client"
import React from "react";

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
        <div className="max-h-[400px] overflow-auto space-y-2">
            {currentVariations.map((variation) => {
                const variationKey = JSON.stringify(variation);

                return (
                    <div key={variationKey} className="border rounded-lg mb-2">

                        <div
                            className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                            onClick={() => toggleExpand(variationKey)}
                        >
                            <span>{Object.values(variation).join(" / ")}</span>
                            <div className="flex gap-2">
                                <span>{expandedVariations[variationKey] ? "-" : "+"}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeVariation(variationKey);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {expandedVariations[variationKey] && (
                            <div className="p-2 space-y-2 bg-gray-50">
                                {productFields.map((field) => {
                                    if (field.key === "category" || field.key === "subcategory")
                                        return null;

                                    const value =
                                        field.type === "file"
                                            ? variationDetails[variationKey]?.[field.key]
                                            : variationDetails[variationKey]?.[field.key] ?? "";

                                    if (field.type === "textarea") {
                                        return (
                                            <textarea
                                                key={field.key}
                                                placeholder={field.placeholder}
                                                value={value || ""}
                                                onChange={(e) =>
                                                    handleVariationChange(variationKey, field.key, e.target.value)
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                                            />
                                        );
                                    } else if (field.type === "file") {
                                        return (
                                            <div key={field.key}>
                                                <label className="block mb-1 font-medium">{field.placeholder}</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const uploadedUrl = await handleImageUpload(file);

                                                        handleVariationChange(variationKey, "image", uploadedUrl);
                                                    }}
                                                />
                                                {variationDetails[variationKey]?.preview && (
                                                    <img
                                                        src={variationDetails[variationKey].preview}
                                                        alt={variationKey}
                                                        className="w-32 h-32 object-cover mt-1 rounded-lg"
                                                    />
                                                )}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <input
                                                key={field.key}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={value || ""}
                                                onChange={(e) =>
                                                    handleVariationChange(variationKey, field.key, e.target.value)
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                                            />
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default VariationsSection;
