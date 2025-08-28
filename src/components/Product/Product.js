"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Red T-shirt",
        price: "$25",
        image: "/products/product1.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 2,
        name: "Blue Hoodie",
        price: "$40",
        image: "/products/product2.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 3,
        name: "Black Cap",
        price: "$15",
        image: "/products/product3.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 4,
        name: "Sneakers",
        price: "$60",
        image: "/products/product4.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 5,
        name: "Jeans",
        price: "$35",
        image: "/products/product5.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 6,
        name: "Jeans",
        price: "$35",
        image: "/products/product6.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 7,
        name: "Jeans",
        price: "$35",
        image: "/products/product7.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },
    {
        id: 8,
        name: "Jeans",
        price: "$35",
        image: "/products/product8.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#FF0000", "#000000", "#FFFFFF"],
    },

];

const ProductSlider = () => {
    const router = useRouter();

    const handleProductClick = (id) => {
        router.push(`/product/${id}`);
    };
    return (
        <>
         <div className="w-full px-4 py-8">
            <h2 className="text-2xl  mb-6 font-functionPro">Featured Products</h2>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                // navigation
                // pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div className="relative group overflow-hidden">
                            <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    onClick={() => handleProductClick(product.id)}
                                />
                            </div>


                            {/* Hover icons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity ">
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-red-100 cursor-pointer"
                                    onClick={() => alert(`${product.name} added to wishlist`)}
                                >
                                    <Heart size={20} color="red" />
                                </button>
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-green-100 cursor-pointer"
                                    onClick={() => alert(`${product.name} added to cart`)}
                                >
                                    <ShoppingCart size={20} color="green" />
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-b-lg text-center font-functionPro">
                                <h3 className="text-lg  text-gray-900 truncate font-functionPro">{product.name}</h3>
                                <p className="mt-1 text-gray-500 text-sm">{product.price}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        <div className="w-full px-4 py-8">
            <h2 className="text-2xl  mb-6 font-functionPro">Related Products</h2>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                // navigation
                // pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div className="relative group overflow-hidden">
                            <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    onClick={() => handleProductClick(product.id)}
                                />
                            </div>


                            {/* Hover icons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity ">
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-red-100 cursor-pointer"
                                    onClick={() => alert(`${product.name} added to wishlist`)}
                                >
                                    <Heart size={20} color="red" />
                                </button>
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-green-100 cursor-pointer"
                                    onClick={() => alert(`${product.name} added to cart`)}
                                >
                                    <ShoppingCart size={20} color="green" />
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-b-lg text-center font-functionPro">
                                <h3 className="text-lg  text-gray-900 truncate font-functionPro">{product.name}</h3>
                                <p className="mt-1 text-gray-500 text-sm">{product.price}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        </>
       
    );
};

export default ProductSlider;
