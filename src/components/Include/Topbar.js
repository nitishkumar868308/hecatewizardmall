"use client";
import React, { useState, useEffect, useMemo } from "react";
import { fetchCountryPricing } from "@/app/redux/slices/countryPricing/countryPricingSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCountry } from "@/app/redux/slices/countrySlice";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { usePathname } from "next/navigation";
import { fetchCart, updateCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import { useCountries } from "@/lib/CustomHook/useCountries";
import {
    fetchCountryTaxes,
} from "@/app/redux/slices/countryTaxes/countryTaxesSlice";
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";
import { setSelectedState } from "@/app/redux/slices/selectedStateSlice";
import { openLocationModal } from "@/app/redux/slices/locationModalSlice";

const Topbar = () => {
    const dispatch = useDispatch();
    const { countryPricing } = useSelector((state) => state.countryPricing);
    const country = useSelector((state) => state.country);
    console.log("country", country)
    const [mounted, setMounted] = useState(false);
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.me);
    const { products } = useSelector((state) => state.products);
    const { states } = useSelector((state) => state.states);
    // const [selectedState, setSelectedState] = useState("");
    console.log("states", states)
    const userCart = useMemo(() => {
        return items?.filter(item => String(item.userId) === String(user?.id)) || [];
    }, [items, user?.id]);
    console.log("userCart", userCart)
    const { countries } = useCountries();
    const pathname = usePathname();
    useEffect(() => setMounted(true), []);
    useEffect(() => {
        dispatch(fetchStates())
        dispatch(fetchCountryPricing());

    }, [dispatch]);
    const selectedState = useSelector(state => state.selectedState);
    // useEffect(() => {
    //     const savedState = localStorage.getItem("selectedState");
    //     if (savedState) {
    //         setSelectedState(savedState);
    //     }
    // }, []);


    useEffect(() => {
        // On mount, check localStorage first
        const savedCountry = localStorage.getItem("selectedCountry");
        if (savedCountry) {
            dispatch(setCountry(savedCountry));
        } else if (countryPricing.length && !country) {
            dispatch(setCountry(countryPricing[0].code));
        }
    }, [countryPricing, country, dispatch]);

    const countriesprice = [...countryPricing]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((c) => ({
            code: c.code,
            name: c.country,
        }));

    if (!mounted) return null;

    const handleChange = async (e) => {
        const selectedCountry = e.target.value;
        console.log("selectedCountry", selectedCountry)
        dispatch(setCountry(selectedCountry));
        localStorage.setItem("selectedCountry", selectedCountry);

        // Fetch updated products
        const { payload } = await dispatch(fetchCountryTaxes(selectedCountry));
        console.log("Fetched taxes for", selectedCountry, payload);
        const { payload: updatedProducts } = await dispatch(fetchProducts(selectedCountry));

        try {
            // Update each cart item with new price from updatedProducts
            const promises = userCart.map((item) => {
                const product = updatedProducts.find(p => p.id === item.productId);
                if (!product) return null;

                let selectedCountryObj = countries.find(
                    (c) => c.code.toUpperCase() === selectedCountry
                );

                if (!selectedCountryObj && selectedCountry.length === 3) {
                    selectedCountryObj = countries.find(
                        (c) => c.code.toUpperCase().startsWith(selectedCountry.slice(0, 2))
                    );
                }

                const selectedCountryCode = selectedCountryObj?.name || selectedCountry;

                const variation = product.variations.find(v => v.id === item.variationId) || product;
                const newPrice = variation.price;
                const newTotal = newPrice * item.quantity;
                const currencySymbol = variation.currencySymbol || product.currencySymbol;
                const currency = variation.currency || product.currency;

                return dispatch(updateCart({
                    id: item.id,
                    pricePerItem: newPrice,
                    totalPrice: newTotal,
                    currencySymbol,
                    selectedCountry: selectedCountryCode,
                    currency
                })).unwrap();
            }).filter(Boolean);

            await Promise.all(promises);
            // Fetch latest cart
            await dispatch(fetchCountryTaxes(selectedCountry)).unwrap();

            await dispatch(fetchCart());
        } catch (err) {
            console.error("Failed to update cart:", err);
        }
    };



    const isXpress = pathname.includes("/hecate-quickGo");
    return (
        // <div className="w-full bg-black text-white">
        <div className={`w-full z-[100] text-white
            ${isXpress ? "bg-[#082D3F]" : "bg-black"}
            fixed top-0 left-0 md:static
        `}>

            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="flex items-center justify-between py-2 md:py-3">
                    <div className="w-1/3"></div>
                    <h1 className="font-libreBaskerville tracking-wide
               text-sm md:text-2xl
               uppercase text-center
               w-full sm:w-1/3">
                        {isXpress ? (
                            "Hecate QuickGo"
                        ) : (
                            "hecate wizard mall"
                        )}

                    </h1>
                    <div className="w-1/3 flex justify-end">
                        <div className="w-1/3 flex justify-end">
                            {/* Xpress → Show States */}
                            {isXpress ? (
                                <select
                                    className="border border-gray-500 text-white px-2 py-1 rounded-md text-sm md:text-base bg-[#082D3F]"
                                    value={selectedState}
                                    // onChange={(e) => {
                                    //     dispatch(setSelectedState(e.target.value));
                                    //     localStorage.setItem("selectedState", e.target.value);
                                    // }}
                                    onChange={(e) => {
                                        const newState = e.target.value;

                                        dispatch(setSelectedState(newState));
                                        localStorage.setItem("selectedState", newState);

                                        // old warehouse invalidate
                                        localStorage.removeItem("pincode");
                                        localStorage.removeItem("warehouseCode");
                                        localStorage.removeItem("warehouseId");

                                        // 🔥 OPEN MODAL (THIS IS THE KEY)
                                        dispatch(openLocationModal());
                                    }}


                                >
                                    {states.map((s) => (
                                        <option key={s.id} value={s.name}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>

                            ) : (
                                /* Normal Website → Show Countries */
                                // <select
                                //     value={country}
                                //     onChange={handleChange}
                                //     className="border border-gray-500 text-white px-2 py-1 rounded-md text-sm md:text-base bg-black"
                                // >
                                //     {countriesprice.map((c) => (
                                //         <option key={c.code} value={c.code}>
                                //             {c.code}
                                //         </option>
                                //     ))}
                                // </select>
                                <select
                                    value={country}
                                    onChange={handleChange}
                                    className="border border-gray-500 text-white px-2 py-1 rounded-md text-sm md:text-base bg-black"
                                >
                                    {countriesprice.map((c) => (
                                        <option
                                            key={c.code}
                                            value={c.code}
                                            title={c.name}
                                        >
                                            {c.code}
                                        </option>
                                    ))}
                                </select>

                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
