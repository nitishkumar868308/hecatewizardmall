// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { useDispatch, useSelector } from "react-redux";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(200);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);

//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Filter products
//     let filteredProducts = products.filter((p) => {
//         const categoryMatch = selectedCategory === "All" || p.categoryId === selectedCategory;
//         const subcategoryMatch = selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;
//         const priceMatch = p.price <= priceRange;
//         return categoryMatch && subcategoryMatch && priceMatch;
//     });

//     // Sort products
//     if (sortBy === "Price: Low to High") filteredProducts.sort((a, b) => a.price - b.price);
//     else filteredProducts.sort((a, b) => b.price - a.price);

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {!isDesktop && (
//                 <div className="mb-4 flex justify-end">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {showFilters ? "Hide Filters" : "Show Filters"}
//                     </button>
//                 </div>
//             )}

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"} `}>
//                 {/* Sidebar */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Category & Subcategory */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Category</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     key="all-categories"
//                                     onClick={() => { setSelectedCategory("All"); setSelectedSubcategory("All"); }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""}`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory("All"); }}
//                                             className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""}`}
//                                         >
//                                             {cat.name}
//                                         </div>
//                                         {/* Subcategories */}
//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter(sc => sc.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => setSelectedSubcategory(sub.id)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""}`}
//                                                         >
//                                                             {sub.name}
//                                                         </li>
//                                                     ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={200}
//                                 value={priceRange}
//                                 onChange={(e) => setPriceRange(e.target.value)}
//                                 className="w-full"
//                             />
//                         </div>

//                         {/* Sort */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Sort By</h3>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 {sortOptions.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Products */}
//                 <div className="w-full md:w-3/4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                         {filteredProducts.map((product) => (
//                             <div
//                                 key={product.id}
//                                 className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                 onClick={() => router.push(`/product/${product.id}`)}
//                             >
//                                 <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                     {(
//                                         Array.isArray(product.image)
//                                             ? product.image[0]
//                                             : product.image
//                                     ) ? (
//                                         <Image
//                                             src={Array.isArray(product.image) ? product.image[0] : product.image}
//                                             alt={product.name || "Product Image"}
//                                             fill
//                                             className="object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                             No Image
//                                         </div>
//                                     )}
//                                 </div>

//                                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                                 <p className="text-gray-600">{product.currencySymbol}{product.price}</p>
//                                 {/* <p className="text-sm text-gray-400">{product.category?.name}</p>
//                                 <p className="text-sm text-gray-400">{product.subcategory?.name}</p> */}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Categories;



"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

const sortOptions = ["Price: Low to High", "Price: High to Low"];

const Categories = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubcategory, setSelectedSubcategory] = useState("All");
    const [priceRange, setPriceRange] = useState(200);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Fetch data
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Responsive check
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Set selected category/subcategory from URL
    useEffect(() => {
        const categoryQuery = searchParams.get("category") || "All";
        const subcategoryQuery = searchParams.get("subcategory") || "All";

        // Category id from name
        const cat = categories.find((c) => c.name.toLowerCase() === categoryQuery.toLowerCase());
        setSelectedCategory(cat ? cat.id : "All");

        // Subcategory id from name
        const sub = subcategories.find(
            (s) => s.name.toLowerCase() === subcategoryQuery.toLowerCase() && s.categoryId === (cat ? cat.id : null)
        );
        setSelectedSubcategory(sub ? sub.id : "All");
    }, [searchParams, categories, subcategories]);

    // Handle category click
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat.id);
        setSelectedSubcategory("All");
        router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
    };

    // Handle subcategory click
    const handleSubcategoryClick = (cat, sub) => {
        setSelectedCategory(cat.id);
        setSelectedSubcategory(sub.id);
        router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`);
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(
            (p) =>
                (selectedCategory === "All" || p.categoryId === selectedCategory) &&
                (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
        )
        .filter((p) => p.price <= priceRange)
        .sort((a, b) => (sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price));

    return (
        <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
            {!isDesktop && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>
            )}

            <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
                {/* Sidebar Filters */}
                {(isDesktop || showFilters) && (
                    <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">Filters</h2>

                        {/* Categories & Subcategories */}
                        <div>
                            <h3 className="font-semibold mb-2">Categories</h3>
                            <ul className="flex flex-col gap-2">
                                <li
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedSubcategory("All");
                                        router.push(`/categories?category=All&subcategory=All`);
                                    }}
                                    className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
                                        }`}
                                >
                                    All
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id} className="mb-2">
                                        <div
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""
                                                }`}
                                        >
                                            {cat.name}
                                        </div>

                                        {/* Subcategories */}
                                        {selectedCategory === cat.id && (
                                            <ul className="ml-4 mt-1 flex flex-col gap-1">
                                                {subcategories
                                                    .filter((s) => s.categoryId === cat.id)
                                                    .map((sub) => (
                                                        <li
                                                            key={sub.id}
                                                            onClick={() => handleSubcategoryClick(cat, sub)}
                                                            className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
                            <input
                                type="range"
                                min={0}
                                max={200}
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="font-semibold mb-2">Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="w-full md:w-3/4">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    onClick={() => router.push(`/product/${product.id}`)}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden">
                                        {Array.isArray(product.image) && product.image[0] ? (
                                            <Image
                                                src={product.image[0]}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">
                                        {product.currencySymbol}
                                        {product.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-400 text-lg">No products found 😔</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Try changing the category, subcategory, or price filter.
                            </p>
                        </div>
                    )}
                </div>
        </div>
        </div >
    );
};

export default Categories;
