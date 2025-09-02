"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";

const AddProducts = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);
    const [variations, setVariations] = useState([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        subcategoryId: "",
        description: "",
        image: null,
        active: true,
        colors: [],      // <--- initialize as empty array
  sizes: []
    });
    const [editProductData, setEditProductData] = useState({});
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setNewImage(file);
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    // ----------------- SEO Helpers -----------------
    const generateSlug = (name) => {
        return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    const generateMetaTitle = (name) => {
        return `${name} | YourStore`;
    };

    const generateMetaDescription = (description) => {
        if (description) return description.substring(0, 150);
        return "Shop the best products online at YourStore.";
    };
    // -----------------------------------------------

    const handleAddProduct = async () => {
        // Required fields validation
        if (!newProduct.name.trim() || !newProduct.subcategoryId)
            return toast.error("Name and subcategory are required");

        // Image upload
        let imageUrl = null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        // Prepare product data dynamically
        const productData = {
            name: newProduct.name.trim(),
            subcategoryId: parseInt(newProduct.subcategoryId),
            description: newProduct.description || null,
            image: imageUrl,
            active: newProduct.active ?? true,
            slug: generateSlug(newProduct.name),
            metaTitle: generateMetaTitle(newProduct.name),
            metaDescription: generateMetaDescription(newProduct.description),
            // Optional / dynamic fields
            price: newProduct.price ?? null,
            stock: newProduct.stock ?? null,
            size: newProduct.size || null,
            color: newProduct.color || null,
            waxType: newProduct.waxType || null,
        };

        try {
            await dispatch(createProduct(productData)).unwrap();
            toast.success("Product added successfully");

            // Reset state
            setNewProduct({
                name: "",
                subcategoryId: "",
                description: "",
                image: null,
                active: true,
                price: null,
                stock: null,
                size: "",
                color: "",
                waxType: "",
            });
            setNewImage(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add product");
        }
    };


    const handleEditProduct = async () => {
        if (!editProductData.name.trim() || !editProductData.subcategoryId)
            return toast.error("Name and subcategory are required");

        let imageUrl = editProductData.image ?? null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        const productData = {
            id: editProductData.id,
            name: editProductData.name.trim(),
            subcategoryId: parseInt(editProductData.subcategoryId),
            description: editProductData.description,
            image: imageUrl,
            active: editProductData.active,
            slug: generateSlug(editProductData.name),
            metaTitle: generateMetaTitle(editProductData.name),
            metaDescription: generateMetaDescription(editProductData.description),
        };

        try {
            await dispatch(updateProduct(productData)).unwrap();
            toast.success("Product updated successfully");
            setEditModalOpen(false);
            setEditProductData({});
            setNewImage(null);
        } catch (err) {
            toast.error(err.message || "Failed to update product");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteProduct(deleteProductId)).unwrap();
            toast.success("Product deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete product");
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            await dispatch(updateProduct({ id, active: !currentActive })).unwrap();
            toast.success("Product status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sku Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4">{p.name}</td>
                                    <td className="px-6 py-4">{p.sku}</td>
                                    <td className="px-6 py-4">
                                        {p.image ? (
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={p.image.startsWith("http") ? p.image : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${p.image}`}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td className="px-6 py-4">{p.description || "-"}</td>
                                    <td className="px-6 py-4">{subcategories.find(s => s.id === p.subcategoryId)?.name || "-"}</td>
                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={p.active}
                                                onChange={() => toggleActive(p.id, p.active)}
                                                className="sr-only"
                                            />
                                            <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${p.active ? "bg-green-500" : "bg-gray-300"}`}>
                                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${p.active ? "translate-x-6" : "translate-x-0"}`} />
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditProductData({ ...p });
                                                setNewImage(null);
                                                setEditModalOpen(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => { setDeleteProductId(p.id); setDeleteModalOpen(true); }}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {(modalOpen || editModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6 md:p-8 relative animate-fade-in overflow-auto max-h-[90vh]">

                        {/* Close Button */}
                        <button
                            onClick={() => { setModalOpen(false); setEditModalOpen(false); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Title */}
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                            {modalOpen ? "Add New Product" : "Edit Product"}
                        </h2>


                        <div className="mb-4">
                            <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Colors & Images</h3>
                            {newProduct.colors.map((c, idx) => (
                                <div key={idx} className="flex gap-3 items-center mb-2">
                                    <input
                                        type="color"
                                        value={c.color}
                                        onChange={(e) => {
                                            const updatedColors = [...newProduct.colors];
                                            updatedColors[idx].color = e.target.value;
                                            setNewProduct({ ...newProduct, colors: updatedColors });
                                        }}
                                        className="w-10 h-10 border rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const updatedColors = [...newProduct.colors];
                                            updatedColors[idx].image = e.target.files[0];
                                            setNewProduct({ ...newProduct, colors: updatedColors });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedColors = newProduct.colors.filter((_, i) => i !== idx);
                                            setNewProduct({ ...newProduct, colors: updatedColors });
                                        }}
                                        className="text-red-500 px-2 py-1 border rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setNewProduct({ ...newProduct, colors: [...newProduct.colors, { color: "#ffffff", image: null }] })}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                            >
                                Add Color
                            </button>
                        </div>

                        {/* Dynamic Size Mapping */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Sizes & Stock</h3>
                            {newProduct.sizes.map((s, idx) => (
                                <div key={idx} className="flex gap-3 items-center mb-2">
                                    <select
                                        value={s.size}
                                        onChange={(e) => {
                                            const updatedSizes = [...newProduct.sizes];
                                            updatedSizes[idx].size = e.target.value;
                                            setNewProduct({ ...newProduct, sizes: updatedSizes });
                                        }}
                                        className="border rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={s.stock}
                                        onChange={(e) => {
                                            const updatedSizes = [...newProduct.sizes];
                                            updatedSizes[idx].stock = parseInt(e.target.value);
                                            setNewProduct({ ...newProduct, sizes: updatedSizes });
                                        }}
                                        className="border rounded-lg px-3 py-2 w-24"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedSizes = newProduct.sizes.filter((_, i) => i !== idx);
                                            setNewProduct({ ...newProduct, sizes: updatedSizes });
                                        }}
                                        className="text-red-500 px-2 py-1 border rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, { size: "", stock: 0 }] })}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                            >
                                Add Size
                            </button>
                        </div>


                        {/* Form */}
                        <form className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Product Name */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        value={modalOpen ? newProduct.name : editProductData.name || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, name: e.target.value })
                                            : setEditProductData({ ...editProductData, name: e.target.value })}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    />
                                </div>

                                {/* Category */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                    <select
                                        value={modalOpen ? newProduct.category : editProductData.category || ""}
                                        onChange={(e) => {
                                            if (modalOpen) {
                                                setNewProduct({ ...newProduct, category: e.target.value, subcategoryId: "", waxType: "" });
                                            } else {
                                                setEditProductData({ ...editProductData, category: e.target.value, subcategoryId: "", waxType: "" });
                                            }
                                        }}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Conditional Subcategory */}
                                {(modalOpen ? newProduct.category : editProductData.category) &&
                                    subcategories.filter(s => s.categoryId == (modalOpen ? newProduct.category : editProductData.category)).length > 0 && (
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
                                            <select
                                                value={modalOpen ? newProduct.subcategoryId : editProductData.subcategoryId || ""}
                                                onChange={(e) => modalOpen
                                                    ? setNewProduct({ ...newProduct, subcategoryId: e.target.value })
                                                    : setEditProductData({ ...editProductData, subcategoryId: e.target.value })}
                                                className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                            >
                                                <option value="">Select Subcategory</option>
                                                {(modalOpen ? newProduct.category : editProductData.category) &&
                                                    subcategories.filter(s => s.categoryId == (modalOpen ? newProduct.category : editProductData.category))
                                                        .map(sub => (
                                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                        ))
                                                }
                                            </select>
                                        </div>
                                    )}

                                {/* Price */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={modalOpen ? newProduct.price || "" : editProductData.price || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                                            : setEditProductData({ ...editProductData, price: parseFloat(e.target.value) })}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    />
                                </div>

                                {/* Stock */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Available stock"
                                        value={modalOpen ? newProduct.stock || "" : editProductData.stock || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
                                            : setEditProductData({ ...editProductData, stock: parseInt(e.target.value) })}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    />
                                </div>

                                {/* Size */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
                                    <select
                                        value={modalOpen ? newProduct.size : editProductData.size || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, size: e.target.value })
                                            : setEditProductData({ ...editProductData, size: e.target.value })}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    >
                                        <option value="">Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>

                                {/* Color & Wax Type in same row */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                                    <select
                                        value={modalOpen ? newProduct.color : editProductData.color || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, color: e.target.value })
                                            : setEditProductData({ ...editProductData, color: e.target.value })
                                        }
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    >
                                        <option value="">Select Color</option>
                                        <option value="Red">Red</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Green">Green</option>
                                        <option value="Black">Black</option>
                                    </select>
                                </div>

                                {/* Wax Type */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wax Type</label>
                                    <select
                                        value={modalOpen ? newProduct.waxType : editProductData.waxType || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, waxType: e.target.value })
                                            : setEditProductData({ ...editProductData, waxType: e.target.value })
                                        }
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                    >
                                        <option value="">Select Wax Type</option>
                                        <option value="soy_blended">Soy Blended Wax</option>
                                        <option value="pure_soy">Pure Soy Wax</option>
                                        <option value="pure_beeswax">Pure Beeswax</option>
                                    </select>
                                </div>



                                {/* Description */}
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        placeholder="Enter product description"
                                        value={modalOpen ? newProduct.description : editProductData.description || ""}
                                        onChange={(e) => modalOpen
                                            ? setNewProduct({ ...newProduct, description: e.target.value })
                                            : setEditProductData({ ...editProductData, description: e.target.value })}
                                        className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-2 cursor-pointer text-gray-900 dark:text-white"
                                    />
                                    {(modalOpen ? (newProduct.image || newImage) : (editProductData.image || newImage)) && (
                                        <div className="mt-3 w-40 h-40 md:w-48 md:h-48 mx-auto relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <Image
                                                src={
                                                    newImage
                                                        ? URL.createObjectURL(newImage) // live preview for new image
                                                        : (modalOpen ? newProduct.image : editProductData.image)?.startsWith("http")
                                                            ? (modalOpen ? newProduct.image : editProductData.image)
                                                            : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${editProductData.image}`
                                                }
                                                alt={modalOpen ? newProduct.name : editProductData.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row justify-end gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={() => { setModalOpen(false); setEditModalOpen(false); }}
                                    className="px-5 py-2 rounded-lg border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={modalOpen ? handleAddProduct : handleEditProduct}
                                    className="px-5 py-2 rounded-lg bg-black dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-black transition"
                                >
                                    {loading ? (modalOpen ? "Adding..." : "Updating...") : (modalOpen ? "Add" : "Update")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}







            {/* Delete Modal */}
            {
                deleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                            <p className="mb-6 text-gray-600">Are you sure you want to delete this product?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </DefaultPageAdmin >
    );
};

export default AddProducts;
