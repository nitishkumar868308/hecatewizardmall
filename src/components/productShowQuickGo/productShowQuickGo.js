// "use client";
// import React from "react";

// const Page = () => {
//     const images = [
//         "/image/1.jpeg",
//         "/image/CANDLE SHOP 5.png",
//         "/image/CANDLE SHOP 3.png",
//         "/image/CANDLE SHOP 4.png",
//         "/image/CRYSTAL SHOP 1.png",
//         "/image/CRYSTAL SHOP 2.png",
//     ];

//     return (
//         <div className="w-full flex items-center justify-center p-4">
//             <div className="w-full p-4">
//                 <h1>Candles Shop</h1>
//                 {/* Main Container */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                     {/* LEFT — BIG IMAGE */}
//                     <div className="col-span-1">
//                         <div className="w-full  md:h-full rounded-xl overflow-hidden">
//                             <img
//                                 src="/image/CANDLES SHOP NEW 2.png"
//                                 className="w-full h-full object-cover"
//                                 alt="Big"
//                             />
//                         </div>
//                     </div>

//                     {/* RIGHT — 4/6 GRID IMAGES */}
//                     <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         {images.map((img, i) => (
//                             <div
//                                 key={i}
//                                 className="w-full aspect-square rounded-xl overflow-hidden shadow-sm hover:scale-105 hover:shadow-lg transition"
//                             >
//                                 <img
//                                     src={img}
//                                     className="w-full h-full object-cover"
//                                     alt={`img-${i}`}
//                                 />
//                             </div>
//                         ))}
//                     </div>


//                 </div>

//                 {/* VIEW ALL BUTTON */}
//                 <div className="w-full flex justify-center mt-6">
//                     <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition cursor-pointer">
//                         View All
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Page;


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
import ProductSlider from "@/components/Product/Product";

const Page = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { categories } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    console.log("subcategories", subcategories)
    console.log("categories", categories)

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
    }, [dispatch]);

    const isXpress = pathname.includes("/hecate-quickGo");

    const filteredCategories = isXpress
        ? categories.filter(cat => cat.platform?.includes("xpress"))
        : categories;

    const filteredSubcategories = isXpress
        ? subcategories.filter(sub => sub.platform?.includes("xpress"))
        : subcategories;

    const candlesCategory = filteredCategories?.find(cat => cat.name === "Candles");

    const candlesSubcategories = filteredSubcategories?.filter(
        sub => sub.categoryId === candlesCategory?.id
    );


    const images = [
        "/image/Taper Candles 1.png",
        "/image/Tea Light Candles 2.png",
        "/image/Spell Candles 3.png",
        "/image/Herbs Oils Infused Candles 4.png",
        "/image/Herbs Tea Light Candles 5.png",
        "/image/Novena Jar Candles 6.png",
    ];

    const productsHerbs = [
        "/image/Abre camino.jpg",
        "/image/Acacia.jpg",
        "/image/Acorn.jpg",
        "/image/Adam EVE.jpg",
        "/image/Agrimony.jpg",
        "/image/Alfa Alfa.jpg",
    ];

    const productsOils = [
        "/image/CHAKRA BALANCING OIL EDIT.png",
        "/image/CLIENT ATTRACTION OIL EDIT.png",
        "/image/COME TO ME OIL EDIT.png",
        "/image/COMMUNICATION OIL EDIT.png",
        "/image/CONCEIVING OIL EDIT.png",
        "/image/CORD CUTTING OIL EDIT.png",
    ];





    return (
        <>
            <div className="w-full  bg-stone-100 flex justify-center py-12 px-4 md:px-8">
                <div className="max-w-7xl w-full">
                    {/* Heading */}
                    {/* <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
                        Candles
                    </h1> */}
                    {/* <p className="w-full flex mb-5 justify-center bg-[#264757] h-10"><span className="mt-1 text-white text-2xl">Candles</span></p> */}
                    <h2 className="text-center text-white bg-[#264757] py-3 rounded-lg text-3xl font-semibold mb-5">
                        Candles
                    </h2>


                    {/* Main Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                        {/* LEFT — BIG IMAGE */}
                        <div className="col-span-1">
                            {/* <div className="w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                                <img src="/image/CANDLES SHOP NEW 2.png" className="w-full h-full object-cover" alt="Big" />
                            </div> */}
                            <div className="w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
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

                        {/* RIGHT — GRID IMAGES */}
                        {/* <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                                >
                                    <img
                                        src={img}
                                        className="w-full h-full object-cover"
                                        alt={`img-${i}`}
                                    />
                                </div>
                            ))}
                        </div> */}
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {candlesSubcategories?.map((item, i) => (
                                <div
                                    key={i}
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
                        <button className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
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
                        Herbs
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                       
                        <div className="col-span-1">
                           
                            <div className="w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
                                <Image
                                    src="/image/HERBSSHO.jpeg"
                                    alt="Big"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {productsHerbs.map((img, i) => (
                                <div
                                    key={i}
                                    className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                                >
                                    <Image
                                        src={img}
                                        alt={`img-${i}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="flex justify-center mt-5">
                        <button className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
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

            <div className="w-full bg-stone-100 flex justify-center py-12 px-4 md:px-8">
                <div className="max-w-7xl w-full">
                    <h2 className="text-center text-white bg-[#264757] py-3 rounded-lg text-3xl font-semibold mb-5">
                        Oils
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                
                        <div className="col-span-1">
                            <div className="w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative">
                                <Image
                                    src="/image/OILSSHOP.jpeg"
                                    alt="Oils Shop"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>

             
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {productsOils.map((img, i) => (
                                <div
                                    key={i}
                                    className="w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                                >
                                    <Image
                                        src={img}
                                        alt={`Oil product ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

              
                    <div className="flex justify-center mt-5">
                        <button className="relative cursor-pointer bg-gradient-to-r from-[#264757] to-[#1e3744] text-white text-lg px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
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



        </>

    );
};

export default Page;

