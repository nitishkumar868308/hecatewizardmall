"use client"
import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import AttributesSection from "./AttributesSection";
import VariationsSection from "./VariationsSection";

const ProductModalWrapper = ({
    attributes,
    modalOpen,
    setModalOpen,
    editModalOpen,
    setEditModalOpen,
    newProduct,
    setNewProduct,
    editProductData,
    setEditProductData,
    productOffers,
}) => {
    const [activeSection, setActiveSection] = useState("product");
    const [currentVariations, setCurrentVariations] = useState([]);
    const [variationDetails, setVariationDetails] = useState({});
    const [expandedVariations, setExpandedVariations] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedAttrs, setExpandedAttrs] = useState({});
    const [newImage, setNewImage] = useState(null);

    const handleSave = () => {
        // Logic to save product (create or update)
        console.log("Saving product...");
        setModalOpen(false);
    };

    const toggleExpand = (key) => {
        setExpandedVariations((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const removeVariation = (key) => {
        setCurrentVariations((prev) =>
            prev.filter((v) => JSON.stringify(v) !== key)
        );
        const copy = { ...variationDetails };
        delete copy[key];
        setVariationDetails(copy);
    };

    const handleVariationChange = (variationKey, field, value) => {
        setVariationDetails((prev) => ({
            ...prev,
            [variationKey]: {
                ...prev[variationKey],
                [field]: value,
            },
        }));
    };

    const toggleAttributeValue = (attrName, value) => {
        setSelectedAttributes((prev) => {
            const currentValues = prev[attrName]?.values || [];
            return {
                ...prev,
                [attrName]: {
                    ...prev[attrName],
                    values: currentValues.includes(value)
                        ? currentValues.filter((v) => v !== value)
                        : [...currentValues, value],
                },
            };
        });
    };

    useEffect(() => {
        const attrValues = Object.values(selectedAttributes)
            .filter(a => a.values?.length)
            .map(a => a.values);

        if (attrValues.length === 0) {
            setCurrentVariations([]);
            return;
        }

        // Cartesian product
        const cartesian = (arr) =>
            arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

        const combinations = cartesian(attrValues);
        const attrNames = Object.keys(selectedAttributes);

        const newVariationDetails = {};
        const variationsWithKeys = combinations.map(comb => {
            const variationObj = comb.reduce((acc, val, idx) => {
                acc[attrNames[idx]] = val;
                return acc;
            }, {});

            const variationKey = JSON.stringify(variationObj);

            newVariationDetails[variationKey] = {
                ...(variationDetails[variationKey] || {}),
                price: variationDetails[variationKey]?.price || newProduct.price,
                stock: variationDetails[variationKey]?.stock || newProduct.stock,
                image: variationDetails[variationKey]?.image || newProduct.image?.[0] || null,
                name: variationDetails[variationKey]?.name || newProduct.name,
                description: variationDetails[variationKey]?.description || newProduct.description,
                sku: variationDetails[variationKey]?.sku || generateSKU(newProduct.name, Object.values(variationObj).filter(Boolean).join(" / ")),
            };

            return variationObj;
        });

        setVariationDetails(newVariationDetails);
        setCurrentVariations(variationsWithKeys);
    }, [selectedAttributes]);

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
    const generateSKU = (productName, variation) => {
        if (!productName || !variation) return null;
        const variationName = typeof variation === "string"
            ? variation
            : Array.isArray(variation)
                ? variation.join("-")
                : Object.values(variation).join("-");

        const cleanVariation = variationName
            .trim()
            .replace(/\s+/g, '-')
            .replace(/\//g, '-')
            .toUpperCase();

        const productSlug = generateSlug(productName);
        return `${productSlug}-${cleanVariation}`;
    };


    useEffect(() => {
        if (!editProductData) return;

        if (editProductData.variations?.length > 0) {
            const dbVariations = editProductData.variations.map(v => ({ ...v }));
            const dbVariationDetails = {};
            editProductData.variations.forEach(v => {
                const key = JSON.stringify({ variationName: v.variationName });
                dbVariationDetails[key] = {
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku,
                    description: v.description,
                    image: v.image?.[0] || "",
                };
            });

            setCurrentVariations(dbVariations);
            setVariationDetails(dbVariationDetails);
        } else {
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [editProductData]);



    useEffect(() => {
        if (!modalOpen) return;

        if (editModalOpen && editProductData) {
            const preSelectedAttrs = {};

            editProductData.variations?.forEach(v => {
                Object.entries(v.attributes || {}).forEach(([attr, value]) => {
                    if (!preSelectedAttrs[attr]) preSelectedAttrs[attr] = { values: [] };
                    if (!preSelectedAttrs[attr].values.includes(value)) {
                        preSelectedAttrs[attr].values.push(value);
                    }
                });
            });

            setSelectedAttributes(preSelectedAttrs);

            // Generate currentVariations based on selectedAttributes
            const attrValues = Object.values(preSelectedAttrs)
                .filter(a => a.values?.length)
                .map(a => a.values);

            if (attrValues.length === 0) {
                setCurrentVariations([]);
                setVariationDetails({});
                return;
            }

            const attrNames = Object.keys(preSelectedAttrs);
            const cartesian = arr =>
                arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
            const combinations = cartesian(attrValues);

            const newVariationDetails = {};
            const variationsWithKeys = combinations.map(comb => {
                const variationObj = comb.reduce((acc, val, idx) => {
                    acc[attrNames[idx]] = val;
                    return acc;
                }, {});
                const key = JSON.stringify(variationObj);

                const existing = editProductData.variations.find(
                    v => JSON.stringify(v.attributes) === key
                );

                newVariationDetails[key] = {
                    price: existing?.price || editProductData.price,
                    stock: existing?.stock || editProductData.stock,
                    image: existing?.image?.[0] || editProductData.image?.[0] || null,
                    name: existing?.name || editProductData.name,
                    description: existing?.description || editProductData.description,
                    sku:
                        existing?.sku ||
                        generateSKU(editProductData.name, Object.values(variationObj).join(" / "))
                };

                return variationObj;
            });

            setCurrentVariations(variationsWithKeys);
            setVariationDetails(newVariationDetails);
        } else {
            // Reset for add modal
            setSelectedAttributes({});
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [modalOpen, editModalOpen, editProductData]);




    return (
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

                {/* Right Content */}
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

                    {/* Sections */}
                    {activeSection === "product" && (
                        <ProductForm
                            editModalOpen={editModalOpen}
                            newProduct={newProduct}
                            setNewProduct={setNewProduct}
                            editProductData={editProductData}
                            setEditProductData={setEditProductData}
                            productOffers={productOffers}
                            newImage={newImage}
                            setNewImage={setNewImage}
                        />
                    )}

                    {activeSection === "attributes" && (
                        <AttributesSection
                            selectedAttributes={selectedAttributes}
                            setSelectedAttributes={setSelectedAttributes}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            expandedAttrs={expandedAttrs}
                            setExpandedAttrs={setExpandedAttrs}
                            filteredAttributes={attributes}
                            toggleAttributeValue={toggleAttributeValue}
                        />
                    )}

                    {activeSection === "variations" && (
                        <VariationsSection
                            currentVariations={currentVariations}
                            expandedVariations={expandedVariations}
                            toggleExpand={toggleExpand}
                            removeVariation={removeVariation}
                            variationDetails={variationDetails}
                            setVariationDetails={setVariationDetails}
                            handleVariationChange={handleVariationChange}
                            productFields={[
                                { key: "name", type: "text", placeholder: "Product Name" },
                                { key: "short", type: "text", placeholder: "Short Description" },
                                { key: "description", type: "textarea", placeholder: "Description" },
                                { key: "price", type: "number", placeholder: "Price" },
                                { key: "stock", type: "number", placeholder: "Stock" },
                                { key: "otherCountriesPrice", type: "text", placeholder: "Other Countries Price" },
                                { key: "image", type: "file", placeholder: "Product Image" },
                            ]}
                            handleImageUpload={async (file) => {
                                // ✅ Image upload logic (return uploaded URL)
                                return URL.createObjectURL(file); // example, replace with Cloudinary/API
                            }}
                        />
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-black transition cursor-pointer"
                        >
                            {editModalOpen ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModalWrapper;
