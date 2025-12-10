"use client";
import React, { useState, useEffect, useRef } from "react";
import MultiSelectDropdown from "@/components/Custom/MultiSelectDropdown";
import RichTextEditor from "@/components/Custom/RichTextEditor";
import { FiX } from "react-icons/fi";
import {
    fetchTags,
    createTag,
} from "@/app/redux/slices/tag/tagSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";

const ProductForm = ({
    editModalOpen,
    newProduct,
    setNewProduct,
    editProductData,
    setEditProductData,
    productOffers,
    newImage,
    setNewImage,
    categories = [],
    subcategories = [],
}) => {
    const { tags } = useSelector((state) => state.tags);
    const dispatch = useDispatch();
    const isEdit = editModalOpen;
    const currentData = isEdit ? editProductData : newProduct;
    const setCurrentData = isEdit ? setEditProductData : setNewProduct;
    console.log("productOffers", productOffers)
    console.log("currentData", currentData)
    const [search, setSearch] = useState("");
    const [filteredTags, setFilteredTags] = useState([]);
    const [platform, setPlatform] = useState([]);
    const { states } = useSelector((state) => state.states);
    useEffect(() => {
        dispatch(fetchStates())
        dispatch(fetchTags());
    }, [dispatch]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedStates, setSelectedStates] = useState([]);
    const dropdownRef = useRef(null);
    const [open, setOpen] = useState(false);
    const editDropdownRef = useRef(null);
    const [editStateOpen, setEditStateOpen] = useState(false);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleState = (id) => {
        if (selectedStates.includes(id)) {
            setSelectedStates(selectedStates.filter((s) => s !== id));
        } else {
            setSelectedStates([...selectedStates, id]);
        }
    };
    const safePlatform = currentData.platform || [];

    const handlePlatformChange = (value) => {
        const currentPlatform = currentData.platform || [];

        const updated = currentPlatform.includes(value)
            ? currentPlatform.filter((p) => p !== value)
            : [...currentPlatform, value];

        setCurrentData({
            ...currentData,
            platform: updated,
        });
    };


    // useEffect(() => {
    //     if (isEdit && editProductData) {
    //         setCurrentData((prev) => ({
    //             ...prev,
    //             ...editProductData,
    //             tags: (editProductData.tags || []).map((t) =>
    //                 typeof t === "string"
    //                     ? { id: t, name: t }
    //                     : { id: t.id, name: t.name }
    //             ),
    //         }));
    //     }
    // }, [isEdit, editModalOpen]);
    // useEffect(() => {
    //     if (isEdit && editProductData) {
    //         setCurrentData((prev) => ({
    //             ...prev,
    //             ...editProductData,
    //             tags: (editProductData.tags || []).map((t) =>
    //                 typeof t === "string" ? { id: t, name: t } : { id: t.id, name: t.name }
    //             ),
    //             offers: (editProductData.offers || []).map((o) =>
    //                 typeof o === "string"
    //                     ? { id: Number(o), name: productOffers.find(p => p.id === Number(o))?.name || "Unknown" }
    //                     : { id: o.id, name: o.name }
    //             ),
    //             primaryOffer: editProductData.primaryOffer
    //                 ? {
    //                     id: editProductData.primaryOffer.id,
    //                     name: editProductData.primaryOffer.name,
    //                 }
    //                 : null,
    //         }));
    //     }
    // }, [isEdit, editModalOpen, editProductData, productOffers]);
    useEffect(() => {
        if (isEdit && editModalOpen && editProductData) {
            setCurrentData({
                ...editProductData,
                tags: (editProductData.tags || []).map((t) =>
                    typeof t === "string" ? { id: t, name: t } : { id: t.id, name: t.name }
                ),
                offers: (editProductData.offers || []).map((o) =>
                    typeof o === "string"
                        ? {
                            id: Number(o),
                            name:
                                productOffers.find((p) => p.id === Number(o))?.name ||
                                "Unknown",
                        }
                        : { id: o.id, name: o.name }
                ),
                primaryOffer: editProductData.primaryOffer
                    ? {
                        id: editProductData.primaryOffer.id,
                        name: editProductData.primaryOffer.name,
                    }
                    : null,
                "fnsku-code": editProductData.barCode || ""
            });
        }
    }, [editModalOpen, isEdit]);


    console.log("editProductData", editProductData);

    // Add tag to product
    const addTag = (tagName) => {
        if (!tagName?.trim()) {
            toast.error("Tag Name is required...");
            return;
        }

        // Check if already selected
        if (currentData.tags?.some((t) => t.name === tagName)) {
            toast.error("Tag already added!");
            return;
        }

        // Check if tag exists in DB (filteredTags from Redux)
        const existingTag = filteredTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());

        if (existingTag) {
            // Just add existing tag to selected tags
            setCurrentData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), existingTag],
            }));
        } else {
            // Create new tag in DB
            dispatch(createTag({ name: tagName }))
                .unwrap()
                .then((newTag) => {
                    setCurrentData((prev) => ({
                        ...prev,
                        tags: [...(prev.tags || []), newTag],
                    }));
                })
                .catch((err) => {
                    console.error("Failed to add tag:", err);
                    toast.error(err?.message || "Failed to add tag");
                });
        }

        setSearch("");
        setFilteredTags([]);
    };


    // Remove tag from product
    const removeTag = (tag) => {
        setCurrentData({
            ...currentData,
            tags: (currentData.tags || []).filter((t) => t.id !== tag.id),
        });
    };


    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg h-full mx-auto max-h-[90vh] md:max-h-[75vh] overflow-y-auto">

            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Product Details</h3>
            <div className="mb-6">
                <p className="font-semibold mb-3 text-center text-gray-700">
                    Select Platform
                </p>

                <div className="flex items-center justify-center gap-10">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                        <input
                            type="checkbox"
                            checked={safePlatform.includes("xpress")}
                            onChange={() => handlePlatformChange("xpress")}
                            className="w-4 h-4"
                        />
                        <span>Hecate QuickGo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                        <input
                            type="checkbox"
                            checked={safePlatform.includes("website")}
                            onChange={() => handlePlatformChange("website")}
                            className="w-4 h-4"
                        />
                        <span>Hecate Wizard Mall</span>
                    </label>
                </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">



                {/* Product Name */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={currentData.name || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                {/* Short Description */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Short Description</label>
                    <input
                        type="text"
                        placeholder="Short Description"
                        value={currentData.short || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, short: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Category</label>
                    <select
                        value={currentData.categoryId || ""}
                        onChange={(e) =>
                            setCurrentData({
                                ...currentData,
                                categoryId: Number(e.target.value),
                                subcategoryId: "",
                            })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Subcategory */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Subcategory</label>
                    <select
                        value={currentData.subcategoryId || ""}
                        onChange={(e) =>
                            setCurrentData({
                                ...currentData,
                                subcategoryId: e.target.value ? Number(e.target.value) : "",
                            })
                        }
                        disabled={!currentData.categoryId}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                        <option value="">
                            {currentData.categoryId ? "Select Subcategory" : "Select Category first"}
                        </option>
                        {currentData.categoryId &&
                            subcategories
                                .filter(sub => sub.categoryId.toString() === currentData.categoryId.toString())
                                .map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                    </select>
                </div>

                {/* Price */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Price (INR)</label>
                    <input
                        type="number"
                        placeholder="Price (INR)"
                        value={currentData.price || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, price: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                {/* SKU */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">SKU</label>
                    <input
                        type="text"
                        placeholder="Enter SKU Detail"
                        value={currentData.sku || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, sku: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>


                {/* Stock */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        placeholder="Stock"
                        value={currentData.stock || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, stock: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                {/* Offers */}
                <div className="flex flex-col">
                    <MultiSelectDropdown
                        offers={productOffers}
                        currentData={currentData}
                        setCurrentData={setCurrentData}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col w-full relative">
                    <label className="mb-2 font-medium text-gray-700">Tags</label>

                    {/* Input + Add Button */}
                    <div className="flex gap-2 relative">
                        <input
                            type="text"
                            placeholder="Search tags"
                            value={search}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearch(val);

                                if (!val.trim()) {
                                    setFilteredTags([]);
                                    return;
                                }

                                // Filter tags from Redux that are not already selected
                                const filtered = tags.filter(
                                    (tag) =>
                                        tag.name.toLowerCase().includes(val.toLowerCase()) &&
                                        !(currentData.tags || []).some((t) => t.id === tag.id)
                                );
                                setFilteredTags(filtered);
                            }}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 cursor-pointer focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                        <button
                            type="button"
                            onClick={() => addTag(search)}
                            className="px-4 py-2 bg-gray-600 text-white cursor-pointer rounded-2xl hover:bg-gray-700 transition"
                        >
                            Add
                        </button>

                        {/* Dropdown */}
                        {filteredTags.length > 0 && (
                            <div className="absolute top-full left-0 z-50 w-full bg-white border border-gray-300 rounded-xl cursor-pointer shadow-lg max-h-60 overflow-y-auto mt-1">
                                {filteredTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                                        onClick={() => addTag(tag.name)}
                                    >
                                        {tag.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {(currentData.tags || []).map((tag) => (
                            <div
                                key={tag.id}
                                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                            >
                                <span>{tag.name}</span>
                                <button type="button" onClick={() => removeTag(tag)}>
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* {Bulk Price} */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Bulk Price</label>

                    <div className="flex gap-4">
                        {/* Minimum Quantity */}
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Min Quantity"
                                value={currentData.minQuantity || ""}
                                onChange={(e) =>
                                    setCurrentData({ ...currentData, minQuantity: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Price"
                                value={currentData.bulkPrice || ""}
                                onChange={(e) =>
                                    setCurrentData({ ...currentData, bulkPrice: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Description</label>
                    <RichTextEditor
                        value={currentData.description || ""}
                        onChange={(val) =>
                            setCurrentData({ ...currentData, description: val })
                        }
                    />
                </div>

                {/* <div className="flex-1">
                    <label className="mb-2 font-medium text-gray-700">Product Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                            setNewImage((prev = []) => [...prev, ...Array.from(e.target.files)])
                        }
                        className=" mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer transition"
                    />
                    <div className="flex gap-3 flex-wrap">
                        {newImage?.map((img, idx) => (
                            <div key={idx} className="relative w-32 h-32">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`Preview ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                                <button
                                    type="button"
                                    onClick={() => setNewImage((prev) => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {currentData?.image?.length > 0 &&
                            currentData.image.map((img, idx) => (
                                <div key={idx} className="relative w-32 h-32">
                                    <img
                                        src={img}
                                        alt={`Product ${idx}`}
                                        className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentData((prev) => ({
                                                ...prev,
                                                image: prev.image?.filter((_, i) => i !== idx) || [],
                                            }))
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                    </div>

                </div> */}
                {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                </div> */}
                {/* Select States */}
                {/* <div className="flex flex-col">
                        <div className="mb-4 relative" ref={dropdownRef}>
                            <label className="block font-medium text-gray-700 mb-2">Select States</label>

                            <div
                                className="border rounded-lg px-4 py-2 w-full cursor-pointer flex justify-between items-center"
                                onClick={() => setOpen(!open)}
                            >
                                <span>
                                    {selectedStates.length > 0
                                        ? states
                                            .filter((s) => selectedStates.includes(s.id))
                                            .map((s) => s.name)
                                            .join(", ")
                                        : "-- Select States --"}
                                </span>
                                <span>▾</span>
                            </div>

                            {open && (
                                <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {states.map((st) => (
                                        <label
                                            key={st.id}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={st.id}
                                                checked={selectedStates.includes(st.id)}
                                                onChange={() => toggleState(st.id)}
                                                className="h-4 w-4"
                                            />
                                            {st.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div> */}

                {/* Hecate QuickGo Stock */}
                {/* <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">Hecate QuickGo Stock</label>
                        <input
                            type="number"
                            placeholder="Hecate QuickGo Stock"
                            value={currentData["hecate-quickgo-stock"] || ""}
                            onChange={(e) =>
                                setCurrentData({
                                    ...currentData,
                                    ["hecate-quickgo-stock"]: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                    </div> */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">MRP</label>
                        <input
                            type="number"
                            placeholder="MRP"
                            value={currentData["MRP"] || ""}
                            onChange={(e) =>
                                setCurrentData({
                                    ...currentData,
                                    ["MRP"]: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                    </div>


                    {/* FNSKU */}
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">FNSKU</label>
                        <input
                            type="text"
                            placeholder="FNSKU"
                            value={currentData["fnsku-code"] || ""}
                            onChange={(e) =>
                                setCurrentData({
                                    ...currentData,
                                    ["fnsku-code"]: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                    </div>
                </div>


                <div className="flex-1">
                    <label className="block mb-2 font-medium text-gray-700">
                        Product Images
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                            setNewImage((prev = []) => [...prev, ...Array.from(e.target.files)])
                        }
                        className="block mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-full
                            file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 
                            hover:file:bg-blue-100 cursor-pointer transition"
                    />

                    <div className="flex gap-3 flex-wrap mt-2">
                        {/* Preview new images */}
                        {newImage?.map((img, idx) => (
                            <div key={idx} className="relative w-32 h-32">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`Preview ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNewImage((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full
                                        w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Existing DB images */}
                        {currentData?.image?.length > 0 &&
                            currentData.image.map((img, idx) => (
                                <div key={idx} className="relative w-32 h-32">
                                    <img
                                        src={img}
                                        alt={`Product ${idx}`}
                                        className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentData((prev) => ({
                                                ...prev,
                                                image: prev.image?.filter((_, i) => i !== idx) || [],
                                            }))
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full
                                            w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>





            </form>
        </div>
    );
};

export default ProductForm;












<div className="flex-1 overflow-y-auto space-y-5 pr-2">
    {userCartCount > 0 ? (


        platformItems.map((item, index) => {
            const fullProduct = products.find(p => p.id === item.productId);
            if (!fullProduct) return null;

            const baseVariation =
                fullProduct?.variations?.find(v => v.id === item.variationId) ||
                fullProduct?.selectedVariation ||
                null;
            console.log("baseVariation", baseVariation);

            const totalVariationQty = item.colors.reduce((s, c) => s + Number(c.quantity || 0), 0);
            const minCandidates = item.colors
                .map(c => Number(c.bulkMinQty || baseVariation?.minQuantity || fullProduct?.minQuantity || 0))
                .filter(v => v > 0);
            const minRequired = minCandidates.length ? Math.min(...minCandidates) : 0;
            const isVariationOfferActive = minRequired > 0 && totalVariationQty >= minRequired;

            const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

            return (
                <div
                    key={index}
                    className="relative border rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5"
                >
                    {/* HEADER (always visible) */}
                    <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => setExpanded(expanded === index ? null : index)}
                    >
                        <div>
                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                                {item.productName}
                            </h3>

                            {/* Attributes */}
                            <div className="mt-1 space-y-0.5">
                                {Object.entries(item.attributes || {})
                                    .filter(([k, v]) => k !== "color" && v !== null && v !== "")
                                    .map(([k, v], i) => (
                                        <div key={i} className="text-xs text-gray-500 capitalize">
                                            {k}: {v}
                                        </div>
                                    ))}
                            </div>

                            {/* Offer Label */}
                            {(isVariationOfferActive || item.productOfferApplied) && (
                                <div className="text-green-600 font-medium text-xs mt-1">
                                    {item.productOfferApplied ? "Range Offer Applied" : "Bulk Offer Applied"}
                                </div>
                            )}
                        </div>

                        <button className="text-xl font-bold select-none">
                            {expanded === index ? "−" : "+"}
                        </button>
                    </div>

                    {/* EXPANDED SECTION */}
                    {expanded === index && (
                        <div className="mt-4 border-t pt-4">
                            {/* ⭐⭐⭐ YOUR FULL ORIGINAL UI STARTS HERE ⭐⭐⭐ */}
                            {/* Offer Box */}
                            {isVariationOfferActive && (
                                <div className="border border-green-200 bg-green-50 rounded-lg p-2 sm:p-3 mb-4 text-green-800">
                                    <div className="font-medium text-sm mb-1">Active Bulk Offers:</div>
                                    <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5">
                                        {item.colors.map((c, i) => {
                                            const matchVar = findColorVariation(fullProduct, c, item);
                                            const bulkPrice = Number(
                                                c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? null
                                            );
                                            const minQty = Number(
                                                c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0
                                            );
                                            if (!bulkPrice || !minQty) return null;
                                            return (
                                                <li key={i}>
                                                    {c.color}: ₹{fmt(bulkPrice)} per item (Min {minQty})
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {item.productOfferApplied && (
                                <div className="border border-blue-200 bg-blue-50 rounded-lg p-2 sm:p-3 mb-4 text-blue-800">
                                    <div className="font-medium text-sm mb-1">Active Range Offer:</div>
                                    <ul className="list-disc list-inside text-xs sm:text-sm">
                                        <li>
                                            Buy {item.productOffer.discountValue.start}–{item.productOffer.discountValue.end}, Get {item.productOffer.discountValue.free} Free
                                        </li>
                                        <li>Free items: Lowest priced variations 🎁</li>
                                    </ul>
                                </div>
                            )}

                            {/* Variations */}
                            <div className="space-y-4">
                                {item.colors.map((c, idx) => {
                                    const matchVar = findColorVariation(fullProduct, c, item);
                                    const colorPrice = Number(c.pricePerItem ?? 0);
                                    const bulkPrice = Number(
                                        c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? 0
                                    );
                                    const minQty = Number(
                                        c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0
                                    );
                                    const isBulkActive = bulkPrice > 0 && totalVariationQty >= minQty;

                                    const originalTotal = colorPrice * Number(c.quantity);
                                    const discountedTotal = isBulkActive ? bulkPrice * Number(c.quantity) : originalTotal;
                                    const saved = isBulkActive ? (colorPrice - bulkPrice) * Number(c.quantity) : 0;

                                    return (
                                        <div key={idx} className="border-t border-gray-100 pt-3">
                                            {/* Variation UI */}
                                            {/* ... copy all your existing variation UI here exactly ... */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* FOOTER (collapsed state only) */}
                    <div className="flex justify-between items-center mt-4 border-t pt-3">
                        {/* LEFT — REMOVE BUTTON */}
                        <button
                            onClick={() => {
                                setSelectedItemId(item);
                                setIsConfirmOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            🗑 Remove
                        </button>

                        {/* CENTER — TOTAL QTY */}
                        <div className="text-center text-gray-700 font-semibold text-sm">
                            Total Qty:&nbsp;{item.colors.reduce((sum, c) => sum + Number(c.quantity), 0)}
                        </div>

                        {/* RIGHT — TOTAL PRICE */}
                        <div className="text-right text-sm font-bold text-gray-900">
                            {(() => {
                                const { totalOriginal, totalAfterOffer, savings } = getTotalDisplay(item, fullProduct);
                                return (
                                    <div className="flex flex-col items-end">
                                        <div>
                                            Total:&nbsp;
                                            {savings > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-400 mr-1">₹{fmt(totalOriginal)}</span>
                                                    <span className="text-green-700">₹{fmt(totalAfterOffer)} ✅</span>
                                                </>
                                            ) : (
                                                <span>₹{fmt(totalOriginal)}</span>
                                            )}
                                        </div>
                                        {savings > 0 && (
                                            <div className="text-xs text-green-600 font-semibold mt-1">
                                                Total Savings: ₹{fmt(savings)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            );
        })

    ) : (
        <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
    )}
</div >

{/* Checkout Button */ }
{
    userCartCount > 0 && (
        <div className="mt-4">
            <button
                onClick={() => {
                    setIsOpen(false);
                    router.push(`/checkout`);
                }}
                className="w-full bg-gray-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer"
            >
                Checkout
            </button>
        </div>
    )
}
