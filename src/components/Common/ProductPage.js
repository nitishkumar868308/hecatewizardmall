"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ProductSlider from "@/components/Product/Product";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { addToCartAsync, fetchCart, clearCartAsync, updateCart, deleteCartItem, triggerCartRefresh } from "@/app/redux/slices/addToCart/addToCartSlice";
import Loader from "@/components/Include/Loader";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { useCountries } from "@/lib/CustomHook/useCountries";
import { AlertTriangle, ShoppingCart, Trash2 } from "lucide-react";
import ProductOffers from "@/components/Product/ProductOffers/ProductOffers";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { fetchDispatches } from "@/app/redux/slices/dispatchUnitsWareHouse/dispatchUnitsWareHouseSlice";

const ProductDetail = () => {
    const pathname = usePathname();
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);
    const { countries } = useCountries();
    console.log("countries", countries)
    const [loading, setLoading] = useState(false);
    const { products } = useSelector((state) => state.products);
    const [userCart, setUserCart] = useState([]);
    const { offers } = useSelector((state) => state.offers);
    const params = useParams();
    const { id } = params;
    const [currentProduct, setCurrentProduct] = useState(null);
    const product = currentProduct;
    const [quantity, setQuantity] = useState(1);
    const [variationAttributes, setVariationAttributes] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [currentImages, setCurrentImages] = useState(
        selectedVariation?.image || product?.image || []
    );
    const [mainImage, setMainImage] = useState(
        selectedVariation?.image?.[0] || product?.image?.[0] || "/image/logo PNG.png"
    );
    const [reviewForm, setReviewForm] = useState({
        name: "",
        rating: 0,
        comment: "",
    });
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [newCountry, setNewCountry] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const { user } = useSelector((state) => state.me);
    const { items } = useSelector((state) => state.cart);
    const country = useSelector((state) => state.country);
    console.log("products", products)
    const { dispatches } = useSelector((state) => state.dispatchWarehouse);
    console.log("dispatches", dispatches)
    const isXpress = pathname.includes("/hecate-quickGo");
    const purchasePlatform = isXpress ? "xpress" : "website";
    // useEffect(() => {
    //     const prod = products.find((p) => p.id == id);
    //     console.log("prod", prod)
    //     setCurrentProduct(prod || null);
    // }, [products, id]);
    useEffect(() => {
        const prod = products.find((p) => p.id == id) || null;
        if (prod?.id !== currentProduct?.id) {
            setCurrentProduct(prod);
        }
    }, [products, id, currentProduct]);
    console.log("currentProduct", currentProduct)
    // const product = products.find((p) => p.id === id);
    const cartItem = userCart?.find(
        (item) =>
            item.variationId === selectedVariation?.id &&
            item.purchasePlatform === purchasePlatform // <-- check platform
    );

    const isInCart = !!cartItem;

    console.log("currentProduct", currentProduct)
    // 🟢 whenever selectedVariation or cart changes → sync quantity
    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity); // ✅ set actual cart quantity
        } else {
            setQuantity(1); // ✅ reset when variation not in cart
        }
    }, [cartItem, selectedVariation]);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchMe());
        dispatch(fetchProducts()); // always fetch for current country
        dispatch(fetchOffers());
        dispatch(fetchDispatches())
    }, [dispatch, country]); // <-- refetch whenever country changes
    console.log("selectedVariation", selectedVariation)

    const selectedWarehouseId =
        typeof window !== "undefined"
            ? localStorage.getItem("warehouseId")
            : null;

    const allowedVariationIds = useMemo(() => {
        if (!isXpress || !currentProduct || !dispatches?.length) return null; // null = loading

        return dispatches
            .flatMap(d =>
                d.entries?.flatMap(dim => {
                    if (dim.productId !== currentProduct.id) return [];
                    return dim.entries
                        ?.filter(e => e.warehouseId?.toString() === selectedWarehouseId)
                        .map(() => dim.variationId);
                })
            )
            .filter(Boolean);
    }, [dispatches, currentProduct?.id, isXpress, selectedWarehouseId]);
    console.log("allowedVariationIds", allowedVariationIds)



    useEffect(() => {
        if (!currentProduct) return;


        // Wait for allowedVariationIds if Xpress
        if (isXpress && allowedVariationIds === null) return;

        const variationsToUse = isXpress
            ? currentProduct.variations?.filter(v => allowedVariationIds.includes(v.id))
            : currentProduct.variations;

        if (!variationsToUse || variationsToUse.length === 0) {
            setSelectedVariation(null);
            setVariationAttributes({});
            return;
        }

        // Build attributes
        const attrs = {};
        variationsToUse.forEach(v => {
            v.variationName.split(" / ").forEach(part => {
                const [key, val] = part.split(":").map(p => p.trim());
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(val);
            });
        });

        const finalAttrs = {};
        Object.entries(attrs).forEach(([k, v]) => finalAttrs[k] = Array.from(v));

        setVariationAttributes(finalAttrs);

        // Initial selected attributes
        const initialSelected = {};
        Object.entries(finalAttrs).forEach(([attr, values]) => initialSelected[attr] = values[0]);
        setSelectedAttributes(initialSelected);

        // Match variation
        const matchedVariation = variationsToUse.find(v => {
            const parts = parseVariationName(v.variationName);
            return Object.entries(initialSelected).every(
                ([k, val]) => parts[k.toLowerCase()] === val.toLowerCase()
            );
        }) || variationsToUse[0];

        setSelectedVariation(matchedVariation);

        // Set images
        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]);
        } else if (currentProduct.image?.length) {
            setCurrentImages(currentProduct.image);
            setMainImage(currentProduct.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [currentProduct, isXpress, allowedVariationIds]);


    const variationStockMap = useMemo(() => {
        if (!dispatches?.length) return {};

        const map = {};

        dispatches.forEach(d => {
            d.entries?.forEach(item => {
                item.entries?.forEach(e => {
                    if (e.warehouseId?.toString() !== selectedWarehouseId) return;

                    const variationId = item.variationId;
                    const units = Number(e.units) || 0;

                    map[variationId] = (map[variationId] || 0) + units;
                });
            });
        });

        return map;
    }, [dispatches, selectedWarehouseId]);


    const getAttributeStock = (attrKey, attrValue) => {
        if (!currentProduct?.variations) return 0;

        return currentProduct.variations.reduce((sum, v) => {
            const parts = parseVariationName(v.variationName);

            // check all selected attributes
            const isMatch = Object.entries(selectedAttributes).every(
                ([key, selectedVal]) => {
                    if (key === attrKey) {
                        // is attribute ke liye current value match karo
                        return parts[key.toLowerCase()]?.toLowerCase() ===
                            attrValue.toLowerCase();
                    }
                    // baaki attributes already selected hone chahiye
                    return (
                        !selectedVal ||
                        parts[key.toLowerCase()]?.toLowerCase() ===
                        selectedVal.toLowerCase()
                    );
                }
            );

            if (!isMatch) return sum;

            return sum + (variationStockMap[v.id] || 0);
        }, 0);
    };


    const selectedStock =
        selectedVariation?.id
            ? variationStockMap[selectedVariation.id] || 0
            : 0;
    console.log("selectedStock", selectedStock)
    // useEffect(() => {
    //     if (!currentProduct) return;

    //     // ✅ Filter variations by allowedVariationIds
    //     const variationsToUse = isXpress
    //         ? currentProduct.variations?.filter(v =>
    //             allowedVariationIds?.includes(v.id)
    //         )
    //         : currentProduct.variations;

    //     if (!variationsToUse || variationsToUse.length === 0) {
    //         setSelectedVariation(null);
    //         setVariationAttributes({});
    //         return;
    //     }

    //     const attrs = {};

    //     // ✅ Only use filtered variations here
    //     variationsToUse.forEach((v) => {
    //         const parts = v.variationName.split(" / ");
    //         parts.forEach((part) => {
    //             const [key, val] = part.split(":").map(p => p.trim());
    //             if (!attrs[key]) attrs[key] = new Set();
    //             attrs[key].add(val);
    //         });
    //     });

    //     const finalAttrs = {};
    //     Object.entries(attrs).forEach(([k, v]) => {
    //         finalAttrs[k] = Array.from(v);
    //     });

    //     setVariationAttributes(finalAttrs);

    //     const initialSelected = {};
    //     Object.entries(finalAttrs).forEach(([attr, values]) => {
    //         initialSelected[attr] = values[0];
    //     });

    //     setSelectedAttributes(initialSelected);

    //     const matchedVariation =
    //         variationsToUse.find((v) => {
    //             const parts = parseVariationName(v.variationName);
    //             return Object.entries(initialSelected).every(
    //                 ([k, val]) =>
    //                     parts[k.toLowerCase()] === val.toLowerCase()
    //             );
    //         }) || variationsToUse[0];

    //     setSelectedVariation(matchedVariation);

    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else if (currentProduct.image?.length) {
    //         setCurrentImages(currentProduct.image);
    //         setMainImage(currentProduct.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // }, [currentProduct, dispatches, isXpress, allowedVariationIds]);




    // useEffect(() => {
    //     if (!currentProduct) return;
    //     console.log("currentProduct", currentProduct)
    //     // Reset selected attributes based on new product
    //     const attrs = {};
    //     currentProduct.variations?.forEach((v) => {
    //         const parts = v.variationName.split(" / ");
    //         parts.forEach((part) => {
    //             const [key, val] = part.split(":").map((p) => p.trim());
    //             if (!attrs[key]) attrs[key] = new Set();
    //             attrs[key].add(val);
    //         });
    //     });

    //     const finalAttrs = {};
    //     Object.entries(attrs).forEach(([k, v]) => (finalAttrs[k] = Array.from(v)));
    //     setVariationAttributes(finalAttrs);

    //     // Reset selected attributes
    //     const initialSelected = {};
    //     if (currentProduct?.isDefault) {
    //         Object.entries(finalAttrs).forEach(([attr, values]) => {
    //             initialSelected[attr] = currentProduct.isDefault[attr] || values[0];
    //         });
    //     } else {
    //         Object.entries(finalAttrs).forEach(([attr, values]) => {
    //             initialSelected[attr] = values[0];
    //         });
    //     }
    //     setSelectedAttributes(initialSelected);

    //     // Match variation
    //     const matchedVariation = currentProduct.variations?.find((v) => {
    //         const parts = parseVariationName(v.variationName);
    //         return Object.entries(initialSelected).every(
    //             ([k, val]) => parts[k.toLowerCase()] === val.toLowerCase()
    //         );
    //     }) || null;

    //     setSelectedVariation(matchedVariation);

    //     // Set main image
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else if (currentProduct.image?.length) {
    //         setCurrentImages(currentProduct.image);
    //         setMainImage(currentProduct.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // }, [currentProduct]);


    console.log("productsId", products)
    // useEffect(() => {
    //     dispatch(fetchCart())
    //     dispatch(fetchMe())
    //     if (!products.length) dispatch(fetchProducts());
    //     dispatch(fetchOffers());
    // }, [dispatch, products.length]);
    // useEffect(() => {
    //     if (user && selectedVariation) {
    //         // Find if the user already has this variation in cart
    //         const existingCartItem = user.carts?.find(
    //             (item) =>
    //                 item.productId === product.id &&
    //                 item.variationId === selectedVariation.id
    //         );

    //         if (existingCartItem) {
    //             setQuantity(existingCartItem.quantity);
    //         } else {
    //             setQuantity(1); // default
    //         }
    //     }
    // }, [user, selectedVariation, product]);

    useEffect(() => {
        if (items && Array.isArray(items) && user?.id) {
            const filtered = items.filter((item) => item.userId == String(user.id));
            setUserCart(filtered);
        }
    }, [items, user]);


    useEffect(() => {
        if (!product?.variations?.length) return;

        const attrs = {};

        product.variations.forEach(v => {
            const parts = v.variationName.split(" / ");
            parts.forEach(part => {
                const [key, val] = part.split(":").map(p => p.trim());
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(val);
            });
        });

        // Convert sets to arrays
        const finalAttrs = {};
        Object.entries(attrs).forEach(([k, v]) => finalAttrs[k] = Array.from(v));

        setVariationAttributes(finalAttrs);
    }, [product?.variations]);

    // useEffect(() => {
    //     if (!product?.variations?.length || !variationAttributes || !Object.keys(variationAttributes).length) return;

    //     // Auto-select first value of each attribute
    //     const initialSelected = {};
    //     Object.entries(variationAttributes).forEach(([attr, values]) => {
    //         if (values.length) initialSelected[attr] = values[0];
    //     });
    //     setSelectedAttributes(initialSelected);

    //     // Match the first variation
    //     const matchingVariations = product.variations.filter(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, val] = part.split(":").map(p => p.trim());
    //             acc[k] = val;
    //             return acc;
    //         }, {});
    //         return Object.entries(initialSelected).every(([k, val]) => parts[k] === val);
    //     });

    //     const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

    //     setSelectedVariation(matchedVariation);

    //     // Set main image & thumbnails
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // }, [product?.id, product?.variations?.length, Object.keys(variationAttributes).length]);

    useEffect(() => {
        if (!product?.variations?.length || !variationAttributes || !Object.keys(variationAttributes).length) return;

        let initialSelected = {};

        if (product?.isDefault && Object.keys(product.isDefault).length > 0) {
            // ✅ Use isDefault attributes first
            initialSelected = { ...product.isDefault };

            // अगर किसी attribute का default value variationAttributes में मौजूद नहीं है
            Object.entries(variationAttributes).forEach(([attr, values]) => {
                if (!initialSelected[attr] && values.length) {
                    initialSelected[attr] = values[0];
                }
            });
        } else {
            // ✅ Fallback: select first value of each attribute
            Object.entries(variationAttributes).forEach(([attr, values]) => {
                if (values.length) initialSelected[attr] = values[0];
            });
        }

        setSelectedAttributes(initialSelected);

        // Match the variation with initialSelected
        const matchingVariations = product.variations.filter(v => {
            const parts = v.variationName.split(" / ").reduce((acc, part) => {
                const [k, val] = part.split(":").map(p => p.trim());
                acc[k] = val;
                return acc;
            }, {});
            return Object.entries(initialSelected).every(([k, val]) => parts[k] === val);
        });

        const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

        setSelectedVariation(matchedVariation);

        // Set main image & thumbnails
        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]);
        } else if (product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [product?.id, product?.variations?.length, Object.keys(variationAttributes).length]);


    // const handleAttributeSelect = (attrName, val) => {
    //     const newSelected = { ...selectedAttributes, [attrName]: val };
    //     setSelectedAttributes(newSelected);

    //     // Filter variations that match the selected attributes
    //     const matchingVariations = product.variations.filter(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, v] = part.split(":").map(p => p.trim());
    //             acc[k] = v;
    //             return acc;
    //         }, {});
    //         return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
    //     });

    //     // Pick the first variation that has an image
    //     const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

    //     setSelectedVariation(matchedVariation);

    //     // Update mainImage & currentImages
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else if (!matchedVariation && product.image?.length) {
    //         setCurrentImages(product.image);
    //         setMainImage(product.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // };
    const parseVariationName = (variationName = "") => {
        return variationName.split(" / ").reduce((acc, part) => {
            const [k, v] = part.split(":").map(p => p.trim().toLowerCase());
            acc[k] = v;
            return acc;
        }, {});
    };

    const handleAttributeSelect = (attrName, val) => {
        const newSelected = { ...selectedAttributes, [attrName]: val };
        setSelectedAttributes(newSelected);

        const matchedVariation = product.variations.find(v => {
            const parts = parseVariationName(v.variationName);
            return Object.entries(newSelected).every(
                ([k, v]) => parts[k.toLowerCase()] === v.toLowerCase()
            );
        });

        setSelectedVariation(matchedVariation || null);

        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]?.trim() || "/image/logo PNG.png");
        } else if (product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]?.trim() || "/image/logo PNG.png");
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    };


    // const handleAttributeSelect = (attrName, val) => {
    //     const newSelected = { ...selectedAttributes, [attrName]: val };
    //     setSelectedAttributes(newSelected);

    //     const matchedVariation = product.variations.find(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, v] = part.split(":").map(p => p.trim());
    //             acc[k] = v;
    //             return acc;
    //         }, {});
    //         return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
    //     });

    //     setSelectedVariation(matchedVariation || null);
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]?.trim() || "/image/logo PNG.png");
    //     } else if (!matchedVariation && product.image?.length) {
    //         setCurrentImages(product.image);
    //         setMainImage(product.image[0]?.trim() || "/image/logo PNG.png");
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }

    // };


    // Thumbnails: only show if more than 1 image
    const thumbnailImages = currentImages.length > 1 ? currentImages.filter(img => img !== mainImage) : [];

    // const increment = () => setQuantity(quantity + 1);
    // const decrement = () => quantity > 1 && setQuantity(quantity - 1);


    const productWithOffer = products.map(product => {
        // get all offer names from the product's offers array
        const offerDescriptions = product.offers?.map(o => o.name).filter(Boolean) || [];

        return {
            ...product,
            offerDescriptions, // note plural
        };
    });



    if (!product)
        return <p className="text-center mt-20 text-gray-500 text-xl">Product not found</p>;

    // const addToCart = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to add items to your cart.");
    //         return;
    //     }

    //     const isAlreadyInCart = userCart?.some(
    //         (item) =>
    //             item.productId === product.id &&
    //             item.variationId === (selectedVariation?.id || null)
    //     );

    //     if (isAlreadyInCart) {
    //         toast.error("This product is already in your cart!");
    //         return;
    //     }

    //     setLoading(true);
    //     const price = selectedVariation?.price || product.price;
    //     const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //     const totalPrice = price * quantity;

    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes).forEach(([key, val]) => {
    //         if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //     });

    //     const cartItem = {
    //         productName: product.name,
    //         quantity,
    //         pricePerItem: price,
    //         currencySymbol,
    //         totalPrice,
    //         productId: product.id,
    //         variationId: selectedVariation?.id || null,
    //         attributes: flatAttributes,
    //         userId: user.id,
    //         image: mainImage || "No Image",
    //     };

    //     try {
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success(result.message || "Item added to cart!");
    //         dispatch(fetchCart())
    //     } catch (err) {
    //         toast.error(err.message || "Failed to delete product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Assume `countries` array is already available (250 countries)
    // const addToCart = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to add items to your cart.");
    //         return;
    //     }

    //     let selectedCountryCode = localStorage.getItem("selectedCountry");
    //     if (!selectedCountryCode) {
    //         toast.error("Something went wrong! Country not found.");
    //         return;
    //     }

    //     selectedCountryCode = selectedCountryCode.toUpperCase();

    //     // 🔹 Find full country name dynamically from `countries` array
    //     let selectedCountryObj = countries.find(
    //         (c) => c.code.toUpperCase() === selectedCountryCode
    //     );

    //     // 🔹 If not found by 3-letter code, try first 2 letters (alpha-2 fallback)
    //     if (!selectedCountryObj && selectedCountryCode.length === 3) {
    //         selectedCountryObj = countries.find(
    //             (c) => c.code.toUpperCase().startsWith(selectedCountryCode.slice(0, 2))
    //         );
    //     }

    //     const selectedCountry = selectedCountryObj?.name || selectedCountryCode;

    //     // ✅ Cart country check
    //     if (userCart && userCart.length > 0) {
    //         const cartCountry = userCart[0]?.selectedCountry;
    //         if (cartCountry && cartCountry !== selectedCountry) {
    //             setNewCountry(selectedCountry); // jo country add karni hai
    //             setShowCountryModal(true);      // modal show karo
    //             return; // wait for user action in modal
    //         }
    //     }


    //     // ✅ Duplicate check
    //     const isAlreadyInCart = userCart?.some(
    //         (item) =>
    //             item.productId === product.id &&
    //             item.variationId === (selectedVariation?.id || null)
    //     );
    //     if (isAlreadyInCart) {
    //         toast.error("This product is already in your cart!");
    //         return;
    //     }

    //     setLoading(true);

    //     const priceObj = displayedPrice();
    //     const finalPricePerItem = Number(priceObj.discounted ?? priceObj.original);
    //     // const price = selectedVariation?.price || product.price;
    //     const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //     const currency = selectedVariation?.currency || product.currency || "₹";
    //     console.log("currency", currency)
    //     const totalPrice = finalPricePerItem * quantity;

    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes).forEach(([key, val]) => {
    //         if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //     });

    //     const cartItem = {
    //         productName: product.name,
    //         quantity,
    //         pricePerItem: finalPricePerItem,
    //         currency,
    //         currencySymbol,
    //         bulkPrice: priceObj.bulkPrice || null,
    //         bulkMinQty: priceObj.minQty || null,
    //         offerApplied: priceObj.isBulkOffer || false,
    //         totalPrice,
    //         productId: product.id,
    //         variationId: selectedVariation?.id || null,
    //         attributes: flatAttributes,
    //         userId: user.id,
    //         image: mainImage || "No Image",
    //         selectedCountry,
    //     };
    //     try {
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success(result.message || "Item added to cart!");
    //         dispatch(fetchCart());
    //     } catch (err) {
    //         toast.error(err.message || "Failed to add product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const addToCart = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to add items to your cart.");
    //         return;
    //     }

    //     // 🔹 Get selected country
    //     let selectedCountryCode = localStorage.getItem("selectedCountry");
    //     if (!selectedCountryCode) {
    //         toast.error("Something went wrong! Country not found.");
    //         return;
    //     }

    //     selectedCountryCode = selectedCountryCode.toUpperCase();
    //     let selectedCountryObj = countries.find(
    //         (c) => c.code.toUpperCase() === selectedCountryCode
    //     );

    //     if (!selectedCountryObj && selectedCountryCode.length === 3) {
    //         selectedCountryObj = countries.find((c) =>
    //             c.code.toUpperCase().startsWith(selectedCountryCode.slice(0, 2))
    //         );
    //     }

    //     const selectedCountry = selectedCountryObj?.name || selectedCountryCode;

    //     // 🔹 Ensure cart country consistency
    //     if (userCart && userCart.length > 0) {
    //         const cartCountry = userCart[0]?.selectedCountry;
    //         if (cartCountry && cartCountry !== selectedCountry) {
    //             setNewCountry(selectedCountry);
    //             setShowCountryModal(true);
    //             return;
    //         }
    //     }

    //     setLoading(true);

    //     try {
    //         // 1️⃣ Get Base Price (always original)
    //         const priceObj = displayedPrice();
    //         const basePrice = Number(priceObj.discounted ?? priceObj.original);
    //         const currencySymbol =
    //             selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //         const currency = selectedVariation?.currency || product.currency || "INR";

    //         // 2️⃣ Normalize Attributes
    //         const flatAttributes = {};
    //         Object.entries(selectedAttributes).forEach(([key, val]) => {
    //             if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //         });

    //         // 3️⃣ Initialize Bulk Offer Variables
    //         let offerApplied = false;
    //         let bulkPrice = null;
    //         let bulkMinQty = null;

    //         const hasBulkOffer =
    //             Number(product?.minQuantity) > 0 &&
    //             Number(selectedVariation?.bulkPrice) > 0;

    //         console.log("hasBulkOffer:", hasBulkOffer);

    //         let sameGroupItems = [];
    //         let totalGroupQty = quantity;

    //         if (hasBulkOffer) {
    //             const productMinQty = Number(product.minQuantity);
    //             const variationBulkPrice = Number(selectedVariation.bulkPrice);
    //             const variationBulkMinQty = Number(
    //                 selectedVariation.bulkMinQty || productMinQty
    //             );
    //             const requiredQty = variationBulkMinQty || productMinQty;

    //             // ✅ Group by same product + attributes (ignore color)
    //             const coreAttributes = Object.entries(flatAttributes).filter(
    //                 ([key]) => !["color", "colour"].includes(key.toLowerCase())
    //             );
    //             const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

    //             // ✅ Find existing cart items in same group
    //             sameGroupItems =
    //                 userCart?.filter((item) => {
    //                     if (item.productId !== product.id) return false;

    //                     const itemCoreKey = Object.entries(item.attributes || {})
    //                         .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
    //                         .map(([k, v]) => `${k}:${v}`)
    //                         .join("|");

    //                     return itemCoreKey === coreKey;
    //                 }) || [];

    //             totalGroupQty =
    //                 sameGroupItems.reduce((sum, i) => sum + (i.quantity || 0), 0) +
    //                 quantity;

    //             console.log("🧩 BULK DEBUG →", {
    //                 totalGroupQty,
    //                 variationBulkPrice,
    //                 variationBulkMinQty,
    //                 productMinQty,
    //                 requiredQty,
    //             });

    //             // ✅ Apply bulk offer if total quantity meets requirement
    //             if (totalGroupQty >= requiredQty) {
    //                 offerApplied = true;
    //                 bulkPrice = variationBulkPrice;
    //                 bulkMinQty = requiredQty;
    //                 // 🧩 Take stable snapshot before mapping (avoid stale selectedVariation)
    //                 const currentBulkPrice = Number(selectedVariation?.bulkPrice) || null;
    //                 const currentBulkMinQty = Number(selectedVariation?.bulkMinQty) || null;


    //                 // 🔥 Update only those items that share the SAME variation
    //                 const updatedGroupItems = sameGroupItems.map((item) => {
    //                     if (item.variationId === selectedVariation?.id) {
    //                         return {
    //                             ...item,
    //                             totalPrice: currentBulkPrice ? currentBulkPrice * item.quantity : item.pricePerItem * item.quantity,
    //                             offerApplied: !!currentBulkPrice,
    //                             bulkPrice: currentBulkPrice,
    //                             bulkMinQty: currentBulkMinQty,
    //                         };
    //                     }
    //                     return item; // keep others untouched
    //                 });

    //                 console.log("updatedGroupItems", updatedGroupItems)

    //                 if (updatedGroupItems.length > 0) {
    //                     await Promise.all(
    //                         updatedGroupItems.map((uItem) => dispatch(updateCart(uItem)))
    //                     );
    //                 }
    //             } else {
    //                 // ❌ Not enough quantity yet for bulk
    //                 offerApplied = false;
    //                 bulkPrice = null;
    //                 bulkMinQty = null;
    //             }
    //         }

    //         // 4️⃣ Prevent duplicate same variation + color
    //         const isAlreadyInCart = userCart?.some(
    //             (item) =>
    //                 item.productId === product.id &&
    //                 item.variationId === (selectedVariation?.id || null) &&
    //                 item.attributes?.color === flatAttributes?.color
    //         );
    //         if (isAlreadyInCart) {
    //             toast.error("This product is already in your cart!");
    //             setLoading(false);
    //             return;
    //         }

    //         // 5️⃣ Calculate Prices
    //         const finalUnitPrice = basePrice; // always main price per item
    //         const totalPrice =
    //             offerApplied && bulkPrice
    //                 ? bulkPrice * quantity // if offer, total uses bulkPrice
    //                 : basePrice * quantity;

    //         // 🧩 Normalize values
    //         const normalizeNumber = (val) => {
    //             if (val == null || val === "") return null;
    //             if (typeof val === "object" && "toNumber" in val) return val.toNumber();
    //             if (typeof val === "object" && "value" in val) return Number(val.value);
    //             return Number(val);
    //         };

    //         const finalBulkPrice = normalizeNumber(bulkPrice);
    //         const finalBulkMinQty = normalizeNumber(bulkMinQty);

    //         console.log("✅ FINAL BULK VALUES:", {
    //             finalBulkPrice,
    //             finalBulkMinQty,
    //             offerApplied,
    //             basePrice,
    //             totalPrice,
    //         });

    //         // 6️⃣ Prepare Cart Item
    //         const cartItem = {
    //             productName: product.name,
    //             quantity,
    //             pricePerItem: basePrice, // Always original
    //             currency,
    //             currencySymbol,
    //             totalPrice,
    //             bulkPrice: finalBulkPrice, // Only updates if offer applied
    //             bulkMinQty: finalBulkMinQty,
    //             offerApplied,
    //             productId: product.id,
    //             variationId: selectedVariation?.id || null,
    //             attributes: flatAttributes,
    //             userId: user.id,
    //             image: mainImage || "No Image",
    //             selectedCountry,
    //         };

    //         console.log("🛒 NEW CART ITEM:", cartItem);

    //         // 7️⃣ Add to Cart
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success(result.message || "Item added to cart!");

    //         // ✅ Refresh cart
    //         dispatch(fetchCart());
    //     } catch (err) {
    //         console.error("❌ ADD TO CART ERROR:", err);
    //         toast.error(err.message || "Failed to add product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    // const increment = () => {
    //     const newQty = quantity + 1;
    //     setQuantity(newQty);
    //     if (isInCart) handleUpdateQuantity(cartItem.id, newQty);
    // };

    // // ➖ decrement or delete
    // const decrement = () => {
    //     if (quantity === 1 && isInCart) {
    //         setShowConfirm(true);
    //     } else {
    //         const newQty = Math.max(1, quantity - 1);
    //         setQuantity(newQty);
    //         if (isInCart) handleUpdateQuantity(cartItem.id, newQty);
    //     }
    // };
    // const increment = async () => {
    //     const newQty = quantity + 1;
    //     setQuantity(newQty);

    //     // 🔁 Recalculate bulk offer eligibility
    //     const newBulkStatus = computeBulkStatus({
    //         product,
    //         selectedVariation,
    //         selectedAttributes,
    //         userCart,
    //         quantity: newQty,
    //     });

    //     if (isInCart) {
    //         const isBulkEligible = newBulkStatus.eligible;

    //         await handleUpdateQuantity(cartItem.id, newQty, {
    //             offerApplied: isBulkEligible,
    //             bulkPrice: isBulkEligible ? newBulkStatus.variationBulkPrice : null,
    //             bulkMinQty: isBulkEligible ? newBulkStatus.variationBulkMinQty : null,
    //         });
    //     }
    // };
    // const increment = async () => {
    //     const newQty = quantity + 1;
    //     console.log("newQty", newQty);

    //     // ✅ pehle local state update mat karo
    //     // setQuantity(newQty);

    //     // ✅ computeBulkStatus pehle karo taaki latest quantity pass ho
    //     const newBulkStatus = computeBulkStatus({
    //         product,
    //         selectedVariation,
    //         selectedAttributes,
    //         userCart,
    //         quantity: newQty,
    //         cartItem,
    //     });

    //     if (isInCart) {
    //         const isBulkEligible = newBulkStatus.eligible;

    //         // ✅ Redux update (offerApplied + new qty)
    //         await updateGroupBulkStatus(newBulkStatus, isBulkEligible, newQty);
    //     }

    //     // ✅ Redux update ke baad local quantity sync karo
    //     setQuantity(newQty);
    // };


    // const decrement = async () => {
    //     if (quantity === 1 && isInCart) {
    //         setShowConfirm(true);
    //     } else {
    //         const newQty = Math.max(1, quantity - 1);
    //         console.log("newQty", newQty)
    //         setQuantity(newQty);

    //         const newBulkStatus = computeBulkStatus({
    //             product,
    //             selectedVariation,
    //             selectedAttributes,
    //             userCart,
    //             quantity: newQty,
    //             cartItem,
    //         });

    //         if (isInCart) {
    //             const isBulkEligible = newBulkStatus.eligible;
    //             await updateGroupBulkStatus(newBulkStatus, isBulkEligible, newQty);
    //         }
    //     }
    // };





    // const decrement = async () => {
    //     if (quantity === 1 && isInCart) {
    //         setShowConfirm(true);
    //     } else {
    //         const newQty = Math.max(1, quantity - 1);
    //         setQuantity(newQty);

    //         // 🔁 Recalculate bulk offer eligibility
    //         const newBulkStatus = computeBulkStatus({
    //             product,
    //             selectedVariation,
    //             selectedAttributes,
    //             userCart,
    //             quantity: newQty,
    //             cartItem, // 👈 must pass current item
    //         });


    //         if (isInCart) {
    //             const isBulkEligible = newBulkStatus.eligible;

    //             await handleUpdateQuantity(cartItem.id, newQty, {
    //                 offerApplied: isBulkEligible,
    //                 bulkPrice: isBulkEligible ? newBulkStatus.variationBulkPrice : null,
    //                 bulkMinQty: isBulkEligible ? newBulkStatus.variationBulkMinQty : null,
    //             });
    //         }
    //     }
    // };



    // const confirmDelete = async () => {
    //     setShowConfirm(false);
    //     await dispatch(deleteCartItem({ id: cartItem.id })).unwrap();

    //     // 🔁 Get updated cart
    //     const updatedCart = await dispatch(fetchCart()).unwrap();

    //     // 🔄 Recalculate bulk for remaining variations
    //     const newBulkStatus = computeBulkStatus({
    //         product,
    //         selectedVariation,
    //         selectedAttributes,
    //         userCart,
    //         quantity: newQty,
    //         cartItem, // 👈 must pass current item
    //     });


    //     const isBulkEligible = newBulkStatus.eligible;

    //     // 🧠 Update all remaining variations in backend
    //     const updates = newBulkStatus.sameGroupItems.map(it => ({
    //         id: it.id,
    //         offerApplied: isBulkEligible,
    //         bulkPrice: isBulkEligible ? newBulkStatus.variationBulkPrice : null,
    //         bulkMinQty: isBulkEligible ? newBulkStatus.variationBulkMinQty : null,
    //     }));

    //     for (const update of updates) {
    //         await dispatch(updateCart(update)).unwrap();
    //     }

    //     setQuantity(1);
    // };

    // const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
    //     const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;

    //     // 🧠 Step 1: For each item, decide its own bulk price logic
    //     await Promise.all(
    //         sameGroupItems.map(async (item) => {
    //             let itemBulkPrice = null;
    //             let itemBulkMinQty = null;
    //             let offerApplied = false;

    //             // 🧩 If eligible → apply offer for all in group
    //             if (isBulkEligible) {
    //                 offerApplied = true;

    //                 // find each item's own variation price (each color/size may differ)
    //                 const itemVariation = product?.variations?.find(
    //                     (v) => v.id === item.variationId
    //                 );

    //                 itemBulkPrice = Number(itemVariation?.bulkPrice) || Number(item.bulkPrice) || 0;
    //                 itemBulkMinQty = variationBulkMinQty;
    //             }

    //             // 🧩 Now update DB
    //             const payload = {
    //                 id: item.id,
    //                 quantity: item.id === cartItem.id ? newQty : item.quantity,
    //                 offerApplied,
    //                 bulkPrice: itemBulkPrice,
    //                 bulkMinQty: itemBulkMinQty,
    //             };

    //             console.log("🔄 Updating cart item:", payload);

    //             // dispatch thunk → updates DB + Redux
    //             await dispatch(updateCart(payload));
    //         })
    //     );

    //     console.log("✅ Bulk group updated in DB:", {
    //         offerApplied: isBulkEligible,
    //         sameGroupItems: sameGroupItems.map(i => ({
    //             color: i.attributes?.color,
    //             qty: i.quantity,
    //         })),
    //     });
    // };

    // const confirmDelete = async () => {
    //     setShowConfirm(false);
    //     await dispatch(deleteCartItem({ id: cartItem.id })).unwrap();

    //     // 🔁 Fetch updated cart
    //     const updatedCart = await dispatch(fetchCart()).unwrap();

    //     // 🧠 Recompute bulk after deletion
    //     const newBulkStatus = computeBulkStatus({
    //         product,
    //         selectedVariation,
    //         selectedAttributes,
    //         userCart: updatedCart, // ✅ pass updated cart
    //         quantity: 1,
    //         cartItem,
    //     });

    //     const isBulkEligible = newBulkStatus.eligible;

    //     // 🧩 Update remaining items properly
    //     await Promise.all(
    //         newBulkStatus.sameGroupItems.map(async (item) => {
    //             const itemVariation = product?.variations?.find(
    //                 (v) => v.id === item.variationId
    //             );
    //             const basePrice = Number(item.pricePerItem);
    //             const itemBulkPrice =
    //                 isBulkEligible && itemVariation?.bulkPrice
    //                     ? Number(itemVariation.bulkPrice)
    //                     : null;

    //             const totalPrice = isBulkEligible
    //                 ? itemBulkPrice * item.quantity
    //                 : basePrice * item.quantity;

    //             await dispatch(
    //                 updateCart({
    //                     id: item.id,
    //                     offerApplied: isBulkEligible,
    //                     bulkPrice: itemBulkPrice,
    //                     bulkMinQty: isBulkEligible ? newBulkStatus.variationBulkMinQty : null,
    //                     totalPrice,
    //                 })
    //             );
    //         })
    //     );

    //     await dispatch(fetchCart());
    //     setQuantity(1);
    // };




    // const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
    //     const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;

    //     await Promise.all(
    //         sameGroupItems.map(async (item) => {
    //             let offerApplied = false;
    //             let itemBulkPrice = null;
    //             let itemBulkMinQty = null;
    //             let totalPrice = 0;

    //             // 🧩 Determine per item variation bulk price
    //             const itemVariation = product?.variations?.find(
    //                 (v) => v.id === item.variationId
    //             );
    //             const basePrice = Number(item.pricePerItem);

    //             if (isBulkEligible) {
    //                 offerApplied = true;
    //                 itemBulkPrice =
    //                     Number(itemVariation?.bulkPrice) || Number(item.bulkPrice) || basePrice;
    //                 itemBulkMinQty = variationBulkMinQty;
    //                 totalPrice = itemBulkPrice * (item.id === cartItem.id ? newQty : item.quantity);
    //             } else {
    //                 // Offer revoked
    //                 offerApplied = false;
    //                 itemBulkPrice = null;
    //                 itemBulkMinQty = null;
    //                 totalPrice = basePrice * (item.id === cartItem.id ? newQty : item.quantity);
    //             }

    //             // 🧩 Final payload for DB
    //             const payload = {
    //                 id: item.id,
    //                 quantity: item.id === cartItem.id ? newQty : item.quantity,
    //                 offerApplied,
    //                 bulkPrice: itemBulkPrice,
    //                 bulkMinQty: itemBulkMinQty,
    //                 totalPrice,
    //             };

    //             console.log("🔄 Updating cart item:", payload);

    //             await dispatch(updateCart(payload));
    //         })
    //     );

    //     console.log("✅ Bulk group updated in DB:", {
    //         offerApplied: isBulkEligible,
    //         sameGroupItems: sameGroupItems.map((i) => ({
    //             color: i.attributes?.color,
    //             qty: i.quantity,
    //         })),
    //     });

    //     // 🔁 Optional but recommended: re-fetch cart
    //     await dispatch(fetchCart());
    //     dispatch(triggerCartRefresh());
    // };


    // const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
    //     const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;

    //     await Promise.all(
    //         sameGroupItems.map(async (item) => {
    //             const basePrice = Number(item.pricePerItem);

    //             // 🟢 Initialize product offer flags
    //             let productOfferApplied = item.productOfferApplied || false;
    //             let productOfferDiscount = item.productOfferDiscount || 0;

    //             // 🟢 Initialize bulk-related flags
    //             let offerApplied = false; // bulk only
    //             let itemBulkPrice = null;
    //             let itemBulkMinQty = null;
    //             let totalPrice = 0;

    //             // 🔹 Apply bulk if eligible
    //             if (isBulkEligible) {
    //                 offerApplied = true;
    //                 itemBulkPrice = Number(item.bulkPrice) || variationBulkPrice || basePrice;
    //                 itemBulkMinQty = variationBulkMinQty;
    //                 totalPrice = itemBulkPrice * (item.id === cartItem.id ? newQty : item.quantity);
    //             } else {
    //                 // 🔹 Bulk not eligible → compute product-level offer
    //                 offerApplied = false;
    //                 itemBulkPrice = null;
    //                 itemBulkMinQty = null;

    //                 // ✅ Compute product offer dynamically
    //                 const variation = product?.variations?.find(v => v.id === item.variationId) || null;
    //                 const productOffer = applyProductOffers(
    //                     product,
    //                     variation,
    //                     item.id === cartItem.id ? newQty : item.quantity
    //                 );

    //                 productOfferApplied = productOffer.offerApplied || false;
    //                 productOfferDiscount = productOffer.offerDiscount || 0;

    //                 if (productOfferApplied && productOfferDiscount > 0) {
    //                     totalPrice =
    //                         basePrice *
    //                         (1 - productOfferDiscount / 100) *
    //                         (item.id === cartItem.id ? newQty : item.quantity);
    //                 } else {
    //                     totalPrice = basePrice * (item.id === cartItem.id ? newQty : item.quantity);
    //                 }
    //             }

    //             // 🔹 Prepare payload for Redux/DB
    //             const payload = {
    //                 id: item.id,
    //                 quantity: item.id === cartItem.id ? newQty : item.quantity,
    //                 offerApplied,           // bulk only
    //                 bulkPrice: itemBulkPrice,
    //                 bulkMinQty: itemBulkMinQty,
    //                 productOfferApplied,    // range/percentage/buyXGetY
    //                 productOfferDiscount,
    //                 totalPrice,
    //             };

    //             console.log("🔄 Updating cart item:", payload);

    //             await dispatch(updateCart(payload));
    //         })
    //     );

    //     console.log("✅ Bulk group updated in DB:", {
    //         offerApplied: isBulkEligible,
    //         sameGroupItems: sameGroupItems.map((i) => ({
    //             color: i.attributes?.color,
    //             qty: i.quantity,
    //         })),
    //     });

    //     // 🔁 Optional but recommended: re-fetch cart
    //     await dispatch(fetchCart());
    //     dispatch(triggerCartRefresh());
    // };

    const confirmDelete = async () => {
        setShowConfirm(false);
        await dispatch(deleteCartItem({ id: cartItem.id })).unwrap();

        // 🔁 Fetch updated cart
        const updatedCart = await dispatch(fetchCart()).unwrap();

        // 🧠 Recompute bulk after deletion
        const newBulkStatus = computeBulkStatus({
            product,
            selectedVariation,
            selectedAttributes,
            userCart: updatedCart, // ✅ pass updated cart
            quantity: 1,
            cartItem,
        });

        const isBulkEligible = newBulkStatus.eligible;

        // 🧩 Update remaining items properly
        await Promise.all(
            newBulkStatus.sameGroupItems.map(async (item) => {
                const itemVariation = product?.variations?.find(
                    (v) => v.id === item.variationId
                );
                const basePrice = Number(item.pricePerItem);
                let itemBulkPrice = null;
                let itemBulkMinQty = null;
                let totalPrice = basePrice;
                let offerApplied = false;
                let productOfferApplied = false;
                let productOfferDiscount = 0;
                let productOfferId = null;
                let productOfferMeta = null;

                // 🔹 Bulk logic
                if (isBulkEligible) {
                    offerApplied = true;
                    itemBulkPrice = Number(itemVariation?.bulkPrice || newBulkStatus.variationBulkPrice || basePrice);
                    itemBulkMinQty = newBulkStatus.variationBulkMinQty;
                    totalPrice = itemBulkPrice * item.quantity;
                } else {
                    // 🔹 Product offer logic
                    const groupVariation = product?.variations?.find(
                        (v) => v.id === item.variationId
                    ) || item;

                    const groupProductOffer = applyProductOffers(
                        product,
                        groupVariation,
                        item.quantity,
                        updatedCart,
                        item.id
                    );

                    productOfferApplied = groupProductOffer.offerApplied;
                    productOfferDiscount = groupProductOffer.offerDiscount;
                    productOfferId = groupProductOffer.offerId;
                    productOfferMeta = groupProductOffer.offerMeta;

                    totalPrice =
                        productOfferApplied && productOfferDiscount > 0
                            ? basePrice * (1 - productOfferDiscount / 100) * item.quantity
                            : basePrice * item.quantity;
                }

                await dispatch(
                    updateCart({
                        id: item.id,
                        quantity: item.quantity,
                        offerApplied,
                        bulkPrice: itemBulkPrice,
                        bulkMinQty: itemBulkMinQty,
                        totalPrice,
                        productOfferApplied,
                        productOfferDiscount,
                        productOfferId,
                        productOffer: productOfferMeta,
                    })
                );
            })
        );

        await dispatch(fetchCart());
        setQuantity(1);
    };




    // const applyProductOffers = (product, selectedVariation, quantity, userCart = [], cartItemId = null) => {
    //     let offerApplied = false;
    //     let offerDiscount = 0;
    //     let offerMeta = null;
    //     let offerId = null;

    //     const productOffers = (product.offers || []).filter(o => o.active);
    //     if (!productOffers.length) return { offerApplied, offerDiscount, offerId, offerMeta };

    //     // 🔹 Normalize attributes ignoring color/colour
    //     const getCoreAttrs = (attrs = {}) => {
    //         const core = {};
    //         for (const [k, v] of Object.entries(attrs)) {
    //             if (!["color", "colour"].includes(k.toLowerCase())) {
    //                 core[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
    //             }
    //         }
    //         return core;
    //     };

    //     const selectedCore = getCoreAttrs(selectedVariation?.attributes);

    //     const sameCoreVariation = (item) => {
    //         const itemCore = getCoreAttrs(item.attributes);
    //         return Object.entries(selectedCore).every(([k, v]) => itemCore[k] && itemCore[k] === v);
    //     };

    //     // 🔹 Compute total group quantity including updated item if cartItemId provided
    //     const totalGroupQty = userCart.reduce((sum, item) => {
    //         if (item.productId !== product.id) return sum;
    //         if (!sameCoreVariation(item)) return sum;

    //         // ✅ Replace qty for the item being updated
    //         if (cartItemId && item.id === cartItemId) return sum + quantity;
    //         return sum + item.quantity;
    //     }, 0);

    //     // 🔹 For new add-to-cart item, include quantity
    //     const finalGroupQty = cartItemId ? totalGroupQty : totalGroupQty + quantity;
    //     const price = Number(selectedVariation.pricePerItem || selectedVariation.price || 0);

    //     for (const offer of productOffers) {
    //         if (offer.discountType === "percentage") {
    //             offerApplied = true;
    //             offerDiscount = Number(offer.discountValue.percent);
    //             offerId = offer.id;

    //             const totalBefore = finalGroupQty * price;
    //             const savings = (totalBefore * offerDiscount) / 100;
    //             const totalAfter = totalBefore - savings;

    //             offerMeta = {
    //                 id: offer.id,
    //                 name: "Percentage",
    //                 discountType: offer.discountType,
    //                 discountValue: offer.discountValue,
    //                 appliedQty: finalGroupQty,

    //                 // ⭐ NEW FIELDS
    //                 totalPriceBeforeOffer: totalBefore,
    //                 totalPriceAfterOffer: totalAfter,
    //                 totalSavings: savings,
    //                 freeQuantityValue: 0,
    //             };
    //             break;
    //         } else if (offer.discountType === "rangeBuyXGetY") {
    //             const { start, end, free } = offer.discountValue;
    //             if (finalGroupQty >= start && finalGroupQty <= end) {
    //                 offerApplied = true;
    //                 offerDiscount = 0;
    //                 offerId = offer.id;
    //                 const paidQty = finalGroupQty - free;

    //                 const totalBefore = finalGroupQty * price;
    //                 const freeValue = free * price;
    //                 const totalAfter = totalBefore - freeValue;
    //                 offerMeta = {
    //                     id: offer.id,
    //                     name: "Range",
    //                     discountType: offer.discountType,
    //                     discountValue: { start, end, free },
    //                     appliedQty: finalGroupQty,
    //                     effectivePaidQty: paidQty,
    //                     freeQty: free,
    //                     offerValue: `${free} Free on ${start}–${end} range`,
    //                     totalPriceBeforeOffer: totalBefore,
    //                     totalPriceAfterOffer: totalAfter,
    //                     totalSavings: freeValue,
    //                     freeQuantityValue: freeValue,
    //                 };
    //                 break;
    //             }
    //         } else if (offer.discountType === "buyXGetY") {
    //             const { buy, get } = offer.discountValue;
    //             if (finalGroupQty >= buy) {
    //                 offerApplied = true;
    //                 offerDiscount = 0;
    //                 offerId = offer.id;
    //                 const paidQty = finalGroupQty - get;

    //                 const totalBefore = finalGroupQty * price;
    //                 const freeValue = get * price;
    //                 const totalAfter = totalBefore - freeValue;

    //                 offerMeta = {
    //                     id: offer.id,
    //                     name: "BuyXGetY",
    //                     discountType: offer.discountType,
    //                     discountValue: { buy, get },
    //                     appliedQty: finalGroupQty,
    //                     effectivePaidQty: paidQty,
    //                     freeQty: get,
    //                     offerValue: `${get} Free on buying ${buy}`,
    //                     totalPriceBeforeOffer: totalBefore,
    //                     totalPriceAfterOffer: totalAfter,
    //                     totalSavings: freeValue,
    //                     freeQuantityValue: freeValue,
    //                 };
    //                 break;
    //             }
    //         }
    //     }

    //     return { offerApplied, offerDiscount, offerId, offerMeta };
    // };






    // const applyProductOffers = (product, selectedVariation, quantity, userCart = []) => {
    //     let offerApplied = false;
    //     let offerDiscount = 0;
    //     let offerMeta = null; // ✅ for JSON
    //     let offerId = null;

    //     const productOffers = (product.offers || []).filter(o => o.active);
    //     if (productOffers.length === 0) return { offerApplied, offerDiscount, offerId, offerMeta };

    //     const getCoreAttrs = (attrs = {}) => {
    //         const core = {};
    //         for (const [k, v] of Object.entries(attrs)) {
    //             if (!["color", "colour"].includes(k.toLowerCase())) {
    //                 core[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
    //             }
    //         }
    //         return core;
    //     };

    //     const selectedCore = getCoreAttrs(selectedVariation?.attributes);

    //     const sameCoreVariation = (item) => {
    //         const itemCore = getCoreAttrs(item.attributes);
    //         return Object.entries(selectedCore).every(([k, v]) => itemCore[k] && itemCore[k] === v);
    //     };

    //     const totalGroupQty =
    //         userCart.reduce((sum, item) => {
    //             if (item.productId !== product.id) return sum;
    //             if (sameCoreVariation(item)) {
    //                 return sum + item.quantity;
    //             }
    //             return sum;
    //         }, 0) + quantity;

    //     for (const offer of productOffers) {
    //         // Percentage
    //         if (offer.discountType === "percentage") {
    //             offerApplied = true;
    //             offerDiscount = Number(offer.discountValue.percent);
    //             offerId = offer.id;
    //             offerMeta = null;
    //             break;
    //         }

    //         // Range Buy X Get Y
    //         else if (offer.discountType === "rangeBuyXGetY") {
    //             const { start, end, free } = offer.discountValue;
    //             if (totalGroupQty >= start && totalGroupQty <= end) {
    //                 offerApplied = true;
    //                 offerDiscount = 0;
    //                 offerId = offer.id;

    //                 const paidQty = totalGroupQty - free;
    //                 offerMeta = {
    //                     id: offer.id,
    //                     name: "Range",
    //                     discountType: offer.discountType,
    //                     discountValue: { start, end, free },
    //                     appliedQty: totalGroupQty,
    //                     effectivePaidQty: paidQty,
    //                     freeQty: free,
    //                     offerValue: `${free} Free on ${start}–${end} range`
    //                 };
    //                 break;
    //             }
    //         }

    //         // Buy X Get Y
    //         else if (offer.discountType === "buyXGetY") {
    //             const { buy, get } = offer.discountValue;
    //             if (totalGroupQty >= buy) {
    //                 offerApplied = true;
    //                 offerDiscount = 0;
    //                 offerId = offer.id;

    //                 const paidQty = totalGroupQty - get;
    //                 offerMeta = {
    //                     id: offer.id,
    //                     name: "BuyXGetY",
    //                     discountType: offer.discountType,
    //                     discountValue: { buy, get },
    //                     appliedQty: totalGroupQty,
    //                     effectivePaidQty: paidQty,
    //                     freeQty: get,
    //                     offerValue: `${get} Free on buying ${buy}`
    //                 };
    //                 break;
    //             }
    //         }
    //     }

    //     return { offerApplied, offerDiscount, offerId, offerMeta };
    // };

    // const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
    //     const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;



    //     const normalizeAttrs = (attrs = {}) => {
    //         const result = {};
    //         Object.entries(attrs).forEach(([k, v]) => {
    //             if (!["color", "colour"].includes(k.toLowerCase())) {
    //                 result[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
    //             }
    //         });
    //         return result;
    //     };

    //     console.log("===== updateGroupBulkStatus START =====");

    //     const groupCoreAttrs = normalizeAttrs(sameGroupItems[0].attributes || {});

    //     // 🔹 Compute group-level quantity ignoring color
    //     const totalGroupQty = userCart.reduce((sum, cItem) => {
    //         if (
    //             cItem.productId !== product.id ||
    //             cItem.purchasePlatform !== purchasePlatform
    //         ) return sum;

    //         const cartCoreAttrs = normalizeAttrs(cItem.attributes || {});
    //         const isSameCore = Object.entries(groupCoreAttrs).every(
    //             ([k, v]) => cartCoreAttrs[k] === v
    //         );
    //         const qtyToAdd = cItem.id === cartItem.id ? newQty : cItem.quantity;
    //         return isSameCore ? sum + qtyToAdd : sum;
    //     }, 0);

    //     console.log("totalGroupQty", totalGroupQty);

    //     // 🔹 Apply product offer for the group (pass cartItem.id for updates)
    //     const groupVariation = product?.variations?.find(v => v.id === sameGroupItems[0].variationId) || sameGroupItems[0];
    //     const groupProductOffer = applyProductOffers(product, groupVariation, totalGroupQty, userCart, cartItem.id);

    //     console.log("groupProductOffer", groupProductOffer);

    //     // 🔹 Update each item with offer & bulk logic
    //     await Promise.all(
    //         sameGroupItems.map(async (item) => {
    //             console.log("\n--- Processing item ---", item);

    //             const itemVariation = product?.variations?.find(
    //                 (v) => v.id === item.variationId
    //             );

    //             const basePrice = Number(item.pricePerItem);
    //             let offerApplied = false;
    //             let itemBulkPrice = null;
    //             let itemBulkMinQty = null;
    //             let totalPrice = 0;

    //             let itemQty = item.id === cartItem.id ? newQty : item.quantity;

    //             if (isBulkEligible) {
    //                 // 🔹 Bulk logic unchanged
    //                 offerApplied = true;
    //                 itemBulkPrice = Number(itemVariation?.bulkPrice) || Number(item.bulkPrice) || basePrice;
    //                 itemBulkMinQty = variationBulkMinQty;
    //                 totalPrice = itemBulkPrice * itemQty;

    //                 // ✅ Product offer must be cleared for all items in group
    //                 await dispatch(
    //                     updateCart({
    //                         id: item.id,
    //                         quantity: itemQty,
    //                         offerApplied,
    //                         bulkPrice: itemBulkPrice,
    //                         bulkMinQty: itemBulkMinQty,
    //                         totalPrice,
    //                         productOfferApplied: false,
    //                         productOfferDiscount: null,
    //                         productOfferId: null,
    //                         productOffer: null,
    //                     })
    //                 );
    //             } else {
    //                 // 🔹 Product offer logic
    //                 // Calculate offer per item to make sure sabka JSON update ho
    //                 const groupVariation = product?.variations?.find(
    //                     (v) => v.id === item.variationId
    //                 ) || item;

    //                 const productOffer = groupProductOffer;

    //                 const productOfferApplied = productOffer.offerApplied;
    //                 const productOfferDiscount = productOffer.offerDiscount;
    //                 const productOfferId = productOffer.offerId;
    //                 const productOfferMeta = productOffer.offerMeta;

    //                 totalPrice =
    //                     productOfferApplied && productOfferDiscount > 0
    //                         ? basePrice * (1 - productOfferDiscount / 100) * itemQty
    //                         : basePrice * itemQty;

    //                 const shouldResetOffers = !productOfferApplied;

    //                 await dispatch(
    //                     updateCart({
    //                         id: item.id,
    //                         quantity: itemQty,
    //                         offerApplied,
    //                         bulkPrice: null,
    //                         bulkMinQty: null,
    //                         totalPrice,
    //                         productOfferApplied: shouldResetOffers ? false : productOfferApplied,
    //                         productOfferDiscount: shouldResetOffers
    //                             ? null
    //                             : productOfferDiscount,
    //                         productOfferId: shouldResetOffers ? null : productOfferId,
    //                         productOffer: shouldResetOffers ? null : productOfferMeta,
    //                     })
    //                 );
    //             }
    //         })
    //     );

    //     await dispatch(fetchCart());
    //     dispatch(triggerCartRefresh());
    //     console.log("===== updateGroupBulkStatus END =====");
    // };

    const increment = async () => {
        const newQty = quantity + 1;
        const newBulkStatus = computeBulkStatus({
            product,
            selectedVariation,
            selectedAttributes,
            userCart,
            quantity: newQty,
            cartItem,
        });
        if (isInCart) {
            await updateGroupBulkStatus(newBulkStatus, newBulkStatus.eligible, newQty);
        }
        setQuantity(newQty); // last
    };

    const decrement = async () => {
        if (quantity === 1 && isInCart) setShowConfirm(true);
        else {
            const newQty = Math.max(1, quantity - 1);
            const newBulkStatus = computeBulkStatus({
                product,
                selectedVariation,
                selectedAttributes,
                userCart,
                quantity: newQty,
                cartItem,
            });
            if (isInCart) await updateGroupBulkStatus(newBulkStatus, newBulkStatus.eligible, newQty);
            setQuantity(newQty);
        }
    };

    const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
        const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;

        const normalizeAttrs = (attrs = {}) => {
            const result = {};
            Object.entries(attrs).forEach(([k, v]) => {
                if (!["color", "colour"].includes(k.toLowerCase())) {
                    result[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
                }
            });
            return result;
        };

        const groupCoreAttrs = normalizeAttrs(sameGroupItems[0].attributes || {});

        // build string key
        const groupCoreKey = Object.entries(groupCoreAttrs)
            .map(([k, v]) => `${k}:${v}`)
            .join("|");

        const totalGroupQty = userCart.reduce((sum, cItem) => {
            if (cItem.productId !== product.id || cItem.purchasePlatform !== purchasePlatform) return sum;

            const cartCoreAttrs = normalizeAttrs(cItem.attributes || {});
            const cartCoreKey = Object.entries(cartCoreAttrs)
                .map(([k, v]) => `${k}:${v}`)
                .join("|");

            const isSameCore = groupCoreKey === cartCoreKey;
            const qtyToAdd = cItem.id === cartItem.id ? newQty : cItem.quantity;
            return isSameCore ? sum + qtyToAdd : sum;
        }, 0);

        console.log("normalizeAttrs", normalizeAttrs)
        console.log("groupCoreAttrs", groupCoreAttrs)
        console.log("totalGroupQty", totalGroupQty)
        // 🔹 Apply product offer for the group
        const groupCoreAttributes = {};
        Object.entries(groupCoreAttrs).forEach(([k, v]) => {
            groupCoreAttributes[k] = v;
        });
        const groupVariation = product?.variations?.find(v => v.id === sameGroupItems[0].variationId) || sameGroupItems[0];
        console.log("productpage", product)
        console.log("groupVariation", groupVariation)
        console.log("userCart", userCart)
        console.log("cartItem.id", cartItem.id)
        console.log("cartItem.attributes", cartItem.attributes)
        const updatedCartForOffer = userCart.map(it => {
            if (it.id === cartItem.id) {
                return { ...it, quantity: newQty };
            }
            return it;
        });
        const groupProductOffer = applyProductOffers(
            product,
            groupVariation,
            newQty, // pass the incremented quantity
            updatedCartForOffer, // ✅ updated cart
            cartItem.id,
            cartItem.attributes // ⚡ Pass the core attributes here
        );
        console.log("💥 groupProductOffer after qty update:", groupProductOffer);
        console.log("💥 Free Items:", groupProductOffer.offerMeta?.freeItems || []);
        console.log("💥 Paid Items:", groupProductOffer.offerMeta?.paidItems || []);

        console.log("totalGroupQty", totalGroupQty);
        console.log("cartItem.id", cartItem.id);
        console.log("sameGroupItems", sameGroupItems);
        console.log("product.offers", product.offers);
        // 🔹 Update each item with offer & bulk logic
        await Promise.all(
            sameGroupItems.map(async (item) => {
                const itemVariation = product?.variations?.find(v => v.id === item.variationId) || item;
                const basePrice = Number(item.pricePerItem);
                const itemQty = item.id === cartItem.id ? newQty : item.quantity;

                // 🔹 Bulk logic
                let totalPrice = basePrice * itemQty;
                let bulkPrice = null;
                let bulkMinQty = null;
                let offerApplied = false;
                let productOfferApplied = false;
                let productOfferDiscount = null;
                let productOfferId = null;
                let productOfferMeta = null;

                if (isBulkEligible) {
                    bulkPrice = Number(itemVariation?.bulkPrice || item.bulkPrice || basePrice);
                    bulkMinQty = variationBulkMinQty;
                    totalPrice = bulkPrice * itemQty;
                    offerApplied = true;

                    // Clear product offers if bulk applies
                    productOfferApplied = false;
                    productOfferDiscount = null;
                    productOfferId = null;
                    productOfferMeta = null;

                } else if (groupProductOffer && groupProductOffer.offerApplied) {
                    // 🔹 Apply the precomputed group offer
                    productOfferApplied = true;
                    productOfferDiscount = groupProductOffer.offerDiscount || null;
                    productOfferId = groupProductOffer.offerId || null;
                    productOfferMeta = groupProductOffer.offerMeta || null;

                    totalPrice = groupProductOffer.offerMeta.totalPriceAfterOffer;
                }

                const finaldata = await dispatch(updateCart({
                    id: item.id,
                    quantity: itemQty,
                    totalPrice,
                    offerApplied,
                    bulkPrice,
                    bulkMinQty,
                    productOfferApplied,
                    productOfferDiscount,
                    productOfferId,
                    productOffer: productOfferMeta,
                }));
                console.log("finaldata", finaldata)

            })
        );

        await dispatch(fetchCart());
        dispatch(triggerCartRefresh());
    };


    const buildFreePaidItems = (freeQty, sameCoreVariation, cart) => {
        let items = cart
            .filter(it => {
                if (
                    it.productId !== product.id ||
                    it.purchasePlatform !== purchasePlatform
                ) return false;

                return sameCoreVariation(it); // color ignore + core attribute match
            })
            .map(it => ({
                id: it.id,
                variationId: it.variationId,
                attributes: it.attributes,
                quantity: it.quantity,
                price: Number(it.pricePerItem || it.price),
                addedAt: it.addedAt || 0
            }));


        const freeItems = [];
        const paidItems = [];

        while (freeQty > 0 && items.length > 0) {
            let minPrice = Math.min(...items.map(i => i.price));
            let lowestItems = items.filter(i => i.price === minPrice);
            let selected = lowestItems.reduce((a, b) =>
                a.addedAt > b.addedAt ? a : b
            );

            let freeTake = Math.min(selected.quantity, freeQty);

            freeItems.push({
                ...selected,
                freeQty: freeTake
            });

            selected.quantity -= freeTake;
            freeQty -= freeTake;

            if (selected.quantity === 0) {
                items = items.filter(i => i.id !== selected.id);
            }
        }

        for (const item of items) {
            paidItems.push({
                ...item,
                paidQty: item.quantity
            });
        }

        return { freeItems, paidItems };
    };



    const applyProductOffers = (product, selectedVariation, quantity, userCart = [], cartItemId = null, incomingAttributes = {}) => {
        let offerApplied = false;
        let offerDiscount = 0;
        let offerMeta = null;
        let offerId = null;



        const productOffers = (product.offers || []).filter(o => o.active);
        if (!productOffers.length) return { offerApplied, offerDiscount, offerId, offerMeta };

        // 🔹 Normalize attributes ignoring color/colour
        const getCoreAttrs = (attrs = {}) => {
            const core = {};
            for (const [k, v] of Object.entries(attrs)) {
                if (!["color", "colour"].includes(k.toLowerCase())) {
                    core[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
                }
            }
            return core;
        };
        console.log("getCoreAttrs", getCoreAttrs)
        console.log("selectedVariation", selectedVariation);
        console.log("attributes", selectedVariation?.attributes);

        // const selectedCore = getCoreAttrs(selectedVariation?.attributes);
        // const selectedCore = getCoreAttrs(incomingAttributes);
        // Always fallback on incomingAttributes first
        const selectedCore = getCoreAttrs(incomingAttributes || selectedVariation.attributes || {});

        console.log("selectedCore", selectedCore)

        const sameCoreVariation = (item) => {
            if (item.purchasePlatform !== purchasePlatform) return false;

            const itemCore = getCoreAttrs(item.attributes);

            const isSame = Object.entries(selectedCore).every(([k, v]) => itemCore[k] && itemCore[k] === v);

            console.log("🟢 Checking item:", item.id);
            console.log("Item attributes:", item.attributes);
            console.log("Item core attrs:", itemCore);
            console.log("Selected core attrs:", selectedCore);
            console.log("Same core match result:", isSame);

            return isSame;
        };


        // const sameCoreVariationSafe = (item) => {
        //     if (!selectedCore || Object.keys(selectedCore).length === 0) return false;
        //     return sameCoreVariation(item);
        // };
        // console.log("sameCoreVariationSafe" , sameCoreVariationSafe)
        // 🔹 Compute total group quantity including updated item if cartItemId provided
        const totalGroupQty = userCart.reduce((sum, item) => {
            if (
                item.productId !== product.id ||
                item.purchasePlatform !== purchasePlatform
            ) return sum;

            if (!sameCoreVariation(item)) return sum;

            if (cartItemId && item.id === cartItemId) return sum + quantity;
            return sum + item.quantity;
        }, 0);

        const finalGroupQty = cartItemId ? totalGroupQty : totalGroupQty + quantity;
        const price = Number(selectedVariation.pricePerItem || selectedVariation.price || 0);

        const updatedCartForFreeCalc = userCart.map(it => ({
            ...it,
            attributes: { ...(it.attributes || {}) },
            // addedAt: it.addedAt || Date.now()
        }));
        console.log("Updated Cart for Free Calc", updatedCartForFreeCalc);
        console.log("Selected Core", selectedCore);
        console.log("🟢 Updated Cart for Free Calc", updatedCartForFreeCalc.map(i => ({ id: i.id, attrs: i.attributes, platform: i.purchasePlatform, qty: i.quantity })));


        // 👉 If this is a new add-to-cart operation (not update)
        if (!cartItemId) {
            updatedCartForFreeCalc.push({
                id: "__temp__",
                productId: product.id,
                variationId: selectedVariation.id,
                // attributes: selectedVariation.attributes,
                attributes: incomingAttributes,
                quantity,
                pricePerItem: selectedVariation.pricePerItem || selectedVariation.price,
                addedAt: Date.now(),
                createdAt: new Date().toISOString(),
                purchasePlatform
            });
        }

        // 👉 If update case:
        if (cartItemId) {
            updatedCartForFreeCalc.forEach((it) => {
                if (it.id === cartItemId) {
                    it.quantity = quantity;
                    it.addedAt = it.addedAt || Date.now();
                }
            });
        }

        for (const offer of productOffers) {

            // 🔥 Offer Check Starts

            // 1️⃣ Percentage
            if (offer.discountType === "percentage") {
                offerApplied = true;
                offerDiscount = Number(offer.discountValue.percent);
                offerId = offer.id;

                const totalBefore = finalGroupQty * price;
                const savings = (totalBefore * offerDiscount) / 100;
                const totalAfter = totalBefore - savings;

                offerMeta = {
                    id: offer.id,
                    name: "Percentage",
                    discountType: offer.discountType,
                    discountValue: offer.discountValue,
                    appliedQty: finalGroupQty,
                    totalPriceBeforeOffer: totalBefore,
                    totalPriceAfterOffer: totalAfter,
                    totalSavings: savings,
                    freeQuantityValue: 0,
                    freeItems: [],
                    paidItems: []
                };
                break;
            }

            // 2️⃣ Range Buy X Get Y
            if (offer.discountType === "rangeBuyXGetY") {
                const { start, end, free } = offer.discountValue;
                if (finalGroupQty >= start && finalGroupQty <= end) {
                    offerApplied = true;
                    offerDiscount = 0;
                    offerId = offer.id;

                    const { freeItems, paidItems } =
                        buildFreePaidItems(free, sameCoreVariation, updatedCartForFreeCalc);


                    const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

                    const totalBefore = updatedCartForFreeCalc
                        .filter(it => sameCoreVariation(it))
                        .reduce(
                            (sum, it) => sum + it.quantity * Number(it.pricePerItem || it.price),
                            0
                        );

                    const totalAfter = totalBefore - freeValue;


                    offerMeta = {
                        id: offer.id,
                        name: "Range",
                        discountType: offer.discountType,
                        discountValue: { start, end, free },
                        appliedQty: finalGroupQty,
                        freeQty: free,
                        freeItems,
                        paidItems,
                        // totalPriceBeforeOffer: finalGroupQty * price,
                        // totalPriceAfterOffer: finalGroupQty * price - freeValue,
                        // totalSavings: freeValue,
                        // freeQuantityValue: freeValue
                        totalPriceBeforeOffer: totalBefore,
                        totalPriceAfterOffer: totalAfter,
                        totalSavings: freeValue,
                        freeQuantityValue: freeValue,

                    };
                    break;
                }
            }

            // 3️⃣ Buy X Get Y
            if (offer.discountType === "buyXGetY") {
                const { buy, get } = offer.discountValue;
                if (finalGroupQty >= buy) {
                    offerApplied = true;
                    offerDiscount = 0;
                    offerId = offer.id;

                    const { freeItems, paidItems } =
                        buildFreePaidItems(free, sameCoreVariation, updatedCartForFreeCalc);


                    const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

                    const totalBefore = paidItems.reduce(
                        (sum, i) => sum + i.quantity * i.price,
                        0
                    ) + freeItems.reduce(
                        (sum, i) => sum + i.quantity * i.price,
                        0
                    );

                    const totalAfter = totalBefore - freeValue;

                    offerMeta = {
                        id: offer.id,
                        name: "BuyXGetY",
                        discountType: offer.discountType,
                        discountValue: { buy, get },
                        appliedQty: finalGroupQty,
                        freeQty: get,
                        freeItems,
                        paidItems,
                        // totalPriceBeforeOffer: finalGroupQty * price,
                        // totalPriceAfterOffer: finalGroupQty * price - freeValue,
                        // totalSavings: freeValue,
                        // freeQuantityValue: freeValue
                        totalPriceBeforeOffer: totalBefore,
                        totalPriceAfterOffer: totalAfter,
                        totalSavings: freeValue,
                        freeQuantityValue: freeValue,

                    };
                    break;
                }
            }
        }

        return { offerApplied, offerDiscount, offerId, offerMeta };
    };


    const addToCart = async () => {
        if (!user?.id) {
            toast.error("Please login to add items to your cart.");
            return;
        }
        const barCode = product.barCode || null;
        // 🔹 Determine selected country
        let selectedCountryCode = localStorage.getItem("selectedCountry");
        if (!selectedCountryCode) {
            toast.error("Something went wrong! Country not found.");
            return;
        }

        selectedCountryCode = selectedCountryCode.toUpperCase();
        let selectedCountryObj = countries.find(
            c => c.code.toUpperCase() === selectedCountryCode
        );
        if (!selectedCountryObj && selectedCountryCode.length === 3) {
            selectedCountryObj = countries.find(c =>
                c.code.toUpperCase().startsWith(selectedCountryCode.slice(0, 2))
            );
        }
        const selectedCountry = selectedCountryObj?.name || selectedCountryCode;

        // 🔹 Check if cart has different country
        if (userCart?.length > 0) {
            const cartCountry = userCart[0]?.selectedCountry;
            if (cartCountry && cartCountry !== selectedCountry) {
                setNewCountry(selectedCountry);
                setShowCountryModal(true);
                return;
            }
        }

        setLoading(true);

        try {
            const priceObj = displayedPrice();
            const basePrice = Number(priceObj.original);
            const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
            const currency = selectedVariation?.currency || product.currency || "INR";

            // 🔹 Flatten attributes
            const flatAttributes = {};
            Object.entries(selectedAttributes).forEach(([key, val]) => {
                if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
            });

            // 🔹 Bulk initialization
            let offerApplied = false;
            let bulkPrice = null;
            let bulkMinQty = null;
            const hasBulkOffer =
                Number(product?.minQuantity) > 0 && Number(selectedVariation?.bulkPrice) > 0;

            let sameGroupItems = [];
            let totalGroupQty = quantity;

            if (hasBulkOffer) {
                const productMinQty = Number(product.minQuantity);
                const variationBulkPrice = Number(selectedVariation.bulkPrice);
                const variationBulkMinQty = Number(selectedVariation.bulkMinQty || productMinQty);
                const requiredQty = variationBulkMinQty || productMinQty;

                const coreAttributes = Object.entries(flatAttributes).filter(
                    ([key]) => !["color", "colour"].includes(key.toLowerCase())
                );
                const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

                sameGroupItems =
                    userCart?.filter(item => {
                        if (
                            item.productId !== product.id ||
                            item.purchasePlatform !== purchasePlatform   // ✅
                        ) return false;

                        const itemCoreKey = Object.entries(item.attributes || {})
                            .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
                            .map(([k, v]) => `${k}:${v}`)
                            .join("|");
                        return itemCoreKey === coreKey;
                    }) || [];

                totalGroupQty =
                    sameGroupItems.reduce((sum, i) => sum + (i.quantity || 0), 0) + quantity;

                if (totalGroupQty >= requiredQty) {
                    offerApplied = true;
                    bulkMinQty = requiredQty;

                    // 🔹 Update all items of same group
                    const updatedGroupItems = sameGroupItems.map(item => {
                        const itemVariation = product?.variations?.find(
                            v => v.id === item.variationId
                        );
                        const itemBulkPrice =
                            Number(itemVariation?.bulkPrice) ||
                            Number(item.bulkPrice) ||
                            basePrice;

                        return {
                            ...item,
                            totalPrice: itemBulkPrice * item.quantity,
                            offerApplied: true,
                            bulkPrice: itemBulkPrice,
                            bulkMinQty: requiredQty,

                            productOfferApplied: false,
                            productOfferDiscount: null,
                            productOfferId: null,
                            productOffer: null,
                        };
                    });

                    if (updatedGroupItems.length > 0) {
                        await Promise.all(
                            updatedGroupItems.map(uItem => dispatch(updateCart(uItem)))
                        );
                    }

                    bulkPrice = variationBulkPrice;
                } else {
                    offerApplied = false;
                    bulkPrice = null;
                    bulkMinQty = null;
                }
            }

            // 🔹 Check if item already exists in cart
            const isAlreadyInCart = userCart?.some(
                item =>
                    item.productId === product.id &&
                    item.variationId === (selectedVariation?.id || null) &&
                    item.attributes?.color === flatAttributes?.color &&
                    item.purchasePlatform === purchasePlatform
            );
            if (isAlreadyInCart) {
                toast.error("This product is already in your cart!");
                setLoading(false);
                return;
            }

            console.log("🛒 User cart before applying product offers:", userCart);


            // 🔹 Apply non-bulk offers
            const { offerApplied: productOfferApplied, offerDiscount, offerId, offerMeta } = applyProductOffers(
                product,
                selectedVariation,
                quantity,
                userCart,
                null,
                flatAttributes
            );

            // ✅ Apply product offer to all same-core items (ignore color differences)
            if (productOfferApplied && offerMeta) {
                console.log("offerMeta", offerMeta)
                const coreAttributes = Object.entries(flatAttributes)
                    .filter(([key]) => !["color", "colour"].includes(key.toLowerCase()))
                    .map(([k, v]) => `${k}:${v}`)
                    .join("|");

                const sameCoreItems = userCart.filter(item => {
                    const itemCore = Object.entries(item.attributes || {})
                        .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
                        .map(([k, v]) => `${k}:${v}`)
                        .join("|");
                    return item.productId === product.id && itemCore === coreAttributes;
                });

                if (sameCoreItems.length > 0) {
                    await Promise.all(
                        sameCoreItems.map(async (i) => {
                            const updatedItem = {
                                ...i,
                                productOfferApplied: true,
                                productOfferDiscount: offerDiscount || null,
                                productOffer: offerMeta || null,
                                productOfferId: offerId || null,
                            };
                            await dispatch(updateCart(updatedItem));
                        })
                    );
                }
            }


            // 🔹 Compute final price
            const totalPrice =
                bulkPrice && offerApplied
                    ? bulkPrice * quantity // bulk overrides
                    : basePrice * quantity * (1 - (productOfferApplied ? offerDiscount / 100 : 0));

            const normalizeNumber = val => {
                if (val == null || val === "") return null;
                if (typeof val === "object" && "toNumber" in val) return val.toNumber();
                if (typeof val === "object" && "value" in val) return Number(val.value);
                return Number(val);
            };

            const finalBulkPrice = normalizeNumber(bulkPrice);
            const finalBulkMinQty = normalizeNumber(bulkMinQty);

            const cartItem = {
                productName: product.name,
                quantity,
                pricePerItem: basePrice,
                currency,
                currencySymbol,
                totalPrice,
                bulkPrice: finalBulkPrice,
                bulkMinQty: finalBulkMinQty,
                offerApplied, // bulk-only
                // productOfferApplied, // new field for non-bulk offers
                // productOfferDiscount: offerDiscount || null,
                // productOffer: offerMeta || null, // range/buy offer JSON
                // productOfferId: offerId || null,
                productOfferApplied: offerApplied ? false : productOfferApplied,
                productOfferDiscount: offerApplied ? null : offerDiscount || null,
                productOffer: offerMeta || null,
                productOfferId: offerApplied ? null : offerId || null,
                productId: product.id,
                variationId: selectedVariation?.id || null,
                attributes: flatAttributes,
                userId: user.id,
                image: mainImage || "No Image",
                selectedCountry,
                barCode,
                purchasePlatform
            };

            console.log("🛒 NEW CART ITEM:", cartItem);

            const result = await dispatch(addToCartAsync(cartItem)).unwrap();
            toast.success(result.message || "Item added to cart!");
            dispatch(fetchCart());
        } catch (err) {
            console.error("❌ ADD TO CART ERROR:", err);
            toast.error(err.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const computeBulkStatus = ({ product, selectedVariation, selectedAttributes, userCart, quantity, cartItem }) => {
        const productMinQty = Number(product?.minQuantity || 0);
        const variationBulkPrice = Number(selectedVariation?.bulkPrice ?? 0);
        const variationBulkMinQty = Number(selectedVariation?.bulkMinQty ?? productMinQty) || 0;
        const requiredQty = variationBulkMinQty || productMinQty;

        // 🎯 Flatten attributes except color
        const flatAttributes = {};
        Object.entries(selectedAttributes || {}).forEach(([k, v]) => {
            if (v && v !== "N/A") flatAttributes[k.toLowerCase()] = v;
        });

        const coreAttributes = Object.entries(flatAttributes)
            .filter(([key]) => !["color", "colour"].includes(key.toLowerCase()));
        const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

        // 🧩 Find same group items
        const sameGroupItems = (Array.isArray(userCart) ? userCart : []).filter(item => {
            if (!item) return false;
            if (item.productId !== product.id || item.purchasePlatform !== purchasePlatform) return false;
            const itemCoreKey = Object.entries(item.attributes || {})
                .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
                .map(([k, v]) => `${k}:${v}`)
                .join("|");
            return itemCoreKey === coreKey;
        });

        // 🧮 FIXED: replace current item's qty with newQty
        const totalGroupQty = sameGroupItems.reduce((sum, item) => {
            if (item.id === cartItem?.id) {
                return sum + Number(quantity || 0);
            }
            return sum + (Number(item.quantity) || 0);
        }, 0);

        // const hasOfferApplied = sameGroupItems.some(it => it.offerApplied === true);
        // const validVariationBulk =
        //     selectedVariation?.bulkPrice != null &&
        //     selectedVariation?.bulkMinQty != null &&
        //     selectedVariation?.bulkPrice > 0 &&
        //     selectedVariation?.bulkMinQty > 0;

        // const hasBulkOffer = hasOfferApplied || validVariationBulk;
        // const eligible = hasBulkOffer && totalGroupQty >= requiredQty;
        const hasOfferApplied = sameGroupItems.some(it => it.offerApplied === true);

        // ✅ VALID bulk offer available if price and minQty are > 0
        const validVariationBulk = variationBulkPrice > 0 && variationBulkMinQty > 0;

        // ✅ Bulk eligibility logic
        const hasBulkOffer = true; // <— 🔥 force check always
        const eligible = totalGroupQty >= variationBulkMinQty; // <— 🔥 simplified clean condition

        console.log("💡 Bulk Check (Final)", {
            totalGroupQty,
            variationBulkMinQty,
            variationBulkPrice,
            validVariationBulk,
            eligible,
        });

        console.log("🧩 Bulk Debug =>", {
            productName: product?.name,
            sameGroupItems: sameGroupItems.map(i => ({
                id: i.id,
                qty: i.quantity,
                offerApplied: i.offerApplied,
            })),
            totalGroupQty,
            requiredQty,
            variationBulkPrice,
            variationBulkMinQty,
            validVariationBulk,
            eligible,
        });

        return {
            eligible,
            requiredQty,
            totalGroupQty,
            variationBulkPrice,
            variationBulkMinQty,
            sameGroupItems,
        };
    };

    const handleUpdateQuantity = async (cartItemId, newQty, extraFields = {}) => {
        console.log("🛒 Updating cart item", { cartItemId, newQty, ...extraFields });

        await dispatch(
            updateCart({
                id: cartItemId,
                quantity: newQty,
                ...extraFields,
            })
        );
    };


    // const addToCart = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to add items to your cart.");
    //         return;
    //     }

    //     let selectedCountryCode = localStorage.getItem("selectedCountry");
    //     if (!selectedCountryCode) {
    //         toast.error("Something went wrong! Country not found.");
    //         return;
    //     }

    //     selectedCountryCode = selectedCountryCode.toUpperCase();
    //     let selectedCountryObj = countries.find(
    //         (c) => c.code.toUpperCase() === selectedCountryCode
    //     );
    //     if (!selectedCountryObj && selectedCountryCode.length === 3) {
    //         selectedCountryObj = countries.find((c) =>
    //             c.code.toUpperCase().startsWith(selectedCountryCode.slice(0, 2))
    //         );
    //     }
    //     const selectedCountry = selectedCountryObj?.name || selectedCountryCode;

    //     if (userCart && userCart.length > 0) {
    //         const cartCountry = userCart[0]?.selectedCountry;
    //         if (cartCountry && cartCountry !== selectedCountry) {
    //             setNewCountry(selectedCountry);
    //             setShowCountryModal(true);
    //             return;
    //         }
    //     }

    //     setLoading(true);

    //     try {
    //         const priceObj = displayedPrice();
    //         // const basePrice = Number(priceObj.discounted ?? priceObj.original);
    //         const basePrice = Number(priceObj.original);
    //         const currencySymbol =
    //             selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //         const currency = selectedVariation?.currency || product.currency || "INR";

    //         const flatAttributes = {};
    //         Object.entries(selectedAttributes).forEach(([key, val]) => {
    //             if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //         });

    //         let offerApplied = false;
    //         let bulkPrice = null;
    //         let bulkMinQty = null;

    //         const hasBulkOffer =
    //             Number(product?.minQuantity) > 0 &&
    //             Number(selectedVariation?.bulkPrice) > 0;

    //         let sameGroupItems = [];
    //         let totalGroupQty = quantity;

    //         if (hasBulkOffer) {
    //             const productMinQty = Number(product.minQuantity);
    //             const variationBulkPrice = Number(selectedVariation.bulkPrice);
    //             const variationBulkMinQty = Number(
    //                 selectedVariation.bulkMinQty || productMinQty
    //             );
    //             const requiredQty = variationBulkMinQty || productMinQty;

    //             const coreAttributes = Object.entries(flatAttributes).filter(
    //                 ([key]) => !["color", "colour"].includes(key.toLowerCase())
    //             );
    //             const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

    //             sameGroupItems =
    //                 userCart?.filter((item) => {
    //                     if (item.productId !== product.id) return false;

    //                     const itemCoreKey = Object.entries(item.attributes || {})
    //                         .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
    //                         .map(([k, v]) => `${k}:${v}`)
    //                         .join("|");

    //                     // ✅ Match based on same non-color attributes only
    //                     return itemCoreKey === coreKey;
    //                 }) || [];


    //             totalGroupQty =
    //                 sameGroupItems.reduce((sum, i) => sum + (i.quantity || 0), 0) +
    //                 quantity;

    //             console.log("🧩 BULK DEBUG →", {
    //                 totalGroupQty,
    //                 variationBulkPrice,
    //                 variationBulkMinQty,
    //                 requiredQty,
    //             });

    //             if (totalGroupQty >= requiredQty) {
    //                 offerApplied = true;
    //                 bulkMinQty = requiredQty;

    //                 // 🔥 Update all items of same group (each keeps its own bulkPrice)
    //                 const updatedGroupItems = sameGroupItems.map((item) => {
    //                     // 🔍 Find each item's variation to get its own bulk price
    //                     const itemVariation = product?.variations?.find(
    //                         (v) => v.id === item.variationId
    //                     );

    //                     const itemBulkPrice =
    //                         Number(itemVariation?.bulkPrice) ||
    //                         Number(item.bulkPrice) ||
    //                         basePrice;

    //                     return {
    //                         ...item,
    //                         totalPrice: itemBulkPrice * item.quantity,
    //                         offerApplied: true,
    //                         bulkPrice: itemBulkPrice,
    //                         bulkMinQty: requiredQty,
    //                     };
    //                 });


    //                 console.log("updatedGroupItems:", updatedGroupItems);

    //                 if (updatedGroupItems.length > 0) {
    //                     await Promise.all(
    //                         updatedGroupItems.map((uItem) => dispatch(updateCart(uItem)))
    //                     );
    //                 }

    //                 // current item bhi apne bulkPrice ke sath offer apply karega
    //                 bulkPrice = variationBulkPrice;
    //             } else {
    //                 offerApplied = false;
    //                 bulkPrice = null;
    //                 bulkMinQty = null;
    //             }
    //         }

    //         const isAlreadyInCart = userCart?.some(
    //             (item) =>
    //                 item.productId === product.id &&
    //                 item.variationId === (selectedVariation?.id || null) &&
    //                 item.attributes?.color === flatAttributes?.color
    //         );
    //         if (isAlreadyInCart) {
    //             toast.error("This product is already in your cart!");
    //             setLoading(false);
    //             return;
    //         }

    //         const { offerApplied: productOfferApplied, offerDiscount } = applyProductOffers(
    //             product,
    //             selectedVariation,
    //             quantity
    //         );

    //         // const totalPrice =
    //         //     offerApplied && bulkPrice ? bulkPrice * quantity : basePrice * quantity;
    //         const totalPrice =
    //             bulkPrice && bulkOfferEligible
    //                 ? bulkPrice * quantity // bulk overrides price
    //                 : basePrice * quantity * (1 - (productOfferApplied ? offerDiscount / 100 : 0));
    //         const normalizeNumber = (val) => {
    //             if (val == null || val === "") return null;
    //             if (typeof val === "object" && "toNumber" in val) return val.toNumber();
    //             if (typeof val === "object" && "value" in val) return Number(val.value);
    //             return Number(val);
    //         };

    //         const finalBulkPrice = normalizeNumber(bulkPrice);
    //         const finalBulkMinQty = normalizeNumber(bulkMinQty);

    //         console.log("✅ FINAL BULK VALUES:", {
    //             finalBulkPrice,
    //             finalBulkMinQty,
    //             offerApplied,
    //         });

    //         const cartItem = {
    //             productName: product.name,
    //             quantity,
    //             pricePerItem: basePrice,
    //             currency,
    //             currencySymbol,
    //             totalPrice,
    //             bulkPrice: finalBulkPrice,
    //             bulkMinQty: finalBulkMinQty,
    //             offerApplied,
    //             productId: product.id,
    //             variationId: selectedVariation?.id || null,
    //             attributes: flatAttributes,
    //             userId: user.id,
    //             image: mainImage || "No Image",
    //             selectedCountry,
    //         };

    //         console.log("🛒 NEW CART ITEM:", cartItem);

    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success(result.message || "Item added to cart!");
    //         dispatch(fetchCart());
    //     } catch (err) {
    //         console.error("❌ ADD TO CART ERROR:", err);
    //         toast.error(err.message || "Failed to add product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    const handleAdd = () => {
        addToCart(selectedVariation, quantity);
    };



    // Helper: compute whether bulk offer is active for the CURRENT selectedVariation + selectedAttributes + userCart
    // ✅ Helper: compute whether bulk offer is active for the CURRENT selectedVariation + selectedAttributes + userCart
    // const computeBulkStatus = ({ product, selectedVariation, selectedAttributes, userCart, quantity }) => {
    //     const productMinQty = Number(product?.minQuantity || 0);
    //     const variationBulkPrice = Number(selectedVariation?.bulkPrice ?? 0);
    //     const variationBulkMinQty = Number((selectedVariation?.bulkMinQty ?? productMinQty) || 0);
    //     const requiredQty = variationBulkMinQty || productMinQty;

    //     // 🎯 Flatten attributes except color
    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes || {}).forEach(([k, v]) => {
    //         if (v && v !== "N/A") flatAttributes[k.toLowerCase()] = v;
    //     });

    //     const coreAttributes = Object.entries(flatAttributes)
    //         .filter(([key]) => !["color", "colour"].includes(key.toLowerCase()));
    //     const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

    //     // 🧩 Find all cart items with same core attributes
    //     const sameGroupItems = (Array.isArray(userCart) ? userCart : []).filter(item => {
    //         if (!item) return false;
    //         if (item.productId !== product.id) return false;
    //         const itemCoreKey = Object.entries(item.attributes || {})
    //             .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
    //             .map(([k, v]) => `${k}:${v}`)
    //             .join("|");
    //         return itemCoreKey === coreKey;
    //     });

    //     // 🧮 Total group quantity (existing + current)
    //     const totalGroupQty = sameGroupItems.reduce((s, it) => s + (Number(it.quantity) || 0), 0) + Number(quantity || 0);

    //     // ✅ BULK OFFER CHECK — updated
    //     const offerApplied =
    //         selectedVariation?.offerApplied === true ||
    //         sameGroupItems.some(it => it.offerApplied === true);

    //     const hasBulkOffer = variationBulkPrice > 0 && variationBulkMinQty > 0;
    //     const eligible = hasBulkOffer && totalGroupQty >= requiredQty;


    //     // 🧾 Update computed bulk price for each item
    //     const updatedGroupItems = sameGroupItems.map(it => {
    //         const itemVariation = product?.variations?.find(v => v.id === it.variationId);
    //         const itemBulkPrice = Number(itemVariation?.bulkPrice ?? it.bulkPrice ?? 0) || null;
    //         return { ...it, computedBulkPrice: itemBulkPrice };
    //     });

    //     console.log("💡 Bulk check detail", {
    //         offerApplied_variation: selectedVariation?.offerApplied,
    //         offerApplied_group: sameGroupItems.map(i => i.offerApplied),
    //         variationBulkPrice,
    //         variationBulkMinQty,
    //         totalGroupQty,
    //         requiredQty,
    //         offerApplied,
    //         hasBulkOffer,
    //         eligible,
    //     });

    //     return {
    //         eligible,
    //         requiredQty,
    //         totalGroupQty,
    //         variationBulkPrice,
    //         variationBulkMinQty,
    //         updatedGroupItems,
    //         sameGroupItems,
    //     };
    // };




    const clearCart = async () => {
        if (!user || !user.id) {
            toast.error("Please login to clear cart.");
            return;
        }

        try {
            await dispatch(clearCartAsync(user.id)).unwrap();
            toast.success("Cart cleared! You can now add items from the new country.");
            setShowCountryModal(false);
        } catch (err) {
            toast.error(err.message || "Failed to clear cart.");
        }
    };




    // const buyNow = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to continue.");
    //         return;
    //     }

    //     setLoading(true);
    //     const price = selectedVariation?.price || product.price;
    //     const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //     const totalPrice = price * quantity;

    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes).forEach(([key, val]) => {
    //         if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //     });

    //     const cartItem = {
    //         productName: product.name,
    //         quantity,
    //         pricePerItem: price,
    //         currencySymbol,
    //         totalPrice,
    //         productId: product.id,
    //         variationId: selectedVariation?.id || null,
    //         attributes: flatAttributes,
    //         userId: String(user.id),
    //         image: mainImage || "No Image",
    //     };

    //     try {
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success("Redirecting to checkout...");
    //         router.push("/checkout"); // 👈 Seedha checkout page pe le jao
    //     } catch (err) {
    //         toast.error(err.message || "Failed to process Buy Now");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmitReview = () => {
        console.log("Submitted review:", reviewForm);
        // You can call your API here to save the review
        // After submission, reset the form
        setReviewForm({ name: "", rating: 0, comment: "" });
    };
    const bulkStatus = computeBulkStatus({
        product,
        selectedVariation,
        selectedAttributes,
        userCart,
        quantity,
        cartItem,
    });


    // Displayed price with bulk logic
    // const displayedPrice = () => {
    //     const basePrice = selectedVariation?.price ?? product.price;
    //     const bulkPrice = selectedVariation?.bulkPrice ?? product.bulkPrice ?? null;
    //     const minQty = selectedVariation?.minQuantity ?? product.minQuantity ?? null;

    //     if (bulkPrice && minQty && quantity >= minQty) {
    //         return { original: basePrice, discounted: bulkPrice };
    //     }

    //     return { original: basePrice };
    // };
    const displayedPrice = () => {
        const basePrice = Number(selectedVariation?.price ?? product.price ?? 0);
        const bulkPrice = Number(selectedVariation?.bulkPrice ?? product.bulkPrice ?? 0);
        const minQty = Number(selectedVariation?.minQuantity ?? product.minQuantity ?? 0);

        const bulkStatus = computeBulkStatus({
            product,
            selectedVariation,
            selectedAttributes,
            userCart,
            quantity,
        });

        // console.log("✅ bulkStatus:", bulkStatus);

        // ✅ If bulk offer is eligible
        if (bulkStatus.eligible && bulkPrice) {
            return {
                original: basePrice,
                discounted: bulkPrice, // not `cut`
                label: `Bulk offer: ₹${bulkPrice} per item (Min ${bulkStatus.requiredQty})`,
            };
        }

        // ✅ fallback if manually applied
        if (selectedVariation?.offerApplied && bulkPrice) {
            return {
                original: basePrice,
                discounted: bulkPrice,
                label: "Offer Applied",
            };
        }

        return { original: basePrice };
    };


    console.log("displayedPrice", displayedPrice)

    // Check rangeBuyXGetY offer applied
    const getRangeOfferApplied = (offer) => {
        if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
        const { start, end, free } = offer.discountValue || {};
        if (quantity >= start && quantity <= end) {
            const payQty = quantity - free; // number of items to pay for
            return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
        }
        return null;
    };

    // const isInCart = user?.carts?.some(
    //     (item) =>
    //         item.productId === product.id &&
    //         item.variationId === selectedVariation?.id
    // );

    const existingCartItem = user?.carts?.find(
        (item) =>
            item.productId === product.id &&
            item.variationId === selectedVariation?.id
    );
    const existingCartQuantity = existingCartItem?.quantity ?? 0;

    // ✅ Calculate total quantity of all same product items in cart
    const groupTotalQty = userCart
        ?.filter(item => item.productId === product.id)
        ?.reduce((sum, item) => sum + item.quantity, 0) || quantity;

    const openRemove = () => {
        setShowConfirm(true)
    }

    const tags = Array.isArray(selectedVariation?.tags)
        ? selectedVariation.tags
        : Array.isArray(product?.tags)
            ? product.tags
            : [];
    const baseUrl = isXpress ? "/hecate-quickGo/categories" : "/categories";

    const currency = isXpress
        ? "INR"
        : selectedVariation?.currency ?? product.currency ?? "INR";

    console.log("selectedVariation", selectedVariation)

    return (
        <>
            <div>
                {isXpress && allowedVariationIds === null ? (
                    <div>Loading...</div>
                ) : (
                    ""
                )}

            </div>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
                {loading && <Loader />}
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        {mainImage && mainImage.trim() ? (
                            <>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <span className="loader border-4 border-gray-300 border-t-blue-600 rounded-full w-10 h-10 animate-spin"></span>
                                    </div>
                                )}
                                <Zoom>
                                    <Image
                                        src={mainImage?.trim() || "/image/logo PNG.png"}   // ✅ empty string handle
                                        alt={product.name || "Product Image"}
                                        fill
                                        className={`object-contain w-full h-full cursor-zoom-in transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                                            }`}
                                        onLoadingComplete={() => setImageLoaded(true)}
                                        unoptimized
                                    />
                                </Zoom>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>



                    <div className="flex gap-3 mt-4 flex-wrap">
                        {/* {mainImage && thumbnailImages.length > 0 && thumbnailImages.map((img, index) => (
                            <img
                                key={img || index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"
                                    }`}
                            />
                        ))} */}
                        {mainImage && thumbnailImages.length > 0 && thumbnailImages
                            .filter(img => img?.trim())
                            .map((img, index) => (
                                <img
                                    key={img || index}
                                    src={img || undefined}
                                    alt={`${product.name}-${index}`}
                                    onClick={() => setMainImage(img)}
                                    // unoptimized
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"}`}
                                />
                            ))
                        }



                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-between font-functionPro">
                    <div>
                        <h1 className="text-5xl mb-6 text-gray-900">  {selectedVariation?.name || product.name}</h1>
                        {/* <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}
                            {(selectedVariation?.currencySymbol ?? product.currencySymbol)}
                            {selectedVariation?.price ?? product.price}


                        {selectedVariation?.price ?? product.price}
                        </p> */}
                        {/* <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}
                            {(selectedVariation?.currencySymbol ?? product.currencySymbol)}
                            {displayedPrice()}
                        </p> */}
                        {/* <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}

                            {(() => {
                                const priceObj = displayedPrice();
                                return priceObj.discounted
                                    ? <>
                                        <span className="line-through text-gray-500 mr-2">{priceObj.original}</span>
                                        <span>{priceObj.discounted}</span>
                                    </>
                                    : priceObj.original;
                            })()}
                        </p> */}
                        {/* <p className="text-3xl text-gray-800 mb-4 font-semibold flex flex-wrap items-center gap-2">
                            {(selectedVariation?.currency ?? product.currency) + " "}
                            {(() => {
                                const priceObj = displayedPrice();

                                return priceObj.discounted ? (
                                    <>
                                        <span className="line-through text-gray-500 mr-1 text-2xl">
                                            {priceObj.original}
                                        </span>

                                        <span className="text-gray-900 text-3xl font-bold">
                                            {priceObj.discounted}
                                        </span>

                                        {priceObj.label && (
                                            <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">
                                                {priceObj.label}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-gray-900 text-3xl font-bold">
                                        {priceObj.original}
                                    </span>
                                );
                            })()}
                        </p> */}

                        <p className="text-3xl text-gray-800 mb-4 font-semibold flex flex-wrap items-center gap-2">
                            {currency + " "}
                            {(() => {
                                const priceObj = displayedPrice();

                                return priceObj.discounted ? (
                                    <>
                                        {/* Old price (cut) */}
                                        <span className="line-through text-gray-500 mr-1 text-2xl">
                                            {priceObj.original}
                                        </span>

                                        {/* Discounted / Bulk Price */}
                                        <span className="text-gray-900 text-3xl font-bold">
                                            {priceObj.discounted}
                                        </span>

                                        {/* Offer Label */}
                                        {priceObj.label && (
                                            <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">
                                                {priceObj.label}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-gray-900 text-3xl font-bold">
                                        {priceObj.original}
                                    </span>
                                );
                            })()}
                        </p>


                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {selectedVariation?.short || product.short}
                        </p>





                        {/* {Object.entries(variationAttributes).map(([attrKey, values]) => {
                            let sortedValues = [...values];
                            const defaultVal = product?.isDefault?.[attrKey];
                            if (defaultVal && sortedValues.includes(defaultVal)) {
                                sortedValues = [defaultVal, ...sortedValues.filter(v => v !== defaultVal)];
                            }
                            return (
                                <div key={attrKey} className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-700">
                                        {attrKey}
                                    </h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {sortedValues.map(val => (
                                            <button
                                                key={`${attrKey}-${val}`}
                                                onClick={() => handleAttributeSelect(attrKey, val)}
                                                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 transform 
                        ${selectedAttributes[attrKey] === val
                                                        ? "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg scale-105"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })} */}
                        {/* {Object.entries(variationAttributes).map(([attrKey, values]) => {
                            const keyLower = attrKey.toLowerCase();
                            let sortedValues = [...values];
                            const defaultVal = product?.isDefault?.[attrKey];
                            if (defaultVal && sortedValues.includes(defaultVal)) {
                                sortedValues = [defaultVal, ...sortedValues.filter(v => v !== defaultVal)];
                            }

                            return (
                                <div key={attrKey} className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-700 capitalize">
                                        {attrKey}
                                    </h3>

                                    <div className="flex gap-3 flex-wrap">
                                        {sortedValues.map(val => {
                                            // ✅ Sirf "color" ke liye quantity calculate karna hai
                                            let attributeQty = 0;

                                            if (keyLower === "color") {
                                                attributeQty = Array.isArray(userCart)
                                                    ? userCart.reduce((sum, item) => {
                                                        const sameProduct = item?.productId === product?.id;

                                                        // color match
                                                        const colorMatch =
                                                            item?.attributes?.color?.trim().toLowerCase() ===
                                                            val.trim().toLowerCase();

                                                        // selected wax match
                                                        const selectedWax = selectedAttributes["Type of wax"]?.toLowerCase();
                                                        const itemWax = item?.attributes?.["type of wax"]?.toLowerCase();
                                                        const waxMatch =
                                                            !selectedWax || (itemWax && itemWax === selectedWax);

                                                        // ✅ Only count if both product + color + wax match
                                                        if (sameProduct && colorMatch && waxMatch) {
                                                            return sum + (Number(item?.quantity) || 0);
                                                        }
                                                        return sum;
                                                    }, 0)
                                                    : 0;
                                            }

                                            return (
                                                <div key={`${attrKey}-${val}`} className="flex flex-col items-center">
                                                    <span
                                                        className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium
    ${keyLower === "color" && attributeQty > 0
                                                                ? "text-white bg-gray-800 px-2 py-1 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300 scale-105"
                                                                : "text-gray-400"
                                                            }`}
                                                    >
                                                        {keyLower === "color" && attributeQty > 0 && (
                                                            <>
                                                                <ShoppingCart size={14} className="text-white" />
                                                                <span className="leading-none">{attributeQty}</span>
                                                            </>
                                                        )}
                                                    </span>

                                                    <button
                                                        onClick={() => handleAttributeSelect(attrKey, val)}
                                                        className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 transform 
                                    ${selectedAttributes[attrKey] === val
                                                                ? "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg scale-105"
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                                                            }`}
                                                    >
                                                        {val}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })} */}



                        {Object.entries(variationAttributes).map(([attrKey, values]) => {
                            const keyLower = attrKey.toLowerCase();
                            let sortedValues = [...values];
                            const defaultVal = product?.isDefault?.[attrKey];
                            if (defaultVal && sortedValues.includes(defaultVal)) {
                                sortedValues = [defaultVal, ...sortedValues.filter(v => v !== defaultVal)];
                            }

                            return (
                                <div key={attrKey} className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-700 capitalize">
                                        {attrKey}
                                    </h3>

                                    <div className="flex gap-3 flex-wrap">
                                        {sortedValues.map(val => {
                                            // ✅ Sirf "color" ke liye quantity calculate karna hai
                                            let attributeQty = 0;

                                            if (keyLower === "color") {
                                                attributeQty = Array.isArray(userCart)
                                                    ? userCart.reduce((sum, item) => {
                                                        const sameProduct = item?.productId === product?.id;

                                                        // color match
                                                        const colorMatch =
                                                            item?.attributes?.color?.trim().toLowerCase() ===
                                                            val.trim().toLowerCase();

                                                        // selected wax match
                                                        const selectedWax =
                                                            selectedAttributes["Type of wax"]?.toLowerCase();
                                                        const itemWax =
                                                            item?.attributes?.["type of wax"]?.toLowerCase();
                                                        const waxMatch =
                                                            !selectedWax || (itemWax && itemWax === selectedWax);

                                                        // ✅ Only count if both product + color + wax match
                                                        if (sameProduct && colorMatch && waxMatch && item.purchasePlatform === purchasePlatform) {
                                                            return sum + (Number(item?.quantity) || 0);
                                                        }
                                                        return sum;
                                                    }, 0)
                                                    : 0;
                                            }

                                            return (
                                                <div
                                                    key={`${attrKey}-${val}`}
                                                    className="relative flex flex-col items-center"
                                                >
                                                    {/* 🛒 Quantity badge (fixed height to prevent layout shift) */}
                                                    <div className="h-5 flex items-center justify-center mb-1">
                                                        {keyLower === "color" && attributeQty > 0 && (
                                                            <span
                                                                className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-white bg-gray-800 px-2 py-[2px]
                    rounded-full shadow-sm hover:bg-gray-700 transition-all duration-200"
                                                            >
                                                                <ShoppingCart size={12} className="text-white" />
                                                                {attributeQty}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleAttributeSelect(attrKey, val)}
                                                        className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 transform
                  ${selectedAttributes[attrKey] === val
                                                                ? "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg scale-105"
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                                                            }`}
                                                    >
                                                        {val}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {isXpress && (
                            <p
                                className={`mt-3 text-sm font-semibold
      ${selectedStock === 0
                                        ? "text-red-600"
                                        : selectedStock <= 10
                                            ? "text-orange-600"
                                            : "text-green-700"
                                    }`}
                            >
                                {selectedStock === 0
                                    ? "Out of stock"
                                    : selectedStock <= 10
                                        ? `Only ${selectedStock} left – order soon!`
                                        : ``}
                            </p>
                        )}



                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {[...new Map(product.offers.map(o => [o.id, o])).values()].map((offer, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm"
                                >
                                    <span className="font-semibold">🔥 </span>
                                    <span>{offer.description}</span>
                                </div>
                            ))}
                        </div> */}


                        {/* <div className="p-4 rounded-md shadow-sm bg-green-200 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
                            {[...new Map([...product.offers, product.minQuantity && product.bulkPrice ? {
                                id: "bulk-offer",
                                description: quantity >= product.minQuantity
                                    ? `Bulk price applied: ${product.currencySymbol}${product.bulkPrice} each`
                                    : `Buy ${product.minQuantity}+ items to get ${product.currencySymbol}${product.bulkPrice} each`,
                                type: ["product"],
                                applied: quantity >= product.minQuantity
                            } : null].filter(Boolean).map(o => [o.id, o])).values()].map((offer, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="font-semibold">🔥 {offer.description}</span>
                                    {offer.applied && <span className="ml-2 text-sm font-medium text-green-700">Applied ✅</span>}
                                </div>
                            ))}
                        </div> */}
                        {/* <div className="p-4 rounded-md shadow-sm bg-green-200 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
                            {[...new Map([...product.offers, product.minQuantity && product.bulkPrice ? {
                                id: "bulk-offer",
                                description: quantity >= product.minQuantity
                                    ? `Bulk price applied: ${product.currencySymbol}${product.bulkPrice} each`
                                    : `Buy ${product.minQuantity}+ items to get ${product.currencySymbol}${product.bulkPrice} each`,
                                type: ["product"],
                                applied: quantity >= product.minQuantity,
                                discountType: "bulk"
                            } : null].filter(Boolean).map(o => [o.id, o])).values()].map((offer, index) => {
                                // Range offer applied message
                                const rangeAppliedMsg = getRangeOfferApplied(offer);

                                return (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="font-semibold">
                                            {offer.discountType === "rangeBuyXGetY"
                                                ? `Buy minimum ${offer.discountValue.start}, get ${offer.discountValue.free} free`
                                                : offer.description
                                            }
                                        </span>
                                        {offer.applied && <span className="ml-2 text-sm font-medium text-green-700">Applied ✅</span>}
                                        {rangeAppliedMsg && <span className="ml-2 text-sm font-medium text-green-700">{rangeAppliedMsg}</span>}
                                    </div>
                                );
                            })}
                        </div> */}

                        <ProductOffers
                            selectedVariation={selectedVariation}
                            product={product}
                            quantity={quantity}
                            bulkStatus={bulkStatus}
                            userCart={userCart}
                            purchasePlatform={purchasePlatform}
                        />
                        {/* {(product.offers?.length > 0 || (product.minQuantity && product.bulkPrice)) && (
                            <div className="mt-4 text-sm text-gray-800 space-y-2">

                           
                                {product.offers && product.offers.length > 0 && (
                                    <div>
                                        {[...new Map(product.offers.map(o => [o.id, o])).values()].map((offer, index) => (
                                            <div key={index} className="flex items-start gap-1">
                                                <span className="text-yellow-600">🔥</span>
                                                <span>
                                                    <strong>{offer.title ? `${offer.title}: ` : ""}</strong>
                                                    {offer.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {product.minQuantity && product.bulkPrice && (
                                    <div className="flex items-center gap-1 text-green-700">
                                        <span>💰</span>
                                        <span>
                                            Buy <strong>{product.minQuantity}+</strong> items at{" "}
                                            <strong>{product.currencySymbol || "₹"}{product.bulkPrice}</strong> each
                                        </span>
                                    </div>
                                )}

                            </div>
                        )} */}



                        {/* Quantity & Add to Cart */}
                        {/* <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        onClick={decrement}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-8 py-3 text-2xl font-medium">{quantity}</span>
                                    <button
                                        onClick={increment}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className="px-10 py-4 bg-gray-700 text-white rounded-lg hover:bg-black transition cursor-pointer shadow-lg text-xl"
                                >
                                    Add to Cart
                                </button>
                                 <button
                                    onClick={addToCart}
                                    className="px-10 py-4 bg-gray-700 text-white rounded-lg hover:bg-black transition cursor-pointer shadow-lg text-xl"
                                >
                                    {isInCart ? "Update Cart" : "Add to Cart"}
                                </button>


                                {product.matchedMarketLink && (
                                    <a
                                        href={product.matchedMarketLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                    >
                                        <img
                                            src="/image/amazon-button.png"
                                            alt={`Buy in ${product.matchedMarketLink.countryName}`}
                                            className="w-40 h-auto hover:scale-105 transition-transform cursor-pointer"
                                        />
                                    </a>
                                )}
                            </div>
                        </div> */}
                        <div className="hidden md:flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                {/* 🧮 Quantity Control */}
                                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={decrement}
                                        className={`px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl flex items-center justify-center ${quantity === 1 && isInCart
                                            ? "text-red-500 hover:bg-red-100"
                                            : ""
                                            }`}
                                    >
                                        {quantity === 1 && isInCart ? (
                                            <Trash2 size={22} />
                                        ) : (
                                            "-"
                                        )}
                                    </button>

                                    <span className="px-8 py-3 text-2xl font-medium text-gray-800">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={increment}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* 🛒 Add to Cart button (only if not already added) */}
                                {!isInCart ? (
                                    <button
                                        onClick={handleAdd}
                                        className="px-10 py-4 bg-gray-700 text-white rounded-lg hover:bg-black transition cursor-pointer shadow-lg text-xl"
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    ""
                                    // <button
                                    //     onClick={openRemove}
                                    //     className="px-10 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer shadow-lg text-xl"
                                    // >
                                    //     Remove
                                    // </button>
                                )}

                                {/* 🛍️ Amazon link (if available) */}
                                {product.matchedMarketLink && (
                                    <a
                                        href={product.matchedMarketLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                    >
                                        <img
                                            src="/image/amazon-button.png"
                                            alt={`Buy in ${product.matchedMarketLink.countryName}`}
                                            className="w-40 h-auto hover:scale-105 transition-transform cursor-pointer"
                                        />
                                    </a>
                                )}
                            </div>

                            {/* ⚠️ Confirm Delete Modal */}
                            {showConfirm && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                            Remove from Cart?
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Are you sure you want to remove this item from your cart?
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowConfirm(false)}
                                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg px-4 py-3">
                            {/* Selected Variation */}
                            <p className="text-sm text-gray-600 mb-2 truncate">
                                Selected: <span className="font-semibold">{selectedVariation?.variationName}</span>
                            </p>

                            {/* Layout */}
                            <div
                                className={`grid gap-3 ${isInCart ? "grid-cols-1 place-items-center" : "grid-cols-2"
                                    }`}
                            >
                                {/* Quantity */}
                                <div className="flex items-center justify-center border rounded-lg overflow-hidden h-12 w-full max-w-[180px]">
                                    <button
                                        onClick={decrement}
                                        className={`w-12 h-12 bg-gray-200 text-xl flex items-center justify-center ${quantity === 1 && isInCart ? "text-red-500" : ""
                                            }`}
                                    >
                                        {quantity === 1 && isInCart ? <Trash2 size={18} /> : "-"}
                                    </button>

                                    <span className="w-12 h-12 flex items-center justify-center font-semibold">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={increment}
                                        className="w-12 h-12 bg-gray-200 text-xl flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart (ONLY when not in cart) */}
                                {!isInCart && (
                                    <button
                                        onClick={handleAdd}
                                        className="h-12 bg-gray-700 text-white rounded-lg text-lg font-medium flex items-center justify-center"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>



                        {/* <p className="text-gray-700 mt-3">
                            {existingCartQuantity > 0
                                ? `Already in your cart: ${existingCartQuantity}`
                                : ""}
                        </p> */}
                        {(
                            (selectedVariation?.tags?.length > 0
                                ? selectedVariation.tags
                                : product?.tags?.length > 0
                                    ? product.tags
                                    : []
                            ).length > 0
                        ) && (
                                <div className="mt-8">
                                    <span className="text-lg text-gray-600 font-medium mr-2">
                                        Tags:
                                    </span>

                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {(selectedVariation?.tags?.length > 0
                                            ? selectedVariation.tags
                                            : product?.tags?.length > 0
                                                ? product.tags
                                                : []
                                        ).map((tag) => (
                                            <Link
                                                key={tag.id || tag.name}
                                                href={`${baseUrl}?tag=${encodeURIComponent(tag.name)}`}
                                                className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-full
                    shadow-sm hover:bg-blue-100 hover:shadow-md
                    transition-all duration-200 cursor-pointer"
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}


                        {/* <p className="text-lg text-gray-600 mt-8 leading-relaxed">
                            Tag: {Array.isArray(selectedVariation?.tags)
                                ? selectedVariation.tags.map(tag => tag.name).join(", ")
                                : Array.isArray(product.tags)
                                    ? product.tags.map(tag => tag.name).join(", ")
                                    : "No tags"}
                        </p> */}
                        {/* Buy Button / Market Link */}
                        {/* {product.matchedMarketLink ? (
                            <a
                                href={product.matchedMarketLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg text-xl mt-6 inline-block text-center"
                            >
                                Buy in {product.matchedMarketLink.countryName}
                            </a>
                        ) : (
                            <p className="text-gray-500 mt-6">Not available in your country</p>
                        )} */}



                    </div>
                </div>



            </div>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row flex-none  overflow-hidden shadow-md rounded-xl">
                    {/* Tabs */}
                    <div className="flex md:flex-col w-full md:w-1/4 flex-none bg-gray-100">
                        {["description", "reviews"].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
              w-full px-5 py-3 text-left font-medium cursor-pointer transition-all duration-300
              ${isActive
                                            ? "bg-gray-700 border-l-4 border-gray-900 text-white"
                                            : "text-gray-500 hover:bg-gray-200"}
            `}
                                >
                                    {tab === "description"
                                        ? "Description"
                                        : `Reviews (${product.reviews?.length || 0})`}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="w-full md:w-3/4 bg-white px-6 pb-6 flex-grow">
                        <AnimatePresence mode="wait">
                            {activeTab === "description" && (
                                <motion.div
                                    key="description"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-700 space-y-4"
                                >
                                    <div className="space-y-6">
                                        {/* {product.description
                                            .replace(/\\'/g, "'")
                                            .split("\n\n")
                                            .map((para, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-black text-base leading-loose font-medium tracking-normal"
                                                >
                                                    {para}
                                                </p>
                                            ))} */}

                                        {selectedVariation?.description && (
                                            <div
                                                className="text-gray-700 text-base leading-loose font-medium tracking-normal italic"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(product.description)
                                                }}
                                            />

                                        )}
                                    </div>



                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col space-y-4 h-[650px]"
                                >
                                    {/* Fixed form at top */}
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-800 mb-4 text-center">Add Your Review</h4>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmitReview();
                                            }}
                                            className="space-y-4"
                                        >
                                            {/* Name */}
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={reviewForm.name}
                                                onChange={(e) =>
                                                    setReviewForm({ ...reviewForm, name: e.target.value })
                                                }
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                required
                                            />

                                            {/* Message */}
                                            <textarea
                                                placeholder="Write your review..."
                                                value={reviewForm.comment}
                                                onChange={(e) =>
                                                    setReviewForm({ ...reviewForm, comment: e.target.value })
                                                }
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                rows={4}
                                                required
                                            ></textarea>

                                            {/* Rating */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="font-semibold text-gray-800">Rating:</span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                        className={`text-3xl md:text-4xl cursor-pointer transition-all duration-200 ${reviewForm.rating >= star ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-yellow-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>


                                            {/* Submit Button */}
                                            <div className="flex justify-center ">
                                                <button
                                                    type="submit"
                                                    className="bg-gray-600 cursor-pointer text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>

                                        </form>
                                    </div>

                                    {/* Reviews list - scrollable */}
                                    <div className="overflow-y-auto flex-1 space-y-4 pr-2 mt-2">
                                        {(product.reviews && product.reviews.length > 0
                                            ? product.reviews
                                            : Array.from({ length: 10 }, (_, i) => ({
                                                user: `User ${i + 1}`,
                                                rating: Math.floor(Math.random() * 5) + 1,
                                                comment: "This is a dummy review for testing purposes.",
                                            }))
                                        ).map((review, idx) => (
                                            <div
                                                key={idx}
                                                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-800">{review.user}</h4>
                                                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {showCountryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Cart Conflict</h2>
                        <p className="mb-6 text-gray-700">
                            Your current cart has items from{" "}
                            <span className="font-bold text-red-600">{userCart[0]?.selectedCountry}</span>.{" "}
                            To add products from{" "}
                            <span className="font-bold text-green-600">{newCountry}</span>, you must clear your cart.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                onClick={() => {
                                    setShowCountryModal(false);
                                    const currentCartCountry = userCart[0]?.selectedCountry || "your current country";
                                    toast.custom((t) => (
                                        <div
                                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                                } max-w-xs w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 shadow-md rounded-md flex items-center gap-2`}
                                        >
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                            <span>
                                                Cart not cleared. You can continue with items from {currentCartCountry}.
                                            </span>
                                        </div>
                                    ), { duration: 2000 });
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div className="mt-16 w-full">
                <ProductSlider showSection="related" />
            </div>
        </>
    );
};

export default ProductDetail;
