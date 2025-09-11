"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductSlider from "@/components/Product/Product";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { addToCartAsync, fetchCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import Loader from "@/components/Include/Loader";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { products } = useSelector((state) => state.products);
    const [userCart, setUserCart] = useState([]);
    const { offers } = useSelector((state) => state.offers);
    const params = useParams();
    const { id } = params;
    const product = products.find((p) => p.id === id);
    const [quantity, setQuantity] = useState(1);
    const [variationAttributes, setVariationAttributes] = useState({});
    const [currentImages, setCurrentImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const { user } = useSelector((state) => state.me);
    const { items } = useSelector((state) => state.cart);
    console.log("items", items)
    useEffect(() => {
        dispatch(fetchCart())
        dispatch(fetchMe())
        if (!products.length) dispatch(fetchProducts());
        dispatch(fetchOffers());
    }, [dispatch, products.length]);

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

    useEffect(() => {
        if (!product?.variations?.length || !variationAttributes || !Object.keys(variationAttributes).length) return;

        // Auto-select first value of each attribute
        const initialSelected = {};
        Object.entries(variationAttributes).forEach(([attr, values]) => {
            if (values.length) initialSelected[attr] = values[0];
        });
        setSelectedAttributes(initialSelected);

        // Match the first variation
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
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [product?.id, product?.variations?.length, Object.keys(variationAttributes).length]);

    const handleAttributeSelect = (attrName, val) => {
        const newSelected = { ...selectedAttributes, [attrName]: val };
        setSelectedAttributes(newSelected);

        // Filter variations that match the selected attributes
        const matchingVariations = product.variations.filter(v => {
            const parts = v.variationName.split(" / ").reduce((acc, part) => {
                const [k, v] = part.split(":").map(p => p.trim());
                acc[k] = v;
                return acc;
            }, {});
            return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
        });

        // Pick the first variation that has an image
        const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

        setSelectedVariation(matchedVariation);

        // Update mainImage & currentImages
        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]);
        } else if (!matchedVariation && product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    };

    // Thumbnails: only show if more than 1 image
    const thumbnailImages = currentImages.length > 1 ? currentImages.filter(img => img !== mainImage) : [];

    const increment = () => setQuantity(quantity + 1);
    const decrement = () => quantity > 1 && setQuantity(quantity - 1);

    const productWithOffer = products.map(product => {
        const offer = offers.find(o => o.id === product.offerId); // id match karo
        return {
            ...product,
            offerDescription: offer?.description || null, // description nikal lo
        };
    });


    if (!product)
        return <p className="text-center mt-20 text-gray-500 text-xl">Product not found</p>;

    const addToCart = async () => {
        if (!user || !user.id) {
            toast.error("Please login to add items to your cart.");
            return;
        }

        const isAlreadyInCart = userCart?.some(
            (item) =>
                item.productId === product.id &&
                item.variationId === (selectedVariation?.id || null)
        );

        if (isAlreadyInCart) {
            toast.error("This product is already in your cart!");
            return;
        }

        setLoading(true);
        const price = selectedVariation?.price || product.price;
        const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
        const totalPrice = price * quantity;

        const flatAttributes = {};
        Object.entries(selectedAttributes).forEach(([key, val]) => {
            if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
        });

        const cartItem = {
            productName: product.name,
            quantity,
            pricePerItem: price,
            currencySymbol,
            totalPrice,
            productId: product.id,
            variationId: selectedVariation?.id || null,
            attributes: flatAttributes,
            userId: String(user.id),
            image: mainImage || "No Image",
        };

        try {
            const result = await dispatch(addToCartAsync(cartItem)).unwrap();
            toast.success(result.message || "Item added to cart!");
        } catch (err) {
            toast.error(err.message || "Failed to delete product");
        } finally {
            setLoading(false);
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


    return (
        <>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
                {loading && <Loader />}
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        {mainImage ? (
                            <Zoom>
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full cursor-zoom-in"
                                />
                            </Zoom>

                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-4 flex-wrap">
                        {mainImage && thumbnailImages.length > 0 && thumbnailImages.map((img, index) => (
                            <img
                                key={img || index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-between font-functionPro">
                    <div>
                        <h1 className="text-5xl mb-6 text-gray-900">{product.name}</h1>
                        <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {selectedVariation?.currencySymbol || product.currencySymbol}{" "}
                            {selectedVariation?.price || product.price}
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {selectedVariation?.short || product.short}
                        </p>

                        {/* Dynamic Variation Attributes */}
                        {Object.entries(variationAttributes).map(([attrKey, values]) => (
                            <div key={attrKey} className="mb-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-700">
                                    {attrKey}
                                </h3>
                                <div className="flex gap-3 flex-wrap">
                                    {values.map(val => (
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
                        ))}

                        {[...new Set(productWithOffer.map(p => p.offerDescription))]
                            .filter(Boolean)
                            .map((desc, index) => (
                                <div
                                    key={index}
                                    className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm"
                                >
                                    <span className="font-semibold">🔥 Offer: </span>
                                    <span>{desc}</span>
                                </div>
                            ))}

                        {/* Quantity & Add to Cart */}
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
                            

                        </div>
                    </div>
                    <p className="text-md md:text-lg text-gray-600 leading-relaxed mt-4">
                        {selectedVariation?.description || product.description}
                    </p>
                </div>

            </div>

            <div className="mt-16 w-full">
                <ProductSlider />
            </div>
        </>
    );
};

export default ProductDetail;
