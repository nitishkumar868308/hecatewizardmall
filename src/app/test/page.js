"use client"
import React, { useState, useEffect } from "react";

const productFields = [
    { key: "name", type: "text", placeholder: "Product Name" },
    { key: "description", type: "textarea", placeholder: "Description" },
    { key: "price", type: "number", placeholder: "Price" },
    { key: "stock", type: "number", placeholder: "Stock" }, // optional
    { key: "image", type: "file", placeholder: "Product Image" }
];

const ProductPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("product");

    // Product details
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: null,
        imagePreview: null,
    });

    // Attributes
    const [attributes, setAttributes] = useState([]);
    const [attrName, setAttrName] = useState("");
    const [attrValues, setAttrValues] = useState("");

    // Variations expanded state and details
    const [expandedVariations, setExpandedVariations] = useState({});
    const [variationDetails, setVariationDetails] = useState({}); // { "Red + S": {name, description, price, stock, image, preview} }
    const [currentVariations, setCurrentVariations] = useState([]);
    const [variationAttributes, setVariationAttributes] = useState({});

    // Handle product image
    const handleProductImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProduct({
            ...product,
            image: file,
            imagePreview: URL.createObjectURL(file),
        });
    };

    // Add Attribute
    const handleAddAttribute = () => {
        if (!attrName || !attrValues) return;
        setAttributes([
            ...attributes,
            { name: attrName, values: attrValues.split(",").map((v) => v.trim()) }
        ]);
        setAttrName("");
        setAttrValues("");
    };

    const handleRemoveAttribute = (index) => {
        const newAttrs = [...attributes];
        newAttrs.splice(index, 1);
        setAttributes(newAttrs);
    };

    // Generate variation combinations
    const generateVariations = () => {
        if (attributes.length === 0) return [];
        const combos = (arr) => {
            if (arr.length === 0) return [[]];
            const rest = combos(arr.slice(1));
            return arr[0].values.flatMap((v) => rest.map((r) => [v, ...r]));
        };
        return combos(attributes).map((v) => v.join(" + "));
    };

    // Toggle expand/collapse
    const toggleExpand = (variation) => {
        setExpandedVariations({
            ...expandedVariations,
            [variation]: !expandedVariations[variation],
        });
    };

    // Handle variation detail change
    const handleVariationChange = (variation, field, value) => {
        setVariationDetails(prev => ({
            ...prev,
            [variation]: {
                ...prev[variation],
                [field]: value,
                attributes: prev[variation]?.attributes || [], // now prev is defined
            },
        }));
    };


    const handleVariationImage = (variation, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVariationDetails({
            ...variationDetails,
            [variation]: {
                ...variationDetails[variation],
                image: file,
                preview: URL.createObjectURL(file),
            },
        });
    };

    // Remove variation
    const removeVariation = (variation) => {
        setCurrentVariations(prev => prev.filter(v => v !== variation));
        const newDetails = { ...variationDetails };
        delete newDetails[variation];
        setVariationDetails(newDetails);

        const newExpanded = { ...expandedVariations };
        delete newExpanded[variation];
        setExpandedVariations(newExpanded);

        const newAttrs = { ...variationAttributes };
        delete newAttrs[variation];
        setVariationAttributes(newAttrs);
    };

    const removeAttrFromVariation = (variation, attrValue) => {
        setVariationAttributes(prev => ({
            ...prev,
            [variation]: prev[variation].filter(v => v !== attrValue)
        }));
    };

    // Sync variations when attributes change
    useEffect(() => {
        if (attributes.length === 0) return;

        const combos = (arr) => {
            if (arr.length === 0) return [[]];
            const rest = combos(arr.slice(1));
            return arr[0].values.flatMap(v => rest.map(r => [v, ...r]));
        };

        const variations = combos(attributes).map(v => v.join(" + "));
        setCurrentVariations(variations);

        const newVariationDetails = {};

        variations.forEach(v => {
            const names = attributes.map(attr => attr.name);
            const values = v.split(" + ");
            const attrObj = names.map((name, idx) => ({ name, value: values[idx] || "" }));

            newVariationDetails[v] = {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: "",
                image: null,
                preview: null,
                attributes: attrObj, // make sure attributes are added here
            };
        });

        setVariationDetails(newVariationDetails);
    }, [attributes, product.name, product.description, product.price]);





    // Handle submit
    const handleSubmit = () => {
        const variations = currentVariations.map(v => ({
            ...variationDetails[v],
        }));

        console.log({
            product,
            attributes,
            variations,
        });

        setModalOpen(false);
    };


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Add Product
            </button>

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
                                            ? "bg-blue-600 text-white"
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
                                    className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Product Section */}
                            {activeSection === "product" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                                    <form className="space-y-4">
                                        {productFields.map((field) => {
                                            if (field.type === "textarea") {
                                                return (
                                                    <textarea
                                                        key={field.key}
                                                        placeholder={field.placeholder}
                                                        value={product[field.key] || ""}
                                                        onChange={(e) =>
                                                            setProduct({ ...product, [field.key]: e.target.value })
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                                    />
                                                );
                                            } else if (field.type === "file") {
                                                return (
                                                    <div key={field.key}>
                                                        <label className="block mb-1 font-medium">{field.placeholder}</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleProductImage(e)}
                                                        />
                                                        {product.imagePreview && (
                                                            <img
                                                                src={product.imagePreview}
                                                                alt="Product"
                                                                className="w-32 h-32 object-cover mt-2 rounded-lg"
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
                                                        value={product[field.key] || ""}
                                                        onChange={(e) =>
                                                            setProduct({ ...product, [field.key]: e.target.value })
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                                    />
                                                );
                                            }
                                        })}
                                    </form>
                                </div>
                            )}


                            {/* Attributes Section */}
                            {activeSection === "attributes" && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Attributes</h3>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Attribute Name"
                                            value={attrName}
                                            onChange={(e) => setAttrName(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Attribute Values (comma separated)"
                                            value={attrValues}
                                            onChange={(e) => setAttrValues(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                                        />
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleAddAttribute(); }}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                        >
                                            + Add
                                        </button>
                                    </div>

                                    <ul className="space-y-2">
                                        {attributes.map((attr, idx) => (
                                            <li key={idx} className="flex justify-between items-center border p-2 rounded-lg">
                                                <span>{attr.name}: {attr.values.join(", ")}</span>
                                                <button
                                                    onClick={() => handleRemoveAttribute(idx)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeSection === "variations" && (
                                <div className="max-h-[400px] overflow-auto space-y-2">
                                    {currentVariations.map((variation) => (
                                        <div key={variation} className="border rounded-lg mb-2">
                                            {/* Header */}
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

                                            {/* Fields */}
                                            {expandedVariations[variation] && (
                                                <div className="p-2 space-y-2 bg-gray-50">
                                                    {productFields.map((field) => {
                                                        if (field.type === "textarea") {
                                                            return (
                                                                <textarea
                                                                    key={field.key}
                                                                    placeholder={field.placeholder}
                                                                    value={variationDetails[variation]?.[field.key] || ""}
                                                                    onChange={(e) =>
                                                                        handleVariationChange(variation, field.key, e.target.value)
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
                                                                    value={variationDetails[variation]?.[field.key] || ""}
                                                                    onChange={(e) =>
                                                                        handleVariationChange(variation, field.key, e.target.value)
                                                                    }
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
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Save
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
