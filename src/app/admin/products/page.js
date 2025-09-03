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
import {
    fetchAttributes,
} from "@/app/redux/slices/attribute/attributeSlice";

const productFields = [
    { key: "name", type: "text", placeholder: "Product Name" },
    { key: "description", type: "textarea", placeholder: "Description" },
    { key: "price", type: "number", placeholder: "Price" },
    { key: "stock", type: "number", placeholder: "Stock" }, // optional
    { key: "image", type: "file", placeholder: "Product Image" },
    { key: "category", type: "select", placeholder: "Category" },
    { key: "subcategory", type: "select", placeholder: "Subcategory" }
];

const AddProducts = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const [activeSection, setActiveSection] = useState("product");
    const { categories } = useSelector((state) => state.category);
    const [variations, setVariations] = useState([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        category: "",
        subcategoryId: "",
        colors: [],
        sizes: []
    });
    const [editProductData, setEditProductData] = useState({});
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [attributess, setAttributess] = useState([]);
    const [attrName, setAttrName] = useState("");
    const [attrValues, setAttrValues] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState({});
    // Variations expanded state and details
    const [expandedVariations, setExpandedVariations] = useState({});
    const [variationDetails, setVariationDetails] = useState({}); // { "Red + S": {name, description, price, stock, image, preview} }
    const [currentVariations, setCurrentVariations] = useState([]);
    const [variationAttributes, setVariationAttributes] = useState({});
    const { attributes } = useSelector((state) => state.attributes);
    console.log("attributes", attributes)
    const [expandedAttrs, setExpandedAttrs] = useState({});

    useEffect(() => {
        dispatch(fetchAttributes())
        dispatch(fetchProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const attrValues = Object.values(selectedAttributes)
            .filter(a => a.values?.length)
            .map(a => a.values);

        if (attrValues.length === 0) {
            setCurrentVariations([]);
            return;
        }

        // Cartesian product of all attribute values
        const cartesian = (arr) =>
            arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

        const combinations = cartesian(attrValues);

        // Join each combination to a string to use as key
        const variationKeys = combinations.map(comb => comb.join(" / "));
        setCurrentVariations(variationKeys);

    }, [selectedAttributes]);

    const handleVariationChange = (variation, key, value) => {
        setVariationDetails(prev => ({
            ...prev,
            [variation]: {
                ...prev[variation],
                [key]: value,
            },
        }));
    };

    const handleVariationImage = (variation, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setVariationDetails(prev => ({
            ...prev,
            [variation]: {
                ...prev[variation],
                image: file,
                preview,
            },
        }));
    };

    const toggleExpand = (variation) => {
        setExpandedVariations(prev => ({
            ...prev,
            [variation]: !prev[variation],
        }));
    };

    const removeVariation = (variation) => {
        setCurrentVariations(prev => prev.filter(v => v !== variation));
        setVariationDetails(prev => {
            const copy = { ...prev };
            delete copy[variation];
            return copy;
        });
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
        if (!newProduct.name.trim() || !newProduct.subcategoryId) {
            return toast.error("Name and subcategory are required");
        }

        // Image preview URL (optional)
        let imageUrl = null;
        if (newImage) {
            imageUrl = URL.createObjectURL(newImage);
        }

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

        // For debugging: just log the data instead of calling API
        console.log("Product Data:", productData);
        toast.success("Check console for product data");

        // Optional: reset state if needed
        // setNewProduct({ ... });
        // setNewImage(null);
        // setModalOpen(false);
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

    // Decide whether modal is Add or Edit
    const handleSubmit = () => {
        if (editModalOpen) {
            handleEditProduct();
        } else {
            handleAddProduct();
        }
    };

    const filteredAttributes = attributes.filter(attr =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAttributeValue = (attrName, value) => {
        setSelectedAttributes((prev) => {
            const prevValues = prev[attrName]?.values || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter((v) => v !== value)
                : [...prevValues, value];

            return {
                ...prev,
                [attrName]: {
                    ...prev[attrName],
                    values: newValues,
                    searchTerm: prev[attrName]?.searchTerm || "",
                },
            };
        });
    };


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


            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 md:flex md:gap-6 animate-fade-in">

                        {/* Side Menu */}
                        <div className="md:w-1/4 mb-4 md:mb-0">
                            <h2 className="text-lg font-semibold mb-4">Sections</h2>
                            <ul className="space-y-2">
                                {["product", "attributes", "variations"].map((section) => (
                                    <li
                                        key={section}
                                        onClick={() => setActiveSection(section)}
                                        className={`cursor-pointer px-4 py-2 rounded-lg transition ${activeSection === section
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Form Content */}
                        <div className="md:w-3/4">

                            {/* Close Button */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 font-bold text-xl cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Decide which state to use */}
                            {activeSection === "product" && (() => {
                                const isEdit = editModalOpen;
                                const currentData = isEdit ? editProductData : newProduct;
                                const setCurrentData = isEdit ? setEditProductData : setNewProduct;

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

                                            {/* Category */}
                                            <div>
                                                <label className="block mb-1 font-medium">Category</label>
                                                <select
                                                    value={currentData.category || ""}
                                                    onChange={(e) =>
                                                        setCurrentData({
                                                            ...currentData,
                                                            category: Number(e.target.value),
                                                            subcategory: "" // reset subcategory
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

                                            {/* Subcategory */}
                                            <div>
                                                <label className="block mb-1 font-medium">Subcategory</label>
                                                <select
                                                    value={currentData.subcategory || ""}
                                                    onChange={(e) =>
                                                        setCurrentData({ ...currentData, subcategory: Number(e.target.value) })
                                                    }
                                                    disabled={!currentData.category}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                >
                                                    <option value="">
                                                        {currentData.category ? "Select Subcategory" : "Select Category first"}
                                                    </option>
                                                    {currentData.category &&
                                                        subcategories
                                                            .filter(sub => sub.categoryId === Number(currentData.category))
                                                            .map(sub => (
                                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                            ))
                                                    }
                                                </select>
                                            </div>




                                            {/* Price */}
                                            <div>
                                                <label className="block mb-1 font-medium">Price</label>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={currentData.price || ""}
                                                    onChange={(e) =>
                                                        setCurrentData({ ...currentData, price: e.target.value })
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                />
                                            </div>



                                            {/* Stock */}
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





                                            {/* Description */}
                                            <div>
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



                                            {/* Image Upload (full width) */}
                                            <div className="col-span-2">
                                                <label className="block mb-1 font-medium">Product Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setNewImage(e.target.files[0])}
                                                />
                                                {newImage ? (
                                                    <img
                                                        src={URL.createObjectURL(newImage)}
                                                        alt="Product Preview"
                                                        className="w-32 h-32 object-cover mt-2 rounded-lg"
                                                    />
                                                ) : currentData.image ? (
                                                    <img
                                                        src={currentData.image}
                                                        alt="Product"
                                                        className="w-32 h-32 object-cover mt-2 rounded-lg"
                                                    />
                                                ) : null}
                                            </div>

                                        </form>
                                    </div>
                                );
                            })()}



                            {/* Attributes Section */}
                            {activeSection === "attributes" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Attributes</h3>

                                    {/* Search Attributes */}
                                    <input
                                        type="text"
                                        placeholder="Search attributes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    <div className="space-y-2 max-h-[500px] overflow-auto">
                                        {filteredAttributes.length === 0 && (
                                            <div className="text-gray-500 text-center py-4">No attributes found</div>
                                        )}
                                        {filteredAttributes.map((attr) => (
                                            <div key={attr.id} className="border rounded-lg shadow-sm">

                                                {/* Attribute Header */}
                                                <button
                                                    className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
                                                    onClick={() =>
                                                        setExpandedAttrs((prev) => ({
                                                            ...prev,
                                                            [attr.name]: !prev[attr.name],
                                                        }))
                                                    }
                                                >
                                                    <span className="font-medium">{attr.name}</span>
                                                    <span>{expandedAttrs[attr.name] ? "-" : "+"}</span>
                                                </button>

                                                {/* Values List (Accordion content) */}
                                                {expandedAttrs[attr.name] && (
                                                    <div className="p-2 space-y-2">
                                                        {/* Search values inside attribute */}
                                                        <input
                                                            type="text"
                                                            placeholder={`Search ${attr.name} values`}
                                                            value={selectedAttributes[attr.name]?.searchTerm || ""}
                                                            onChange={(e) =>
                                                                setSelectedAttributes((prev) => ({
                                                                    ...prev,
                                                                    [attr.name]: {
                                                                        ...prev[attr.name],
                                                                        searchTerm: e.target.value,
                                                                    },
                                                                }))
                                                            }
                                                            className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />

                                                        {/* Scrollable values */}
                                                        <div className="max-h-32 overflow-auto grid grid-cols-2 gap-2">
                                                            {attr.values.filter((val) =>
                                                                val
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        selectedAttributes[attr.name]?.searchTerm?.toLowerCase() || ""
                                                                    )
                                                            ).length === 0 ? (
                                                                <div className="col-span-2 text-gray-500 text-center py-2">
                                                                    No values found
                                                                </div>
                                                            ) : (
                                                                attr.values
                                                                    .filter((val) =>
                                                                        val
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                selectedAttributes[attr.name]?.searchTerm?.toLowerCase() || ""
                                                                            )
                                                                    )
                                                                    .map((val, idx) => (
                                                                        <label
                                                                            key={`${val}-${idx}`}
                                                                            className={`flex items-center gap-2 px-2 py-1 border rounded-lg cursor-pointer transition ${selectedAttributes[attr.name]?.values?.includes(val)
                                                                                ? "bg-black text-white border-blue-600"
                                                                                : "bg-white text-gray-700 border-gray-300"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    Array.isArray(selectedAttributes[attr.name]?.values) &&
                                                                                    selectedAttributes[attr.name].values.includes(val)
                                                                                }
                                                                                onChange={() => toggleAttributeValue(attr.name, val)}
                                                                                className="accent-gray-600"
                                                                            />
                                                                            <span>{val}</span>
                                                                        </label>
                                                                    ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Selected Attributes */}
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Selected Attributes:</h4>
                                        {Object.entries(selectedAttributes).filter(([_, v]) => v.values?.length).length === 0 ? (
                                            <div className="text-gray-500">No attributes selected</div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(selectedAttributes)
                                                    .filter(([_, v]) => v.values?.length)
                                                    .flatMap(([attrName, v]) =>
                                                        v.values.map((val) => (
                                                            <span
                                                                key={`${attrName}-${val}`}
                                                                className="bg-black text-white px-2 py-1 rounded-full text-sm"
                                                            >
                                                                {attrName}: {val}
                                                            </span>
                                                        ))
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Variations Section */}
                            {activeSection === "variations" && (
                                <div className="max-h-[400px] overflow-auto space-y-2">
                                    {currentVariations.map((variation) => (
                                        <div key={variation} className="border rounded-lg mb-2">

                                            {/* Variation Header */}
                                            <div
                                                className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                                                onClick={() => toggleExpand(variation)}
                                            >
                                                <span>{variation}</span>
                                                <div className="flex gap-2">
                                                    <span>{expandedVariations[variation] ? "-" : "+"}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeVariation(variation); }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Show product fields inside variation */}
                                            {expandedVariations[variation] && (
                                                <div className="p-2 space-y-2 bg-gray-50">
                                                    {productFields.map((field) => {
                                                        if (field.key === "category" || field.key === "subcategory") return null;
                                                        const value = field.type === "file"
                                                            ? variationDetails[variation]?.[field.key]
                                                            : variationDetails[variation]?.[field.key] ?? newProduct[field.key];

                                                        if (field.type === "textarea") {
                                                            return (
                                                                <textarea
                                                                    key={field.key}
                                                                    placeholder={field.placeholder}
                                                                    value={value || ""}
                                                                    onChange={(e) => handleVariationChange(variation, field.key, e.target.value)}
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
                                                                        onChange={(e) => handleVariationImage(variation, e)}
                                                                    />
                                                                    {variationDetails[variation]?.preview && (
                                                                        <img
                                                                            src={variationDetails[variation].preview}
                                                                            alt={variation}
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
                                                                    onChange={(e) => handleVariationChange(variation, field.key, e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-1"
                                                                />
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}


                            {/* Buttons */}
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddProduct}
                                    className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-black transition cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </DefaultPageAdmin >
    );
};

export default AddProducts;
