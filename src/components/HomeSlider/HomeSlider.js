"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { usePathname } from "next/navigation";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "@/app/redux/slices/banners/bannersSlice";

const HomeSlider = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const isXpress = pathname.includes("/hecate-quickGo");

    const { banners = [] } = useSelector((state) => state.banner);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    /* ================= FETCH ================= */
    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    /* ================= LOCAL STORAGE ================= */
    useEffect(() => {
        if (typeof window !== "undefined") {
            setSelectedCountry(localStorage.getItem("selectedCountry"));
            setSelectedState(localStorage.getItem("selectedState"));
        }
    }, []);

    /* ================= FILTER & POSITION ================= */
    const slides = useMemo(() => {
        if (!banners.length) return [];

        // Filter banners according to page type
        const filtered = banners.filter((banner) => {
            if (isXpress && !banner.platform?.includes("xpress")) return false;
            if (!isXpress && !banner.platform?.includes("website")) return false;

            if (isXpress) {
                if (!selectedState) return false;
                if (!banner.states?.length) return false;
                return banner.states.some(
                    (s) =>
                        s.state?.name?.trim().toLowerCase() ===
                        selectedState?.trim().toLowerCase()
                );
            } else {
                if (!selectedCountry) return false;
                if (!banner.countries?.length) return false;
                return banner.countries.some((c) => c.countryCode === selectedCountry);
            }
        });

        if (!filtered.length) return [];

        // Find max position
        const positions = [];
        filtered.forEach((banner) => {
            const arr = isXpress ? banner.states : banner.countries;
            arr.forEach((item) => {
                if (item.position) positions.push(item.position);
            });
        });
        const maxPosition = positions.length ? Math.max(...positions) : filtered.length;

        // Prepare slides array with default image fallback
        const slidesArray = [];
        for (let pos = 1; pos <= maxPosition; pos++) {
            // Try to find banner for this position
            const found = filtered.find((banner) => {
                const arr = isXpress ? banner.states : banner.countries;
                return arr.some((item) => item.position === pos);
            });

            slidesArray.push({
                id: found?.id || `default-${pos}`,
                image: found?.image || `/images/one.jpg`,
                text: found?.text || "",
            });
        }

        return slidesArray;
    }, [banners, isXpress, selectedCountry, selectedState]);

    if (!slides.length) return null;

    return (
        <div className="w-full">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <SlideContent slide={slide} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeSlider;

/* ================= SLIDE CONTENT ================= */
const SlideContent = ({ slide }) => (
    <div className="relative w-full aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/6]">
        <Image
            src={slide.image}
            alt={slide.text || "Banner"}
            fill
            className="object-cover"
            priority
        />

        {slide.text && (
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <h2 className="text-white font-bold text-center drop-shadow-lg 
        text-lg md:text-3xl lg:text-5xl xl:text-6xl">
                    {slide.text}
                </h2>
            </div>
        )}
    </div>

);
