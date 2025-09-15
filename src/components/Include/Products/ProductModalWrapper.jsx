"use client";
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
    categories,
    subcategories
}) => {
    const [activeSection, setActiveSection] = useState("product");
    const [currentVariations, setCurrentVariations] = useState([]);
    const [variationDetails, setVariationDetails] = useState({});
    const [expandedVariations, setExpandedVariations] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedAttrs, setExpandedAttrs] = useState({});
    const [newImage, setNewImage] = useState(null);

    // ✅ Helper for consistent variation keys
    const getVariationKey = (attrs = {}) => {
        const sorted = Object.keys(attrs)
            .sort()
            .reduce((acc, key) => {
                acc[key] = attrs[key];
                return acc;
            }, {});
        return JSON.stringify(sorted);
    };

    const handleSave = () => {
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
            prev.filter((v) => getVariationKey(v) !== key)
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

    // ✅ Generate SKU
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    const generateSKU = (productName, variation) => {
        if (!productName || !variation) return null;
        const variationName =
            typeof variation === "string"
                ? variation
                : Array.isArray(variation)
                    ? variation.join("-")
                    : Object.values(variation).join("-");

        const cleanVariation = variationName
            .trim()
            .replace(/\s+/g, "-")
            .replace(/\//g, "-")
            .toUpperCase();

        const productSlug = generateSlug(productName);
        return `${productSlug}-${cleanVariation}`;
    };

    // ✅ Handle variation generation from selected attributes
    useEffect(() => {
        const attrValues = Object.values(selectedAttributes)
            .filter((a) => a.values?.length)
            .map((a) => a.values);

        if (attrValues.length === 0) {
            setCurrentVariations([]);
            return;
        }

        const cartesian = (arr) =>
            arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);

        const combinations = cartesian(attrValues);
        const attrNames = Object.keys(selectedAttributes);

        const newVariationDetails = {};
        const variationsWithKeys = combinations.map((comb) => {
            const variationObj = comb.reduce((acc, val, idx) => {
                acc[attrNames[idx]] = val;
                return acc;
            }, {});

            const variationKey = getVariationKey(variationObj);

            newVariationDetails[variationKey] = {
                ...(variationDetails[variationKey] || {}),
                price: variationDetails[variationKey]?.price || newProduct.price,
                stock: variationDetails[variationKey]?.stock || newProduct.stock,
                image:
                    variationDetails[variationKey]?.image ||
                    newProduct.image?.[0] ||
                    null,
                name: variationDetails[variationKey]?.name || newProduct.name,
                description:
                    variationDetails[variationKey]?.description || newProduct.description,
                sku:
                    variationDetails[variationKey]?.sku ||
                    generateSKU(
                        newProduct.name,
                        Object.values(variationObj).filter(Boolean).join(" / ")
                    ),
            };

            return variationObj;
        });

        setVariationDetails(newVariationDetails);
        setCurrentVariations(variationsWithKeys);
    }, [selectedAttributes]);

    const parseAttributes = (variationName) => {
        if (!variationName) return {};
        // "Color: red1, Size: M" => { Color: "red1", Size: "M" }
        const attrs = {};
        variationName.split(",").forEach((part) => {
            const [key, value] = part.split(":").map(s => s.trim());
            if (key && value) attrs[key] = value;
        });
        return attrs;
    };


    // ✅ Load variations from DB in edit mode
    useEffect(() => {
        if (!editProductData) return;

        if (editProductData.variations?.length > 0) {
            const dbVariations = editProductData.variations.map((v) => {
                const attrs = parseAttributes(v.variationName);
                console.log("variation raw:", v);
                console.log("variation parsed attrs:", attrs);


                return {
                    ...v,
                    attributes: attrs,
                };
            });

            const dbVariationDetails = {};
            dbVariations.forEach((v) => {
                const key = getVariationKey(v.attributes);

                dbVariationDetails[key] = {
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku,
                    description: v.description,
                    image: v.image?.[0] || "",
                };
            });

            setCurrentVariations(dbVariations.map(v => v.attributes));
            setVariationDetails(dbVariationDetails);
        } else {
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [editProductData]);


    // ✅ Rebuild variations when modal opens in edit mode
    useEffect(() => {
        if (!modalOpen) return;

        if (editModalOpen && editProductData) {
            const preSelectedAttrs = {};
            const dbVariationDetails = {};

            editProductData.variations?.forEach((v) => {
                const attrs = parseAttributes(v.variationName);
                console.log("attrs", attrs)
                Object.entries(attrs).forEach(([key, val]) => {
                    if (!preSelectedAttrs[key]) preSelectedAttrs[key] = { values: [] };
                    if (!preSelectedAttrs[key].values.includes(val)) {
                        preSelectedAttrs[key].values.push(val);
                    }
                });

                const key = getVariationKey(attrs);
                console.log("key", key)
                dbVariationDetails[key] = {
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku,
                    description: v.description,
                    image: v.image?.[0] || "",
                    name: v.name || editProductData.name,
                };
            });

            setSelectedAttributes(preSelectedAttrs);

            const attrValues = Object.values(preSelectedAttrs)
                .filter((a) => a.values?.length)
                .map((a) => a.values);

            const attrNames = Object.keys(preSelectedAttrs);
            const cartesian = (arr) =>
                arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);
            const combinations = cartesian(attrValues);

            const variationsWithKeys = combinations.map((comb) => {
                const obj = comb.reduce((acc, val, idx) => {
                    acc[attrNames[idx]] = val;
                    return acc;
                }, {});
                return obj;
            });

            setCurrentVariations(variationsWithKeys);
            setVariationDetails(dbVariationDetails);

        } else {
            // New product
            setSelectedAttributes({});
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [modalOpen, editModalOpen, editProductData]);



    console.log("currentVariations:", currentVariations);
    console.log("variationDetails:", variationDetails);

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
                            categories={categories}
                            subcategories={subcategories}
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
                                // ✅ replace with Cloudinary/API
                                return URL.createObjectURL(file);
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
