// "use client";
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const VariationsSection = ({
//     currentVariations,
//     expandedVariations,
//     toggleExpand,
//     removeVariation,
//     variationDetails,
//     handleVariationChange,
//     productFields = [],
//     handleImageUpload,
// }) => {
//     const [uploading, setUploading] = useState(false);

//     const normalizeImages = (images) => {
//         if (!images) return [];
//         if (Array.isArray(images)) {
//             return images.map((url) => String(url).trim()).filter(Boolean);
//         }
//         if (typeof images === "string") {
//             return images.split(",").map((url) => url.trim()).filter(Boolean);
//         }
//         return [];
//     };
//     return (
//         <div className="max-h-[600px] overflow-y-auto space-y-5 p-2 sm:p-4">
//             {currentVariations.map((variation) => {
//                 const variationKey = JSON.stringify(variation);

//                 return (
//                     <div
//                         key={variationKey}
//                         className="border border-gray-200 rounded-3xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300"
//                     >
//                         {/* Header */}
//                         <div
//                             className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 cursor-pointer transition-all duration-300"
//                             onClick={() => toggleExpand(variationKey)}
//                         >
//                             <span className="font-semibold text-gray-800 text-base sm:text-lg">
//                                 {Object.values(variation).join(" / ")}
//                             </span>
//                             <div className="flex items-center gap-4">
//                                 <span className="text-xl font-bold text-gray-700">
//                                     {expandedVariations[variationKey] ? "−" : "+"}
//                                 </span>
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         removeVariation(variationKey);
//                                     }}
//                                     className="text-gray-600 hover:gray-red-800 font-semibold text-sm px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Expanded Section */}
//                         <AnimatePresence initial={false}>
//                             {expandedVariations[variationKey] && (
//                                 <motion.div
//                                     key="content"
//                                     initial={{ height: 0, opacity: 0 }}
//                                     animate={{ height: "auto", opacity: 1 }}
//                                     exit={{ height: 0, opacity: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="p-6 bg-gray-50 border-t grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-b-3xl"
//                                 >
//                                     {productFields.map((field) => {
//                                         if (field.key === "category" || field.key === "subcategory")
//                                             return null;

//                                         const value =
//                                             field.type === "file"
//                                                 ? variationDetails[variationKey]?.[field.key]
//                                                 : variationDetails[variationKey]?.[field.key] ?? "";

//                                         if (field.type === "textarea") {
//                                             return (
//                                                 <div key={field.key} className="flex flex-col space-y-2">
//                                                     <label className="text-sm font-medium text-gray-700">
//                                                         {field.placeholder}
//                                                     </label>
//                                                     <textarea
//                                                         placeholder={field.placeholder}
//                                                         value={value || ""}
//                                                         onChange={(e) =>
//                                                             handleVariationChange(
//                                                                 variationKey,
//                                                                 field.key,
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//                                                         rows={3}
//                                                     />
//                                                 </div>
//                                             );
//                                         } else if (field.type === "file") {
//                                             return (
//                                                 <div key={field.key} className="flex flex-col space-y-2">
//                                                     <label className="text-sm font-medium text-gray-700">
//                                                         {field.placeholder}
//                                                     </label>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         multiple
//                                                         className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 
//                                      file:rounded-full file:border-0 
//                                      file:text-sm file:font-medium
//                                      file:bg-blue-50 file:text-blue-600
//                                      hover:file:bg-blue-100 cursor-pointer transition"
//                                                         onChange={async (e) => {
//                                                             const files = Array.from(e.target.files || []);
//                                                             if (!files.length) return;

//                                                             try {
//                                                                 setUploading(true);
//                                                                 const uploadedUrls = [];
//                                                                 for (let file of files) {
//                                                                     const uploadedUrl = await handleImageUpload(file);
//                                                                     uploadedUrls.push(uploadedUrl);
//                                                                 }
//                                                                 handleVariationChange(variationKey, "images", uploadedUrls);
//                                                             } catch (err) {
//                                                                 console.error(err);
//                                                             } finally {
//                                                                 setUploading(false);
//                                                             }
//                                                         }}
//                                                     />

//                                                     {uploading && (
//                                                         <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-2xl">
//                                                             <div className="flex flex-col items-center gap-2">
//                                                                 {/* Spinner */}
//                                                                 <div className="w-12 h-12 border-4 border-t-black border-b-black border-l-white border-r-white rounded-full animate-spin"></div>
//                                                                 <span className="text-black font-semibold text-sm">Uploading...</span>
//                                                             </div>
//                                                         </div>
//                                                     )}


//                                                     {/* <div className="flex flex-wrap gap-2">
//                                                         {variationDetails[variationKey]?.images?.map((imgUrl, idx) => (
//                                                             <img
//                                                                 key={idx}
//                                                                 src={imgUrl}
//                                                                 alt={`Preview ${idx}`}
//                                                                 className="w-[32%] h-32 object-cover rounded-2xl border shadow-md"
//                                                             />
//                                                         ))}
//                                                     </div> */}
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {(Array.isArray(variationDetails[variationKey]?.images)
//                                                             ? variationDetails[variationKey].images
//                                                             : (variationDetails[variationKey]?.images || "").split(",")
//                                                         )
//                                                             .filter((url) => url.trim() !== "") // remove empty
//                                                             .map((imgUrl, idx) => (
//                                                                 <img
//                                                                     key={idx}
//                                                                     src={imgUrl.trim()}
//                                                                     alt={`Preview ${idx}`}
//                                                                     className="w-[32%] h-32 object-cover rounded-2xl border shadow-md"
//                                                                 />
//                                                             ))}
//                                                     </div>

//                                                     {/* <div className="flex flex-wrap gap-2">
//                                                         {variationDetails[variationKey]?.images?.map((imgUrl, idx) => (
//                                                             <div key={idx} className="relative w-[32%]">
//                                                                 <img
//                                                                     src={imgUrl}
//                                                                     alt={`Preview ${idx}`}
//                                                                     className="w-full h-32 object-cover rounded-2xl border shadow-md"
//                                                                 />
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => {
//                                                                         const newImages = variationDetails[variationKey].images.filter((_, i) => i !== idx);
//                                                                         handleVariationChange(variationKey, "images", newImages);
//                                                                     }}
//                                                                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-800 transition"
//                                                                 >
//                                                                     ×
//                                                                 </button>
//                                                             </div>
//                                                         ))}
//                                                     </div> */}



//                                                 </div>
//                                             );
//                                         } else {
//                                             return (
//                                                 <div key={field.key} className="flex flex-col space-y-2">
//                                                     <label className="text-sm font-medium text-gray-700">
//                                                         {field.placeholder}
//                                                     </label>
//                                                     <input
//                                                         type={field.type}
//                                                         placeholder={field.placeholder}
//                                                         value={value || ""}
//                                                         onChange={(e) =>
//                                                             handleVariationChange(
//                                                                 variationKey,
//                                                                 field.key,
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//                                                     />
//                                                 </div>
//                                             );
//                                         }
//                                     })}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default VariationsSection;

"use client";
import React, { useState } from "react";
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
    const [uploading, setUploading] = useState(false);

    // ---- Helper: normalize images to array of strings ----
   const normalizeImages = (images) => {
    if (!images) return [];

    // Agar nested array hai [[...]]
    if (Array.isArray(images) && images.length === 1 && Array.isArray(images[0])) {
        return images[0];
    }

    // Agar normal array hai
    if (Array.isArray(images)) return images;

    // Agar string aa rahi hai {..,..}
    let cleaned = images;
    if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        cleaned = cleaned.slice(1, -1);
    }

    return cleaned.split(",").map(url => url.trim()).filter(url => url !== "");
};



    const test = "{/uploads/products/1758699041089-image24.jpg,/uploads/products/1758699041375-image23.jpg}";
    console.log("normalizeImages:", normalizeImages(test));


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
                                    className="text-gray-600 hover:text-red-800 font-semibold text-sm px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition"
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
                                        if (field.key === "category" || field.key === "subcategory") return null;

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
                                                            handleVariationChange(variationKey, field.key, e.target.value)
                                                        }
                                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                                        rows={3}
                                                    />
                                                </div>
                                            );
                                        } else if (field.type === "file") {
                                            const imagesArr = normalizeImages(variationDetails[variationKey]?.images);

                                            return (
                                                <div key={field.key} className="flex flex-col space-y-2 relative">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.placeholder}
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 
                                                        file:rounded-full file:border-0 
                                                        file:text-sm file:font-medium
                                                        file:bg-blue-50 file:text-blue-600
                                                        hover:file:bg-blue-100 cursor-pointer transition"
                                                        onChange={async (e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            if (!files.length) return;

                                                            try {
                                                                setUploading(true);
                                                                const uploadedUrls = [];
                                                                for (let file of files) {
                                                                    const uploadedUrl = await handleImageUpload(file);
                                                                    uploadedUrls.push(uploadedUrl);
                                                                }
                                                                // merge existing + new
                                                                const merged = [...imagesArr, ...uploadedUrls];
                                                                handleVariationChange(variationKey, "images", merged);
                                                            } catch (err) {
                                                                console.error(err);
                                                            } finally {
                                                                setUploading(false);
                                                            }
                                                        }}
                                                    />

                                                    {uploading && (
                                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-2xl">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-12 h-12 border-4 border-t-black border-b-black border-l-white border-r-white rounded-full animate-spin"></div>
                                                                <span className="text-black font-semibold text-sm">
                                                                    Uploading...
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Preview */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {normalizeImages(variationDetails[variationKey]?.images).map((imgUrl, idx) => (
                                                            <div key={idx} className="relative w-[32%]">
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={`Preview ${idx}`}
                                                                    className="w-full h-32 object-cover rounded-2xl border shadow-md"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newImages = normalizeImages(variationDetails[variationKey]?.images).filter((_, i) => i !== idx);
                                                                        handleVariationChange(variationKey, "images", newImages);
                                                                    }}
                                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-800 transition"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>


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
                                                            handleVariationChange(variationKey, field.key, e.target.value)
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

