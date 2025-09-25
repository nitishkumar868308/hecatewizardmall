"use client";
import React, { useEffect } from "react";
import MultiSelectDropdown from "@/components/Custom/MultiSelectDropdown";

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
    const isEdit = editModalOpen;
    const currentData = isEdit ? editProductData : newProduct;
    const setCurrentData = isEdit ? setEditProductData : setNewProduct;
    console.log("productOffers", productOffers)
    console.log("currentData", currentData)

    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg max-w-7xl mx-auto max-h-[80vh] overflow-y-auto">

            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Product Details</h3>

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

                {/* Description */}
                <div className="col-span-1 md:col-span-2 flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Description</label>
                    <textarea
                        list="descOptions"
                        placeholder="Description"
                        value={currentData.description || ""}
                        onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(/'/g, "\\'");
                            setCurrentData({ ...currentData, description: sanitizedValue });
                        }}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        rows={4}
                    />

                    <datalist id="descOptions">
                        <option value="Gold" />
                        <option value="Italia" />
                        <option value="Other" />
                    </datalist>

                </div>

                {/* Images */}
                <div className="col-span-1 md:col-span-2 flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Product Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setNewImage(Array.from(e.target.files))}
                        className="mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer transition"
                    />
                    <div className="flex gap-3 flex-wrap">
                        {/* {newImage && newImage.length > 0
                            ? newImage.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={URL.createObjectURL(img)}
                                    alt={`Preview ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                            ))
                            : currentData.images &&
                            currentData.images.length > 0 &&
                            currentData.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Product ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                            ))} */}
                        {newImage?.length > 0 ? (
                            newImage.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={URL.createObjectURL(img)}
                                    alt={`Preview ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                            ))
                        ) : (
                            /* warna DB se aayi images show karo */
                            currentData.image?.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Product ${idx}`}
                                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border"
                                />
                            ))
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
