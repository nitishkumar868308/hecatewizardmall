"use client";
import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import AttributesSection from "./AttributesSection";
import VariationsSection from "./VariationsSection";
import { useDispatch, useSelector } from "react-redux";
import {
    createProduct,
    updateProduct
} from "@/app/redux/slices/products/productSlice";
import toast from 'react-hot-toast';
import Loader from "@/components/Include/Loader";

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
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const getVariationKey = (attrs = {}) => {
        const sorted = Object.keys(attrs)
            .sort()
            .reduce((acc, key) => {
                acc[key] = attrs[key];
                return acc;
            }, {});
        return JSON.stringify(sorted);
    };

    const generateMetaDescription = (description) => {
        if (description) return description.substring(0, 150);
        return "Shop the best products online at YourStore.";
    };

    const generateMetaTitle = (name) => {
        return `${name} | YourStore`;
    };

    // ✅ Generate SKU
    const generateSlug = (name) => {
        if (!name) return "";
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    // const generateSKU = (productName, variation) => {
    //     if (!productName || !variation) return null;
    //     const variationName =
    //         typeof variation === "string"
    //             ? variation
    //             : Array.isArray(variation)
    //                 ? variation.join("-")
    //                 : Object.values(variation).join("-");

    //     const cleanVariation = variationName
    //         .trim()
    //         .replace(/\s+/g, "-")
    //         .replace(/\//g, "-")
    //         .toUpperCase();

    //     const productSlug = generateSlug(productName);
    //     return `${productSlug}-${cleanVariation}`;
    // };

    const variationsData = currentVariations.map(variationObj => {
        const variationKey = JSON.stringify(variationObj); // stringify here too
        const details = variationDetails[variationKey] || {};
        console.log("details", details)

        return {
            // variation_name: Object.values(variationObj)
            //     .map(val => String(val).trim())
            //     .filter(Boolean)
            //     .join(" / "),
            id: details.id,
            variation_name: Object.entries(variationObj)
                .map(([key, val]) => `${key}: ${String(val).trim()}`)
                .filter(Boolean)
                .join(" / "),
            price: details.price ?? newProduct.price ?? null,
            stock: details.stock ?? newProduct.stock ?? null,
            short: details.short ?? newProduct.short ?? null,
            image: details.images ?? [],
            name: details.name ?? newProduct.name ?? null,
            description: details.description ?? newProduct.description ?? null,
            otherCountriesPrice: details.otherCountriesPrice ?? newProduct.otherCountriesPrice ?? null,
            // sku: details.sku ?? generateSKU(
            //     newProduct.name,
            //     Object.entries(variationObj)
            //         .map(([k, v]) => `${k}-${v}`)
            //         .join("-")
            // ),
            sku: details.sku ?? newProduct.sku ?? null,
            tags: details.tags ?? newProduct.tags ?? null,
        };
    });
    console.log("variationsData", variationsData)

    const handleSave = () => {
        if (editModalOpen) {
            handleUpdateProduct();
        } else {
            handleCreateProduct();
        }
    };


    const handleCreateProduct = async () => {
        console.log("offer:", newProduct.offer);

        setLoading(true);
        try {
            let imageUrls = [];
            if (newImage) {
                if (Array.isArray(newImage)) {
                    imageUrls = await Promise.all(newImage.map(img => handleImageUpload(img)));
                    console.log("imageUrls", imageUrls)
                } else {
                    const url = await handleImageUpload(newImage);
                    imageUrls = Array.isArray(url) ? url : [url];
                }
            }


            // const productSKU = `${generateSlug(name)}-MAIN-${Date.now()}`;

            const subcategoryId = parseInt(newProduct.subcategoryId);
            // if (!subcategoryId) return toast.error("Subcategory is required");

            const categoryId = newProduct.categoryId ? parseInt(newProduct.categoryId) : null;

            // Prepare product data including variations
            const productData = {
                name: newProduct.name?.trim() || "",
                //categoryId: newProduct.category,
                //subcategoryId: parseInt(newProduct.subcategoryId),
                //subcategory: { connect: { id: Number(newProduct.subcategoryId) } },
                short: newProduct.short || null,
                description: newProduct.description || null,
                image: imageUrls,
                active: newProduct.active ?? true,
                slug: generateSlug(newProduct.name),
                metaTitle: generateMetaTitle(newProduct.name),
                metaDescription: generateMetaDescription(newProduct.description),
                price: newProduct.price ?? null,
                stock: newProduct.stock ?? null,
                size: newProduct.sizes || [],
                color: newProduct.colors || [],
                sku: newProduct.sku ?? null,
                otherCountriesPrice: newProduct.otherCountriesPrice ?? null,
                offers: newProduct.offers && newProduct.offers.length > 0
                    ? {
                        connect: newProduct.offers.map((id) => ({ id: parseInt(id) }))
                    }
                    : undefined,

                primaryOffer: newProduct.offers && newProduct.offers.length > 0
                    ? { connect: { id: parseInt(newProduct.offers[0]) } }
                    : undefined,
                tags: newProduct.tags && newProduct.tags.length > 0
                    ? { connect: newProduct.tags.map(tag => ({ id: tag.id })) }
                    : undefined,

                category: categoryId ? { connect: { id: categoryId } } : undefined,
                subcategory: { connect: { id: subcategoryId } },

                variations: variationsData
            };

            console.log("createProduct", productData)
            const res = await dispatch(createProduct(productData)).unwrap();
            toast.success(res.message);
            setNewProduct({
                name: "",
                category: "",
                subcategoryId: "",
                short: "",
                description: "",
                price: "",
                stock: "",
                sizes: null,
                colors: null,
                active: true,
                image: null,
            });
            setSelectedAttributes({});
            setActiveSection("product");
            setCurrentVariations([]);
            setVariationDetails({});
            setNewImage(null);
            setModalOpen(false)

        } catch (err) {
            toast.error(err?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateProduct = async () => {
        setLoading(true);

        // Flattened variations data
        const formattedVariations = variationsData.map(v => ({
            id: v.id || undefined,
            variationName: v.variation_name,
            name: v.name,
            price: v.price,
            short: v.short,
            stock: v.stock,
            sku: v.sku,
            image: v.image,
            description: v.description,
        }));



        const productData = {
            name: editProductData.name,
            short: editProductData.short,
            description: editProductData.description,
            price: editProductData.price,
            stock: editProductData.stock,
            image: editProductData.image,
            // offers: editProductData.offers?.length
            //     ? { set: [], connect: editProductData.offers.map(o => ({ id: o.id })) }
            //     : undefined,
            offers: editProductData.offers || [],
            primaryOffer: editProductData.offers?.[0] || null,
            // primaryOffer: editProductData.offers?.length
            //     ? { connect: { id: editProductData.offers[0].id } }
            //     : undefined,
            categoryId: editProductData.categoryId,
            subcategoryId: editProductData.subcategoryId,
            active: editProductData.active,
            slug: editProductData.slug,
            metaTitle: editProductData.metaTitle,
            metaDescription: editProductData.metaDescription,
            otherCountriesPrice: editProductData.otherCountriesPrice,
            size: editProductData.sizes,
            color: editProductData.colors,
            sku: editProductData.sku,
            variations: formattedVariations,
        };

        console.log("Sending variations:", formattedVariations);
        console.log("productDataEdit", productData)

        try {
            const res = await dispatch(updateProduct({ id: editProductData.id, data: productData })).unwrap();
            toast.success("Product updated successfully!");
            setEditProductData(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
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

    const generateSKU = (baseSKU, variation) => {
        if (!baseSKU || !variation) return null;

        // Convert variation object/array/string into a string
        const variationName =
            typeof variation === "string"
                ? variation
                : Array.isArray(variation)
                    ? variation.join("-")
                    : Object.values(variation).join("-");

        // Clean variation string
        const cleanVariation = variationName
            .trim()
            .replace(/\s+/g, "-")
            .replace(/\//g, "-")
            .toUpperCase();

        // Keep the slug logic on baseSKU
        const productSlug = generateSlug(baseSKU);

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

            const tagsArray = (variationDetails[variationKey]?.tags || newProduct.tags)?.map(tag =>
                typeof tag === 'string' ? { name: tag } : tag
            );

            const baseSKU = newProduct.sku || "";
            const newSKU = variationDetails[variationKey]?.sku ?? generateSKU(baseSKU, variationObj);

            // **Console log to check**
            console.log("Variation Key:", variationKey);
            console.log("Tags Array:", tagsArray);

            newVariationDetails[variationKey] = {
                ...(variationDetails[variationKey] || {}),
                price: variationDetails[variationKey]?.price || newProduct.price,
                short: variationDetails[variationKey]?.short || newProduct.short,
                stock: variationDetails[variationKey]?.stock || newProduct.stock,
                image:
                    variationDetails[variationKey]?.image ||
                    newProduct.image?.[0] ||
                    null,
                name: variationDetails[variationKey]?.name || newProduct.name,
                description:
                    variationDetails[variationKey]?.description || newProduct.description,
                sku: newSKU,
                tags: (variationDetails[variationKey]?.tags || newProduct.tags)?.map(tag =>
                    typeof tag === 'string' ? { name: tag } : tag
                )


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
                    id: v.id,
                    short: v.short,
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku,
                    description: v.description,
                    images: v.image ? [v.image] : [],
                    name: v.name || editProductData.name,
                    tags: v.tags
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
                console.log("keyeditMode", key)
                dbVariationDetails[key] = {
                    id: v.id,
                    short: v.short,
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku,
                    description: v.description,
                    images: v.image ? [v.image] : [],
                    name: v.name || editProductData.name,
                    tags: v.tags
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

    // const handleImageUpload = async (file) => {
    //     if (!file) throw new Error('No file provided');

    //     try {
    //         const url = await uploadToCloudinary(file, 'products');
    //         return url;
    //     } catch (err) {
    //         console.error('Upload failed:', err);
    //         throw err;
    //     }
    // };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return data.urls; // single URL or array of URLs
    };

    console.log("currentVariations:", currentVariations);
    console.log("variationDetails:", variationDetails);

    return (
        <>
            {loading && <Loader />}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full h-full  p-6 md:flex md:gap-6 animate-fade-in">
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
                                    { key: "tags", type: "text", placeholder: "Tags" },
                                    { key: "price", type: "number", placeholder: "Price" },
                                    { key: "stock", type: "number", placeholder: "Stock" },
                                    { key: "sku", type: "text", placeholder: "Enter SKU Detail" },
                                    { key: "description", type: "textarea", placeholder: "Description" },
                                    { key: "image", type: "file", placeholder: "Product Image" },
                                ]}
                                handleImageUpload={handleImageUpload}
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
        </>

    );
};

export default ProductModalWrapper;
