"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import {
    fetchProducts,
} from "@/app/redux/slices/products/productSlice";
import { useSelector, useDispatch } from "react-redux";

function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { threshold }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

const ProductSlider = () => {
    const [showDemo, setShowDemo] = useState(true);
    const router = useRouter();
    const { ref, inView } = useInView(0.2);
    const { products, loading } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);
    useEffect(() => {
        if (inView) {
            setShowDemo(true);
            const timer = setTimeout(() => setShowDemo(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [inView]);
    console.log("products", products)
    const handleProductClick = (id) => {
        router.push(`/product/${id}`);
    };
    return (
        <>
            <div ref={ref} className="w-full px-4 py-8 relative">
                <h2 className="text-2xl mb-6 font-functionPro">Featured Products</h2>

                {/* DEMO OVERLAY */}
                {showDemo && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center
                    bg-black/40 backdrop-blur-sm">
                        {/* Swipe Text on left */}
                        <p className="text-white font-semibold text-lg mr-4">
                            Swipe right to explore
                        </p>

                        {/* Animated Hand on right */}
                        <motion.div
                            className="w-16 h-16 text-white"
                            animate={{ x: [0, 40, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <HandRaisedIcon className="rotate-90 w-full h-full text-white" />
                        </motion.div>
                    </div>
                )}

                {/* SLIDER */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{ delay: 3000 }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                >
                    {products
                        .filter(product => product.active)
                        .map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="relative group overflow-hidden">
                                    <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
                                        {product.image ? (
                                            <Image
                                                src={Array.isArray(product.image) ? product.image[0] : product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer rounded-lg"
                                                onClick={() => handleProductClick(product.id)}
                                            />
                                        ) : (
                                            // fallback agar image nahi hai
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover icons */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="bg-white p-2 rounded-full shadow hover:bg-red-100"
                                            onClick={() => alert(`${product.name} added to wishlist`)}
                                        >
                                            <Heart size={20} color="red" />
                                        </button>
                                        <button
                                            className="bg-white p-2 rounded-full shadow hover:bg-green-100"
                                            onClick={() => alert(`${product.name} added to cart`)}
                                        >
                                            <ShoppingCart size={20} color="green" />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-white rounded-b-lg text-center font-functionPro">
                                        <h3 className="text-lg text-gray-900 truncate">{product.name}</h3>
                                        <p className="mt-1 text-gray-500 text-sm">{product.currencySymbol}{product.price}</p>
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
                                    {product.image ? (
                                        <Image
                                            src={Array.isArray(product.image) ? product.image[0] : product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer rounded-lg"
                                            onClick={() => handleProductClick(product.id)}
                                        />
                                    ) : (
                                        // fallback agar image nahi hai
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                                            No Image
                                        </div>
                                    )}
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
                                    <p className="mt-1 text-gray-500 text-sm">{product.currencySymbol}{product.price}</p>
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
