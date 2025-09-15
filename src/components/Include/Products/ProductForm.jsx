"use client"
import React from "react";
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
    console.log("categories", categories)
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>

            <form className="grid grid-cols-2 gap-4">

                {/* Product Name */}
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={currentData.name || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                {/* Short Description */}
                <div>
                    <label className="block mb-1 font-medium">Short Description</label>
                    <input
                        type="text"
                        placeholder="Short Description"
                        value={currentData.short || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, short: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                {/* Category & Subcategory */}
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={currentData.category || ""}
                        onChange={(e) =>
                            setCurrentData({
                                ...currentData,
                                category: Number(e.target.value),
                                subcategory: "",
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Subcategory</label>
                    <select
                        value={currentData.subcategoryId || ""}
                        onChange={(e) =>
                            setCurrentData({
                                ...currentData,
                                subcategoryId: e.target.value ? Number(e.target.value) : "",
                            })
                        }
                        disabled={!currentData.category}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">
                            {currentData.category
                                ? "Select Subcategory"
                                : "Select Category first"}
                        </option>
                        {currentData.category &&
                            subcategories
                                .filter(sub => sub.categoryId.toString() === currentData.category.toString())
                                .map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                    </select>
                </div>

                {/* Price & Stock */}
                <div>
                    <label className="block mb-1 font-medium">Price (INR)</label>
                    <input
                        type="number"
                        placeholder="Price (INR)"
                        value={currentData.price || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, price: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Other Countries Price</label>
                    <input
                        type="number"
                        placeholder="Price in INR for other countries"
                        value={currentData.otherCountriesPrice || ""}
                        onChange={(e) =>
                            setCurrentData({
                                ...currentData,
                                otherCountriesPrice: Number(e.target.value),
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Stock</label>
                    <input
                        type="number"
                        placeholder="Stock"
                        value={currentData.stock || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, stock: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                {/* Offers */}
                <MultiSelectDropdown
                    offers={productOffers}
                    currentData={currentData}
                    setCurrentData={setCurrentData}
                />

                {/* Description */}
                <div className="col-span-2">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        placeholder="Description"
                        value={currentData.description || ""}
                        onChange={(e) =>
                            setCurrentData({ ...currentData, description: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                {/* Images */}
                <div className="col-span-2">
                    <label className="block mb-1 font-medium">Product Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setNewImage(Array.from(e.target.files))}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {newImage && newImage.length > 0
                            ? newImage.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={URL.createObjectURL(img)}
                                    alt={`Preview ${idx}`}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            ))
                            : currentData.images &&
                            currentData.images.length > 0 &&
                            currentData.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Product ${idx}`}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
