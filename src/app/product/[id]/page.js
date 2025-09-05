"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductSlider from "@/components/Product/Product";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    console.log("products", products)
    const params = useParams();
    const { id } = params;

    // Fetch products if not already loaded
    useEffect(() => {
        if (!products.length) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    // Find product by id
    const product = products.find((p) => p.id === id);

    // State
    const [mainImage, setMainImage] = useState(product?.image || null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");

    // Update mainImage, size, and color when product changes
    useEffect(() => {
        if (product) {
            setMainImage(product.image);
            setSelectedSize(product.sizes?.[0] || "");
            setSelectedColor(product.colors?.[0] || "");
        }
    }, [product]);

    const increment = () => setQuantity(quantity + 1);
    const decrement = () => quantity > 1 && setQuantity(quantity - 1);

    if (!product) return <p className="text-center mt-20 text-gray-500 text-xl">Product not found</p>;

    return (
        <>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        {mainImage && product && (
                            <Image
                                src={mainImage}
                                alt={product.name || "Product Image"}
                                fill
                                className="object-cover w-full h-full transition-transform duration-300 cursor-pointer"
                            />
                        )}

                    </div>
                    <div className="flex gap-3 mt-4">
                        {[product.image, ...(product.variations?.map(v => v.image) || [])].map((img, index) => (
                            <img
                                key={index}
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
                        <p className="text-3xl text-gray-700 mb-6 font-semibold">₹{product.price}</p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                        {/* Size Selector */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 text-lg">Size:</h3>
                                <div className="flex gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-3 border rounded-lg font-medium text-lg transition cursor-pointer ${selectedSize === size
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selector */}
                        {product.colors?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="mb-3 text-lg">Color:</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <span
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full cursor-pointer border-2 transition ${selectedColor === color ? "border-gray-900 scale-110" : "border-gray-300 hover:scale-110"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                onClick={() =>
                                    alert(
                                        `Added ${quantity} ${product.name}(s) - Size: ${selectedSize}, Color: ${selectedColor} to cart!`
                                    )
                                }
                                className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg text-xl"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 w-full">
                <ProductSlider />
            </div>
        </>
    );
};

export default ProductDetail;
