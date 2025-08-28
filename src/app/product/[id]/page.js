"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import ProductSlider from "@/components/Product/Product"; // related products slider


const products = [
    {
        id: 1,
        name: "Red T-shirt",
        price: 25,
        image: "/products/product1.webp",
        images: ["/products/product1.webp", "/products/product2.webp", "/products/product3.webp"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
        description: "Comfortable red T-shirt. Perfect for casual wear.",
    },
    {
        id: 2,
        name: "Blue Hoodie",
        price: 40,
        image: "/products/product2.webp",
        images: ["/products/product2.webp", "/products/product1.webp", "/products/product4.webp"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["#0000FF", "#808080", "#FFFFFF"],
        description: "Warm and cozy hoodie. Ideal for winter days.",
    },
    {
        id: 3,
        name: "Black Cap",
        price: 15,
        image: "/products/product3.webp",
        images: ["/products/product3.webp", "/products/product1.webp", "/products/product2.webp"],
        sizes: ["One Size"],
        colors: ["#000000", "#FFFFFF"],
        description: "Stylish black cap. Adjustable for all sizes.",
    },
    // Add remaining products
];

const ProductDetail = () => {
    const params = useParams();
    const { id } = params;
    const product = products.find((p) => p.id === parseInt(id));

    const [mainImage, setMainImage] = useState(product?.image);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);

    const increment = () => setQuantity(quantity + 1);
    const decrement = () => quantity > 1 && setQuantity(quantity - 1);

    if (!product) return <p className="text-center text-gray-500 mt-20 text-xl">Product not found</p>;

    return (
        <>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            onClick={() => handleProductClick(product.id)}
                        />
                    </div>
                    <div className="flex gap-3 mt-4">
                        {product.images.map((img, index) => (
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
                        <h1 className="text-5xl  mb-6 text-gray-900">{product.name}</h1>
                        <p className="text-3xl text-gray-700 mb-6 font-semibold">₹{product.price}</p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                        {/* Size Selector */}
                        <div className="mb-6">
                            <h3 className="font-functionPro mb-3 text-lg">Size:</h3>
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

                        {/* Color Selector */}
                        <div className="mb-8">
                            <h3 className="font-functionPro mb-3 text-lg">Color:</h3>
                            <div className="flex gap-3">
                                {product.colors.map((color) => (
                                    <span
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full cursor-pointer border-2 transition ${selectedColor === color
                                            ? "border-gray-900 scale-110"
                                            : "border-gray-300 hover:scale-110"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <button
                                    onClick={decrement}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer font-functionPro text-2xl"
                                >
                                    -
                                </button>
                                <span className="px-8 py-3 text-2xl font-medium">{quantity}</span>
                                <button
                                    onClick={increment}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer font-functionPro text-2xl"
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
                                className="px-10 py-4 bg-blue-600 text-white font-functionPro rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg text-xl"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16 w-full">
                {/* <h2 className="text-3xl font-bold mb-6">Related Products</h2> */}
                <ProductSlider />
            </div>
        </>


    );
};

export default ProductDetail;
