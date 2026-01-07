"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import {
    fetchSubcategories,
} from "@/app/redux/slices/subcategory/subcategorySlice";
import { usePathname } from "next/navigation";
import {
    fetchAllProducts,
} from "@/app/redux/slices/products/productSlice";
import { fetchDispatches } from "@/app/redux/slices/dispatchUnitsWareHouse/dispatchUnitsWareHouseSlice";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { categories } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { products } = useSelector((state) => state.products);
    const { dispatches } = useSelector((state) => state.dispatchWarehouse);
    console.log("dispatches", dispatches)
    console.log("products", products)
    console.log("categories", categories)
    const selectedState = useSelector(state => state.selectedState);

    const warehouseIdFromRedux = useSelector(
        state => state.warehouseSelection?.warehouseId
    );

    const warehouseId =
        warehouseIdFromRedux ||
        (typeof window !== "undefined"
            ? localStorage.getItem("warehouseId")
            : null);


    useEffect(() => {
        dispatch(fetchAllProducts())
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
        dispatch(fetchDispatches())
    }, [dispatch]);

    const isXpress = pathname.includes("/hecate-quickGo");

    const selectedWarehouseCode = typeof window !== "undefined" ? localStorage.getItem("warehouseCode") : null;

    const warehouseProductIds = dispatches
        ?.map(ds => {
            let foundProductId = null;

            ds.entries?.forEach(dim => {
                dim.entries?.forEach(e => {
                    if (e.warehouseId?.toString() === warehouseId?.toString()) {
                        foundProductId = dim.productId; // <-- productId यहाँ से लेना
                    }
                });
            });

            return foundProductId;
        })
        .filter(Boolean); // remove nulls


    const filteredProducts = isXpress
        ? products.filter(
            p => p.platform?.includes("xpress") && warehouseProductIds.includes(p.id)
        )
        : products;
    console.log("filteredProducts", filteredProducts)


    const filteredCategories = categories.filter(cat => {
        if (!isXpress) {
            return cat.platform?.includes("website");
        }

        if (!cat.platform?.includes("xpress")) return false;
        if (!cat.states?.length) return false;
        if (!selectedState) return false;

        return cat.states.some(st => st.name === selectedState);
    });


    const filteredSubcategories = subcategories.filter(sub => {
        if (!sub.active) return false;

        if (!isXpress) {
            return sub.platform?.includes("website");
        }

        if (!sub.platform?.includes("xpress")) return false;
        if (!sub.states?.length) return false;
        if (!selectedState) return false;

        return sub.states.some(st => st.name === selectedState);
    });


    const candlesCategory = filteredCategories.find(
        cat => cat.name === "Candles Shop"
    );

    const candlesSubcategories = filteredSubcategories.filter(
        sub => sub.categoryId === candlesCategory?.id
    );

    const herbsCategory = categories?.find(cat => cat.name === "Herbs Shop");

    const oilsCategory = categories?.find(cat => cat.name === "Oils Shop");

    const handleClickCandles = () => {
        if (!candlesCategory?.name) return;

        router.push(
            `/hecate-quickGo/categories?category=${encodeURIComponent(
                candlesCategory.name
            )}&subcategory=All`
        );
    };

    const handleClickCandlesSubcatogry = (sub) => {
        if (!sub?.name) return;

        router.push(
            `/hecate-quickGo/categories?category=${encodeURIComponent(
                candlesCategory.name
            )}&subcategory=${encodeURIComponent(sub.name)}`
        );
    };


    const handleClickHerbs = () => {
        if (!herbsCategory?.name) return;

        router.push(
            `/hecate-quickGo/categories?category=${encodeURIComponent(
                herbsCategory.name
            )}&subcategory=All`
        );
    };

    const handleClickOils = () => {
        if (!oilsCategory?.name) return;

        router.push(
            `/hecate-quickGo/categories?category=${encodeURIComponent(
                oilsCategory.name
            )}&subcategory=All`
        );
    };

    const prdocuPage = (product) => {
        if (!product?.id) return; // safety check

        router.push(`/hecate-quickGo/product/${product.id}`);
    }


    return (
        <>
            <div className="w-full  bg-stone-100 flex justify-center py-12 px-4 md:px-8">
                <div className="max-w-7xl w-full">
                    <h2 className="text-center text-white bg-[#264757] py-3 rounded-lg text-3xl font-semibold mb-5">
                        Candles Shop
                    </h2>


                    {/* Main Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                        {/* LEFT — BIG IMAGE */}
                        <div className="col-span-1">
                            <div onClick={handleClickCandles} className="cursor-pointer w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
                                <Image
                                    src={candlesCategory?.image || "/image/CANDLES SHOP NEW 2.png"}
                                    alt="Big"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {candlesSubcategories?.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleClickCandlesSubcatogry(item)}
                                    className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    />
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="flex justify-center mt-5">
                        <button onClick={handleClickCandles} className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            View All
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 inline-block"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full  bg-stone-100 flex justify-center py-12 px-4 md:px-8">
                <div className="max-w-7xl w-full">

                    <h2 className="text-center text-white bg-[#264757] py-3 rounded-lg text-3xl font-semibold mb-5">
                        Herbs Shop
                    </h2>

                    {(() => {


                        const herbsProducts = filteredProducts?.filter(
                            item => item.categoryId === herbsCategory?.id
                        );


                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                                {/* LEFT — CATEGORY IMAGE */}
                                <div className="col-span-1">
                                    <div onClick={handleClickHerbs} className="cursor-pointer w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
                                        <Image
                                            src={herbsCategory?.image || "/fallback-herbs.jpg"}
                                            alt="Herbs Category"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                </div>

                                {/* RIGHT — FILTERED PRODUCTS GRID */}
                                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {herbsProducts?.map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => prdocuPage(item)}
                                            className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                                        >
                                            <Image
                                                src={item.image?.[0] || "/no-image.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="flex justify-center mt-5">
                        <button onClick={handleClickHerbs} className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            View All
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            <div className="w-full bg-stone-100 flex justify-center py-12 px-4 md:px-8">
                <div className="max-w-7xl w-full">
                    <h2 className="text-center text-white bg-[#264757] py-3 rounded-lg text-3xl font-semibold mb-5">
                        Oils Shop
                    </h2>

                    {(() => {
                        // STEP 1: Filter category = Oils


                        // STEP 2: Find all products belonging to this category
                        const oilsProducts = filteredProducts?.filter(
                            item => item.categoryId === oilsCategory?.id
                        );


                        // STEP 3: Category image — backend se
                        const oilsImage = oilsCategory?.image || "/fallback-oils.jpg";

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                                {/* LEFT — CATEGORY IMAGE */}
                                <div className="col-span-1">
                                    <div onClick={handleClickOils} className="cursor-pointer w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
                                        <Image
                                            src={oilsImage}
                                            alt="Oils Category"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                </div>

                                {/* RIGHT — PRODUCT GRID */}
                                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {oilsProducts?.map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => prdocuPage(item)}
                                            className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                                        >
                                            <Image
                                                src={item.image?.[0] || "/no-image.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="flex justify-center mt-5">
                        <button onClick={handleClickOils} className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                            View All
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Page;

