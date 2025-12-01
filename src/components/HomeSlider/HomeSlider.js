"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { usePathname } from "next/navigation";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeSlider = () => {
    const pathname = usePathname();
    const isXpress = pathname.includes("/hecate-quickGo");
    const slides = isXpress
        ? [
            { id: 1, image: "/image/Banner_Quick_Go1.png", },
            // { id: 2, image: "/image/xpress1.jpeg", text: "Explore Our Services" },
            // { id: 3, image: "/image/xpress2.jpeg", text: "Innovative Solutions" },
            // { id: 4, image: "/image/xpress4.jpeg", text: "Grow With Us" },
            // { id: 5, image: "/image/5.jpeg", text: "Your Success, Our Goal" },
            // { id: 6, image: "/image/6.jpeg", text: "Quality & Excellence" },
            // { id: 7, image: "/image/7.jpeg", text: "Join Our Community" },
            // { id: 8, image: "/image/9.jpeg", text: "Start Your Journey" },
        ]
        : [
            { id: 1, image: "/image/banner1.jpg", text: "Welcome to Our Website" },
            { id: 2, image: "/image/banner2.jpeg", text: "Explore Our Services" },
            { id: 3, image: "/image/banner3.png", text: "Innovative Solutions" },
            { id: 4, image: "/image/banner4.png", text: "Grow With Us" },
            { id: 5, image: "/image/banner5.jpeg", text: "Your Success, Our Goal" },
            { id: 6, image: "/image/banner6.jpg", text: "Quality & Excellence" },
            { id: 7, image: "/image/banner7.jpg", text: "Join Our Community" },
            { id: 8, image: "/image/upscalemedia-transformed.jpeg", text: "Start Your Journey" },
        ];


    return (
        <div className="w-full">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[800px]  md:mt-0">
                            <Image
                                src={slide.image}
                                alt={`Slide ${slide.id}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
                                <h2 className="text-white text-2xl md:text-4xl lg:text-6xl drop-shadow-lg text-center">
                                    {slide.text}
                                </h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    );
};

export default HomeSlider;
