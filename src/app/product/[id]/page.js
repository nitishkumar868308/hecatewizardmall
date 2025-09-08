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
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const ProductDetail = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { offers } = useSelector((state) => state.offers);
    const params = useParams();
    const { id } = params;

    // Fetch products if not already loaded
    useEffect(() => {
        if (!products.length) dispatch(fetchProducts());
        dispatch(fetchOffers());
    }, [dispatch, products.length]);

    const product = products.find((p) => p.id === id);

    // const [mainImage, setMainImage] = useState(product?.image?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [variationAttributes, setVariationAttributes] = useState({});
    const [currentImages, setCurrentImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    useEffect(() => {
        if (!product?.variations) return;

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
        if (!product) return;

        // Set initial main image & thumbnails
        if (product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [product]);


    // const handleAttributeSelect = (attrName, val) => {
    //     const newSelected = { ...selectedAttributes, [attrName]: val };
    //     setSelectedAttributes(newSelected);

    //     // Match variation
    //     const matchedVariation = product.variations.find(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, v] = part.split(":").map(p => p.trim());
    //             acc[k] = v;
    //             return acc;
    //         }, {});

    //         return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
    //     });

    //     setSelectedVariation(matchedVariation || null);

    //     // Update mainImage & currentImages
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else if (!matchedVariation && product.image?.length) {
    //         // No variation selected → show product images
    //         setCurrentImages(product.image);
    //         setMainImage(product.image[0]);
    //     } else {
    //         // Variation selected but no image
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // };

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

    const addToCart = () => {
        const price = selectedVariation?.price || product.price;
        const totalPrice = price * quantity;

        console.log("🛒 Added to Cart:", {
            productName: product.name,
            size: selectedSize || "N/A",
            color: selectedColor || "N/A",
            quantity,
            pricePerItem: price,
            totalPrice,
        });
    };


    return (
        <>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
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
                            // <div className="w-full h-[500px] border border-gray-200">
                            //     <TransformWrapper
                            //         defaultScale={1}
                            //         wheel={{ step: 0.1 }}
                            //         doubleClick={{ disabled: true }}
                            //         pinch={{ step: 5 }}
                            //     >
                            //         <TransformComponent>
                            //             <img
                            //                 src={mainImage}
                            //                 alt={product.name || "Product Image"}
                            //                 className="w-full h-full object-contain cursor-grab"
                            //             />
                            //         </TransformComponent>
                            //     </TransformWrapper>
                            // </div>

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



                    {/* <div className="flex gap-3 mt-4 flex-wrap">
                        {thumbnailImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"
                                    }`}
                            />
                        ))}
                    </div> */}


                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-between font-functionPro">
                    <div>
                        <h1 className="text-5xl mb-6 text-gray-900">{product.name}</h1>
                        <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            ₹{selectedVariation?.price || product.price}
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Stock: {selectedVariation?.stock || product.stock}
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {selectedVariation?.short || product.short}
                        </p>

                        {/* Dynamic Variation Attributes */}
                        {Object.entries(variationAttributes).map(([attrKey, values]) => (
                            <div key={attrKey} className="mb-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                                    {attrKey} {/* ye key automatically aa rahi hai, "size", "Color", "tets" */}
                                </h3>
                                <div className="flex gap-3 flex-wrap">
                                    {values.map(val => (
                                        <button
                                            key={`${attrKey}-${val}`}
                                            onClick={() => handleAttributeSelect(attrKey, val)}
                                            className={`px-5 py-3 border rounded-lg font-medium text-lg transition cursor-pointer
                        ${selectedAttributes[attrKey] === val
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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
                                className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg text-xl"
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
