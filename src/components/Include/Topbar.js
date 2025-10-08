"use client";
import React, { useState, useEffect } from "react";
import { fetchCountryPricing } from "@/app/redux/slices/countryPricing/countryPricingSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCountry } from "@/app/redux/slices/countrySlice";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { usePathname } from "next/navigation";

const Topbar = () => {
    const dispatch = useDispatch();
    const { countryPricing } = useSelector((state) => state.countryPricing);
    const country = useSelector((state) => state.country);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    useEffect(() => setMounted(true), []);
    useEffect(() => {
        dispatch(fetchCountryPricing());
    }, [dispatch]);

    useEffect(() => {
        // On mount, check localStorage first
        const savedCountry = localStorage.getItem("selectedCountry");
        if (savedCountry) {
            dispatch(setCountry(savedCountry));
        } else if (countryPricing.length && !country) {
            dispatch(setCountry(countryPricing[0].code));
        }
    }, [countryPricing, country, dispatch]);

    const countries = [...countryPricing]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((c) => ({
            code: c.code,
            name: c.country,
        }));

    if (!mounted) return null;


    const handleChange = (e) => {
        const selectedCountry = e.target.value;
        dispatch(setCountry(selectedCountry));
        localStorage.setItem("selectedCountry", selectedCountry); // persist
        dispatch(fetchProducts(selectedCountry));
    };


    return (
        <div className="w-full bg-black text-white">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="flex items-center justify-between py-2 md:py-3">
                    <div className="w-1/3"></div>
                    <h1 className="font-libreBaskerville tracking-wide text-base sm:text-lg md:text-2xl uppercase text-center w-1/3">
                        hecate wizard mall
                    </h1>
                    <div className="w-1/3 flex justify-end">
                        {/* <select
                            value={country}
                            onChange={handleChange}
                            className="bg-black border border-gray-500 text-white px-2 py-1 rounded-md text-sm md:text-base"
                        >
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                            ))}
                        </select> */}
                        {pathname !== "/checkout" && (
                            <select
                                value={country}
                                onChange={handleChange}
                                className="bg-black border border-gray-500 text-white px-2 py-1 rounded-md text-sm md:text-base"
                            >
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
