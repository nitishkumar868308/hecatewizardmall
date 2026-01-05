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



// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState("All");


//     // Fetch data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set selected category/subcategory from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         // Category id from name
//         const cat = categories.find((c) => c.name.toLowerCase() === categoryQuery.toLowerCase());
//         setSelectedCategory(cat ? cat.id : "All");

//         // Subcategory id from name
//         const sub = subcategories.find(
//             (s) => s.name.toLowerCase() === subcategoryQuery.toLowerCase() && s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Filter and sort products
//     const filteredProducts = products
//         .filter(
//             (p) =>
//                 (selectedCategory === "All" || p.categoryId === selectedCategory) &&
//                 (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
//         )
//         .filter((p) =>
//             selectedAlphabet === "All" ||
//             (p.name && p.name.toLowerCase().startsWith(selectedAlphabet.toLowerCase()))
//         )
//         .filter((p) => p.price <= priceRange)
//         .sort((a, b) => (sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price));

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };


//     // Handle category click
//     // const handleCategoryClick = (cat) => {
//     //     setSelectedCategory(cat.id);
//     //     setSelectedSubcategory("All");
//     //     router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//     // };
//     const handleCategoryClick = (cat) => {
//         if (selectedCategory !== cat.id) {
//             // Doosri category select ho rahi hai
//             setSelectedCategory(cat.id);
//             setSelectedSubcategory("All");
//             setCurrentPage(1);
//         } else {
//             // Same category dobara click hua
//             // state change mat karo, bas route refresh karao
//             router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//             return;
//         }

//         router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//     };

//     // Handle subcategory click
//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`);
//     };



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

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar Filters */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories & Subcategories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             {/* Icon */}
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {/* Subcategories */}
//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""
//                                                                 }`}
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

//                 {/* Products Grid */}
//                 <div className="w-full md:w-3/4">
//                     {currentProducts.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                             {currentProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                     onClick={() => router.push(`/product/${product.id}`)}
//                                 >
//                                     <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                         {Array.isArray(product.image) && product.image[0] ? (
//                                             <Image
//                                                 src={product.image[0]}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : product.image ? (
//                                             <Image
//                                                 src={product.image}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                 No Image
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* <div className="space-y-2">
//                                         <h3 className="text-xl font-bold text-gray-900 tracking-tight">
//                                             {product.name}
//                                         </h3>
//                                         <p className="text-lg font-semibold text-gray-600">
//                                             {product.currencySymbol}{product.price}
//                                         </p>
//                                     </div> */}
//                                     {/* <div className="flex items-center justify-between">
//                                         <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
//                                         <span className="bg-blue-100 text-gray-700 font-bold px-3 py-1 rounded-full text-sm">
//                                             {product.currencySymbol}{product.price}
//                                         </span>
//                                     </div> */}
//                                     <div className="flex flex-col">
//                                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                                         <p className="text-sm text-gray-500">
//                                             Price: <span className="text-xl font-bold text-gray-600">
//                                                 {product.currencySymbol}{product.price}
//                                             </span>
//                                         </p>
//                                     </div>

//                                 </div>
//                             ))}


//                         </div>
//                     ) : (
//                         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                             <p className="text-gray-400 text-lg">No products found 😔</p>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 Try changing the category, subcategory, or price filter.
//                             </p>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                         <button
//                             disabled={currentPage === 1}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === 1
//                                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Prev
//                         </button>

//                         {Array.from({ length: totalPages }, (_, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => handlePageChange(i + 1)}
//                                 className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                     ? "bg-blue-500 text-white font-semibold cursor-default"
//                                     : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                     }`}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}

//                         <button
//                             disabled={currentPage === totalPages || totalPages === 0}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>

//                 </div>

//                 <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                     <button
//                         onClick={() => setSelectedAlphabet("All")}
//                         className={`px-2 py-1 text-sm rounded ${selectedAlphabet === "All" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
//                     >
//                         All
//                     </button>
//                     {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
//                         <button
//                             key={letter}
//                             onClick={() => setSelectedAlphabet(letter)}
//                             className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                         >
//                             {letter}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default Categories;


// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState(null); // null = no alphabet filter

//     // Fetch data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set selected category/subcategory from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         const cat = categories.find(
//             (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
//         );
//         setSelectedCategory(cat ? cat.id : "All");

//         const sub = subcategories.find(
//             (s) =>
//                 s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
//                 s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Step 1: Category + Subcategory + Price + Sort
//     const baseFiltered = products
//         .filter(
//             (p) =>
//                 (selectedCategory === "All" || p.categoryId === selectedCategory) &&
//                 (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
//         )
//         .filter((p) => p.price <= priceRange)
//         .sort((a, b) =>
//             sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
//         );

//     // Step 2: Available Alphabets from current baseFiltered
//     const availableAlphabets = Array.from(
//         new Set(
//             baseFiltered
//                 .map((p) => p.name?.[0]?.toUpperCase())
//                 .filter((ch) => ch >= "A" && ch <= "Z")
//         )
//     ).sort();

//     // Step 3: Final products (alphabet applied)
//     const filteredProducts = baseFiltered.filter(
//         (p) =>
//             !selectedAlphabet ||
//             (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
//     );

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     // Category Click
//     const handleCategoryClick = (cat) => {
//         setSelectedAlphabet(null); // reset alphabet on category change
//         if (selectedCategory !== cat.id) {
//             setSelectedCategory(cat.id);
//             setSelectedSubcategory("All");
//             setCurrentPage(1);
//         } else {
//             router.push(
//                 `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//             );
//             return;
//         }
//         router.push(
//             `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//         );
//     };

//     // Subcategory Click
//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedAlphabet(null); // reset alphabet on subcategory change
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(
//                 cat.name
//             )}&subcategory=${encodeURIComponent(sub.name)}`
//         );
//     };

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {/* Toggle Filters for Mobile */}
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

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar Filters */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         setSelectedAlphabet(null);
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All"
//                                             ? "bg-blue-200 font-semibold"
//                                             : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id
//                                                     ? "bg-blue-200 font-semibold"
//                                                     : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id
//                                                                     ? "bg-blue-100 font-semibold"
//                                                                     : ""
//                                                                 }`}
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

//                 {/* Products Grid */}
//                 <div className="w-full md:w-3/4">
//                     {currentProducts.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                             {currentProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                     onClick={() => router.push(`/product/${product.id}`)}
//                                 >
//                                     <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                         {Array.isArray(product.image) && product.image[0] ? (
//                                             <Image
//                                                 src={product.image[0]}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : product.image ? (
//                                             <Image
//                                                 src={product.image}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                 No Image
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="flex flex-col">
//                                         <h3 className="text-lg font-semibold text-gray-900">
//                                             {product.name}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             Price:{" "}
//                                             <span className="text-xl font-bold text-gray-600">
//                                                 {product.currencySymbol}
//                                                 {product.price}
//                                             </span>
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                             <p className="text-gray-400 text-lg">No products found 😔</p>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 Try changing the category, subcategory, price, or alphabet
//                                 filter.
//                             </p>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                         <button
//                             disabled={currentPage === 1}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === 1
//                                     ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                     : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Prev
//                         </button>

//                         {Array.from({ length: totalPages }, (_, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => handlePageChange(i + 1)}
//                                 className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                         ? "bg-blue-500 text-white font-semibold cursor-default"
//                                         : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                     }`}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}

//                         <button
//                             disabled={currentPage === totalPages || totalPages === 0}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                     ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                     : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>

//                 {/* Dynamic Alphabet Sidebar */}
//                 <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                     {availableAlphabets.map((letter) => (
//                         <button
//                             key={letter}
//                             onClick={() => setSelectedAlphabet(letter)}
//                             className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter
//                                     ? "bg-blue-500 text-white"
//                                     : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                         >
//                             {letter}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Categories;


// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState(null);

//     // Fetch Data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive Check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         const cat = categories.find(
//             (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
//         );
//         setSelectedCategory(cat ? cat.id : "All");

//         const sub = subcategories.find(
//             (s) =>
//                 s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
//                 s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Step 1: Decide viewMode
//     let viewMode = "products";
//     if (selectedCategory !== "All" && selectedSubcategory === "All") {
//         viewMode = "subcategories";
//     }

//     // Step 2: Filter Products
//     let baseFiltered = [];
//     if (viewMode === "products") {
//         baseFiltered = products
//             .filter((p) =>
//                 selectedCategory === "All"
//                     ? true
//                     : p.categoryId === selectedCategory &&
//                     (selectedSubcategory === "All" ||
//                         p.subcategoryId === selectedSubcategory)
//             )
//             .filter((p) => p.price <= priceRange)
//             .sort((a, b) =>
//                 sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
//             );
//     }

//     // Step 3: Alphabets
//     const availableAlphabets =
//         viewMode === "products"
//             ? Array.from(
//                 new Set(
//                     baseFiltered
//                         .map((p) => p.name?.[0]?.toUpperCase())
//                         .filter((ch) => ch >= "A" && ch <= "Z")
//                 )
//             ).sort()
//             : [];

//     // Step 4: Apply Alphabet Filter
//     const filteredProducts =
//         viewMode === "products"
//             ? baseFiltered.filter(
//                 (p) =>
//                     !selectedAlphabet ||
//                     (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
//             )
//             : [];

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     // Handlers
//     const handleCategoryClick = (cat) => {
//         setSelectedAlphabet(null);
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory("All");
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//         );
//     };

//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedAlphabet(null);
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(
//                 cat.name
//             )}&subcategory=${encodeURIComponent(sub.name)}`
//         );
//     };

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {/* Mobile Filters Toggle */}
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

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         setSelectedAlphabet(null);
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id
//                                                     ? "bg-blue-200 font-semibold"
//                                                     : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 <li
//                                                     onClick={() =>
//                                                         router.push(
//                                                             `/categories?category=${encodeURIComponent(
//                                                                 cat.name
//                                                             )}&subcategory=All`
//                                                         )
//                                                     }
//                                                     className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === "All" ? "bg-blue-100" : ""
//                                                         }`}
//                                                 >
//                                                     All
//                                                 </li>
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id
//                                                                     ? "bg-blue-100 font-semibold"
//                                                                     : ""
//                                                                 }`}
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
//                             <h3 className="font-semibold mb-2">
//                                 Price: Up to ${priceRange}
//                             </h3>
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

//                 {/* Content */}
//                 <div className="w-full md:w-3/4">
//                     {/* Case 2: Subcategories view */}
//                     {viewMode === "subcategories" && (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
//                             {subcategories
//                                 .filter((s) => s.categoryId === selectedCategory)
//                                 .map((sub) => (
//                                     <div
//                                         key={sub.id}
//                                         onClick={() =>
//                                             handleSubcategoryClick(
//                                                 categories.find((c) => c.id === selectedCategory),
//                                                 sub
//                                             )
//                                         }
//                                         className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
//                                     >
//                                         <h3 className="text-lg font-semibold text-gray-900">
//                                             {sub.name}
//                                         </h3>
//                                     </div>
//                                 ))}
//                         </div>
//                     )}

//                     {/* Case 1 & 3: Products */}
//                     {viewMode === "products" && (
//                         <>
//                             {currentProducts.length > 0 ? (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                                     {currentProducts.map((product) => (
//                                         <div
//                                             key={product.id}
//                                             className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                             onClick={() => router.push(`/product/${product.id}`)}
//                                         >
//                                             <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                                 {Array.isArray(product.image) && product.image[0] ? (
//                                                     <Image
//                                                         src={product.image[0]}
//                                                         alt={product.name || "Product Image"}
//                                                         fill
//                                                         className="object-cover"
//                                                     />
//                                                 ) : product.image ? (
//                                                     <Image
//                                                         src={product.image}
//                                                         alt={product.name || "Product Image"}
//                                                         fill
//                                                         className="object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                         No Image
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <h3 className="text-lg font-semibold text-gray-900">
//                                                     {product.name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-500">
//                                                     Price:{" "}
//                                                     <span className="text-xl font-bold text-gray-600">
//                                                         {product.currencySymbol}
//                                                         {product.price}
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                                     <p className="text-gray-400 text-lg">No products found 😔</p>
//                                     <p className="text-gray-500 text-sm mt-1">
//                                         Try changing the category, subcategory, price, or alphabet
//                                         filter.
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Pagination */}
//                             <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                                 <button
//                                     disabled={currentPage === 1}
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     className={`px-4 py-2 rounded transition ${currentPage === 1
//                                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                             : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                         }`}
//                                 >
//                                     Prev
//                                 </button>

//                                 {Array.from({ length: totalPages }, (_, i) => (
//                                     <button
//                                         key={i}
//                                         onClick={() => handlePageChange(i + 1)}
//                                         className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                                 ? "bg-blue-500 text-white font-semibold cursor-default"
//                                                 : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                             }`}
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 ))}

//                                 <button
//                                     disabled={currentPage === totalPages || totalPages === 0}
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                             : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                         }`}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* Alphabets */}
//                 {viewMode === "products" && (
//                     <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                         {availableAlphabets.map((letter) => (
//                             <button
//                                 key={letter}
//                                 onClick={() => setSelectedAlphabet(letter)}
//                                 className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter
//                                         ? "bg-blue-500 text-white"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                     }`}
//                             >
//                                 {letter}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Categories;


"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchFastProducts } from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { fetchTags } from "@/app/redux/slices/tag/tagSlice";
import { usePathname } from "next/navigation";
import { fetchDispatches } from "@/app/redux/slices/dispatchUnitsWareHouse/dispatchUnitsWareHouseSlice";

const sortOptions = ["Price: Low to High", "Price: High to Low"];

const Categories = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);
    const { tags } = useSelector((state) => state.tags);
    const [selectedTag, setSelectedTag] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubcategory, setSelectedSubcategory] = useState("All");
    const highestPrice = products.length
        ? Math.max(...products.map((p) => p.price || 0))
        : 10000;
    const [priceRange, setPriceRange] = useState(highestPrice);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const [selectedAlphabet, setSelectedAlphabet] = useState(null);
    const { dispatches } = useSelector((state) => state.dispatchWarehouse);
    const [categoryVariations, setCategoryVariations] = useState({});
    const [selectedVariations, setSelectedVariations] = useState({});
    // const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [currentPath, setCurrentPath] = useState("");
    const [tempFilters, setTempFilters] = useState({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        price: priceRange,
        sortBy,
        tag: selectedTag,
        alphabet: selectedAlphabet || null,
    });
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHydrated(true); // client-side ready
        }
    }, []);
    const selectedState = useSelector(state => state.selectedState) || (hydrated ? localStorage.getItem("state") : null);


    // console.log("dispatches", dispatches)
    const isXpress = pathname.includes("/hecate-quickGo");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentPath(pathname); // only set after client hydration
        }
    }, [pathname]);

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         setSelectedWarehouseId(localStorage.getItem("warehouseId"));
    //     }
    // }, []);

    const selectedWarehouseId = useSelector(
        state => state.warehouseSelection?.warehouseId
    ) || (hydrated ? localStorage.getItem("warehouseId") : null);


    // const warehouseProductIds = isXpress
    //     ? dispatches?.map(ds => {
    //         let foundProductId = null;

    //         ds.entries?.forEach(dim => {
    //             dim.entries?.forEach(e => {
    //                 if (
    //                     e.warehouseId?.toString() === selectedWarehouseId?.toString()
    //                 ) {
    //                     foundProductId = dim.productId; // productId nested entries me hai
    //                 }
    //             });
    //         });

    //         return foundProductId;
    //     }).filter(Boolean)
    //     : null;
    // const warehouseProductIds = useMemo(() => {
    //     if (!isXpress || !dispatches?.length || !selectedWarehouseId) return [];
    //     return dispatches.map(ds => {
    //         let foundProductId = null;
    //         ds.entries?.forEach(dim => {
    //             dim.entries?.forEach(e => {
    //                 if (e.warehouseId?.toString() === selectedWarehouseId.toString()) {
    //                     foundProductId = dim.productId;
    //                 }
    //             });
    //         });
    //         return foundProductId;
    //     }).filter(Boolean);
    // }, [dispatches, selectedWarehouseId, isXpress]);
    const warehouseProductIds = useMemo(() => {
        if (!isXpress || !dispatches?.length || !selectedWarehouseId) return [];

        return dispatches
            .map(ds => {
                let found = null;
                ds.entries?.forEach(dim => {
                    dim.entries?.forEach(e => {
                        if (e.warehouseId?.toString() === selectedWarehouseId.toString()) {
                            found = dim.productId;
                        }
                    });
                });
                return found;
            })
            .filter(Boolean);
    }, [dispatches, selectedWarehouseId, isXpress]);



    useEffect(() => {
        setPriceRange(highestPrice);
    }, [highestPrice]);


    useEffect(() => {
        dispatch(fetchFastProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
        dispatch(fetchTags());
        dispatch(fetchDispatches())
    }, [dispatch]);


    const stateProductIds = useMemo(() => {
        if (!isXpress || !dispatches?.length || !selectedState) return [];

        return dispatches
            .map(ds => {
                let foundProductId = null;

                ds.entries?.forEach(dim => {
                    dim.entries?.forEach(e => {
                        if (
                            e.state?.toLowerCase() === selectedState.toLowerCase()
                        ) {
                            foundProductId = dim.productId;
                        }
                    });
                });

                return foundProductId;
            })
            .filter(Boolean);
    }, [dispatches, selectedState, isXpress]);
    console.log("stateProductIds", stateProductIds)

    // const variationBaseProducts = useMemo(() => {
    //     return products.filter((p) => {
    //         const matchCategory =
    //             selectedCategory === "All" || p.categoryId === selectedCategory;

    //         const matchSubcategory =
    //             selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;

    //         const matchPlatform = isXpress
    //             ? p.platform.includes("xpress")
    //             : p.platform.includes("website");

    //         const matchWarehouse = isXpress
    //             ? warehouseProductIds?.includes(p.id)
    //             : true;

    //         const matchState = isXpress
    //             ? !selectedState || stateProductIds.includes(p.id)
    //             : true;
    //         console.log("matchState", matchState)
    //         return (
    //             p.active &&
    //             matchCategory &&
    //             matchSubcategory &&
    //             matchPlatform &&
    //             matchWarehouse &&
    //             matchState &&
    //             p.price <= priceRange
    //         );
    //     });
    // }, [
    //     products,
    //     selectedCategory,
    //     selectedSubcategory,
    //     isXpress,
    //     warehouseProductIds,
    //     priceRange
    // ]);

    const variationBaseProducts = useMemo(() => {
        return products.filter(p => {
            if (isXpress) {
                if (!selectedState) return false;
                if (!warehouseProductIds.includes(p.id)) return false;
            }

            const matchCategory =
                selectedCategory === "All" || p.categoryId === selectedCategory;

            const matchSubcategory =
                selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;

            const matchPlatform = isXpress
                ? p.platform.includes("xpress")
                : p.platform.includes("website");

            return (
                p.active &&
                matchCategory &&
                matchSubcategory &&
                matchPlatform &&
                p.price <= priceRange
            );
        });
    }, [
        products,
        selectedCategory,
        selectedSubcategory,
        isXpress,
        warehouseProductIds,
        selectedState,
        priceRange
    ]);



    const mobileVariationBaseProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCategory =
                tempFilters.category === "All" || p.categoryId === tempFilters.category;

            const matchSubcategory =
                tempFilters.subcategory === "All" || p.subcategoryId === tempFilters.subcategory;

            const matchPlatform = isXpress
                ? p.platform.includes("xpress")
                : p.platform.includes("website");

            const matchWarehouse = isXpress
                ? warehouseProductIds?.includes(p.id)
                : true;

            return (
                p.active &&
                matchCategory &&
                matchSubcategory &&
                matchPlatform &&
                matchWarehouse &&
                p.price <= priceRange
            );
        });
    }, [
        products,
        tempFilters.category,
        tempFilters.subcategory,
        isXpress,
        warehouseProductIds,
        priceRange
    ]);


    useEffect(() => {
        if (tempFilters.subcategory === "All") {
            setCategoryVariations({});
            setSelectedVariations({});
            return;
        }

        const variationsObj = {};

        mobileVariationBaseProducts.forEach(p => {
            p.variations?.forEach(v => {
                const parts = v.variationName?.split(" / ") || [];
                parts.forEach(part => {
                    const [varName, value] = part.split(":").map(s => s.trim());
                    if (!varName || !value) return;

                    if (!variationsObj[varName]) variationsObj[varName] = [];
                    if (!variationsObj[varName].includes(value)) {
                        variationsObj[varName].push(value);
                    }
                });
            });
        });

        setCategoryVariations(variationsObj);
        setSelectedVariations({}); // reset for mobile
    }, [tempFilters.subcategory, mobileVariationBaseProducts]);





    // useEffect(() => {
    //     if (selectedSubcategory === "All") {
    //         setCategoryVariations({});
    //         setSelectedVariations({});
    //         return;
    //     }

    //     const variationsObj = {};

    //     variationBaseProducts.forEach(p => {
    //         p.variations?.forEach(v => {
    //             const parts = v.variationName?.split(" / ") || [];

    //             parts.forEach(part => {
    //                 const [varName, value] = part.split(":").map(s => s.trim());
    //                 if (!varName || !value) return;

    //                 if (!variationsObj[varName]) variationsObj[varName] = [];
    //                 if (!variationsObj[varName].includes(value)) {
    //                     variationsObj[varName].push(value);
    //                 }
    //             });
    //         });
    //     });

    //     setCategoryVariations(variationsObj);
    //     setSelectedVariations({});
    // }, [
    //     selectedSubcategory,
    //     variationBaseProducts
    // ]);

    useEffect(() => {
        if (selectedSubcategory === "All") {
            setCategoryVariations({});
            setSelectedVariations({});
            return;
        }

        const variationsObj = {};
        variationBaseProducts.forEach(p => {
            p.variations?.forEach(v => {
                const parts = v.variationName?.split(" / ") || [];
                parts.forEach(part => {
                    const [varName, value] = part.split(":").map(s => s.trim());
                    if (!varName || !value) return;

                    if (!variationsObj[varName]) variationsObj[varName] = [];
                    if (!variationsObj[varName].includes(value)) {
                        variationsObj[varName].push(value);
                    }
                });
            });
        });

        setCategoryVariations(prev => JSON.stringify(prev) === JSON.stringify(variationsObj) ? prev : variationsObj);
        setSelectedVariations({});
    }, [selectedSubcategory, variationBaseProducts]);





    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const tagQuery = searchParams.get("tag") || "All";
        setSelectedTag(tagQuery);
    }, [searchParams]);

    // useEffect(() => {
    //     const categoryQuery = searchParams.get("category") || "All";
    //     const subcategoryQuery = searchParams.get("subcategory") || "All";

    //     const cat = categories.find(
    //         (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
    //     );
    //     setSelectedCategory(cat ? cat.id : "All");

    //     const sub = subcategories.find(
    //         (s) =>
    //             s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
    //             s.categoryId === (cat ? cat.id : null)
    //     );
    //     setSelectedSubcategory(sub ? sub.id : "All");
    // }, [searchParams, categories, subcategories]);

    useEffect(() => {
        const categoryQuery = searchParams.get("category") || "All";
        const subcategoryQuery = searchParams.get("subcategory") || "All";

        const cat = categories.find(
            (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
        );
        setSelectedCategory(cat ? cat.id : "All");

        const sub = subcategories.find(
            (s) =>
                s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
                s.categoryId === (cat ? cat.id : null)
        );
        setSelectedSubcategory(sub ? sub.id : "All");
    }, [searchParams, categories, subcategories]);

    // useEffect(() => {
    //     if (!showFilters) return;

    //     setTempFilters({
    //         category: selectedCategory,
    //         subcategory: selectedSubcategory,
    //         price: priceRange,
    //         sortBy: sortBy,
    //         tag: selectedTag,
    //         alphabet: selectedAlphabet,
    //     });
    // }, [
    //     showFilters,
    //     selectedCategory,
    //     selectedSubcategory,
    //     priceRange,
    //     sortBy,
    //     selectedTag,
    //     selectedAlphabet,
    // ]);
    useEffect(() => {
        if (!showFilters) return;
        setTempFilters(prev => {
            const newFilters = {
                category: selectedCategory,
                subcategory: selectedSubcategory,
                price: priceRange,
                sortBy: sortBy,
                tag: selectedTag,
                alphabet: selectedAlphabet,
            };
            if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
            return newFilters;
        });
    }, [showFilters, selectedCategory, selectedSubcategory, priceRange, sortBy, selectedTag, selectedAlphabet]);




    const baseFiltered = products
        .filter((p) => {
            const matchCategory =
                selectedCategory === "All" || p.categoryId === selectedCategory;
            const matchSubcategory =
                selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;

            const matchTag =
                selectedTag === "All"
                    ? true
                    : (Array.isArray(p.tags)
                        ? p.tags.some((t) => {
                            const officialTagNames = tags.map(tag => tag.name.toLowerCase());
                            return officialTagNames.includes((t?.name || t || "").toLowerCase()) &&
                                (t?.name || t || "").toLowerCase() === selectedTag.toLowerCase();
                        })
                        : false);

            const matchPlatform = isXpress ? p.platform.includes("xpress") : p.platform.includes("website");

            // ✅ Warehouse filter only for Xpress
            const matchWarehouse = isXpress
                ? warehouseProductIds?.includes(p.id)
                : true;

            const shouldApplyVariations = selectedSubcategory !== "All";

            const matchVariations = shouldApplyVariations
                ? Object.entries(selectedVariations).every(([varName, value]) => {
                    if (!value) return true;

                    return p.variations?.some(v => {
                        const parts = v.variationName?.split(" / ") || [];
                        return parts.some(part => {
                            const [name, val] = part.split(":").map(s => s.trim());
                            return (
                                name === varName &&
                                val?.toLowerCase() === value.toLowerCase()
                            );
                        });
                    });
                })
                : true;


            return p.active && matchCategory && matchSubcategory && matchTag && matchPlatform && matchWarehouse && selectedState &&
                stateProductIds && matchVariations && p.price <= priceRange;
        })
        .sort((a, b) =>
            sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
        );
    // console.log("baseFiltered", baseFiltered)

    // Determine if we should show subcategory cards instead of products
    const showSubcategoryCards =
        selectedCategory !== "All" && selectedSubcategory === "All";

    // Alphabets (dynamic)
    const availableAlphabets = Array.from(
        new Set(
            (showSubcategoryCards
                ? subcategories
                    .filter((s) => s.categoryId === selectedCategory)
                    .map((s) => s.name?.[0]?.toUpperCase())
                : baseFiltered.map((p) => p.name?.[0]?.toUpperCase())
            ).filter((ch) => ch >= "A" && ch <= "Z")
        )
    ).sort();

    // Final products
    const filteredProducts = baseFiltered.filter(
        (p) =>
            !selectedAlphabet ||
            (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
    );
    // console.log("filteredProducts", filteredProducts.length);


    const displayedItems = showSubcategoryCards
        ? subcategories
            .filter((s) => s.categoryId === selectedCategory)
            .filter((s) =>
                !selectedAlphabet || (s.name && s.name.toUpperCase().startsWith(selectedAlphabet))
            )
        : filteredProducts;

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Category Click
    // const handleCategoryClick = (cat) => {
    //     setSelectedAlphabet(null);
    //     setSelectedCategory(cat.id);
    //     setSelectedSubcategory("All");
    //     setCurrentPage(1);
    //     router.push(
    //         `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
    //     );
    // };
    const navigateTo = (catName, subName = "All") => {
        if (!currentPath) return; // wait until client-side path is available

        const basePath = currentPath.includes("/hecate-quickGo")
            ? "/hecate-quickGo/categories"
            : "/categories";
        console.log("basePath", basePath)
        router.push(
            `${basePath}?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(subName)}`
        );
    };
    const handleCategoryClick = (cat) => {
        setSelectedAlphabet(null);
        setSelectedCategory(cat.id);
        setSelectedSubcategory("All");
        setCurrentPage(1);

        navigateTo(cat.name, "All");
    };


    // Subcategory Click
    // const handleSubcategoryClick = (cat, sub) => {
    //     setSelectedAlphabet(null);
    //     setSelectedCategory(cat.id);
    //     setSelectedSubcategory(sub.id);
    //     setCurrentPage(1);
    //     router.push(
    //         `/categories?category=${encodeURIComponent(
    //             cat.name
    //         )}&subcategory=${encodeURIComponent(sub.name)}`
    //     );
    // };
    const handleSubcategoryClick = (cat, sub) => {
        setSelectedAlphabet(null);
        setSelectedCategory(cat.id);
        setSelectedSubcategory(sub.id);
        setCurrentPage(1);

        // Decide base path
        const basePath = pathname.includes("/hecate-quickGo")
            ? "/hecate-quickGo/categories"
            : "/categories";

        router.push(
            `${basePath}?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`
        );
    };


    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubcategory, priceRange, sortBy, selectedAlphabet, showSubcategoryCards]);

    const productsWithoutTagFilter = products.filter((p) => {
        const matchCategory =
            selectedCategory === "All" || p.categoryId === selectedCategory;

        const matchSubcategory =
            selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;

        const matchPlatform = isXpress
            ? p.platform.includes("xpress")
            : p.platform.includes("website");

        const matchWarehouse = isXpress
            ? warehouseProductIds?.includes(p.id)
            : true;

        return (
            p.active &&
            matchCategory &&
            matchSubcategory &&
            matchPlatform &&
            matchWarehouse &&
            p.price <= priceRange
        );
    });


    // Compute tags from currently filtered products
    const displayedTags = Array.from(
        new Set(
            productsWithoutTagFilter.flatMap(p =>
                p.tags
                    ?.filter(t => t.active)
                    .map(t => t.name) || []
            )
        )
    );

    // console.log("Selected Variations", selectedVariations);
    const getPaginationPages = (currentPage, totalPages) => {
        const pages = [];
        const delta = 2;

        const range = {
            start: Math.max(2, currentPage - delta),
            end: Math.min(totalPages - 1, currentPage + delta),
        };

        pages.push(1);

        if (range.start > 2) {
            pages.push("...");
        }

        for (let i = range.start; i <= range.end; i++) {
            pages.push(i);
        }

        if (range.end < totalPages - 1) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro relative">
            {!isDesktop && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%]">
                    <button
                        onClick={() => setShowFilters(true)}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg shadow-lg"
                    >
                        Filters
                    </button>
                </div>
            )}
            <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
                {/* Sidebar Filters */}
                {(isDesktop || showFilters) && (
                    <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">Filters</h2>

                        {/* Categories
                        <div>
                            <h3 className="font-semibold mb-2">Categories</h3>
                            <ul className="flex flex-col gap-2">
                                <li
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedSubcategory("All");
                                        setSelectedAlphabet(null);
                                        // router.push(`/categories?category=All&subcategory=All`);
                                        const basePath = pathname.includes("/hecate-quickGo")
                                            ? "/hecate-quickGo/categories"
                                            : "/categories";

                                        router.push(`${basePath}?category=All&subcategory=All`);
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
                                            className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 
            ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""}`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-lg font-bold">
                                                {selectedCategory === cat.id ? "−" : "+"}
                                            </span>
                                        </div>

                                        {selectedCategory === cat.id &&
                                            subcategories.some((s) => s.categoryId === cat.id) && (
                                                <ul className="ml-4 mt-1 flex flex-col gap-1">
                                                    {subcategories
                                                        .filter((s) => s.categoryId === cat.id)
                                                        .map((sub) => (
                                                            <li
                                                                key={sub.id}
                                                                onClick={() => handleSubcategoryClick(cat, sub)}
                                                                className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm 
                                ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""}`}
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

                        {selectedSubcategory !== "All" && Object.keys(categoryVariations).length > 0 && (
                            <div className="mb-4">
                                {Object.entries(categoryVariations).map(([varName, varValues]) => (
                                    <div key={varName} className="mb-3">
                                        <h3 className="font-semibold mb-2">{varName}</h3>

                                        <div className="flex flex-wrap gap-2">
                                            {varValues.map(value => {
                                                const isSelected = selectedVariations[varName] === value;

                                                return (
                                                    <button
                                                        key={`${varName}-${value}`}
                                                        onClick={() =>
                                                            setSelectedVariations(prev => ({
                                                                ...prev,
                                                                [varName]: isSelected ? null : value
                                                            }))
                                                        }
                                                        className={`px-3 py-1.5 rounded border text-sm transition
                  ${isSelected
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }
                `}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )} */}

                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold mb-2">Categories</h3>
                            <ul className="flex flex-col gap-2">
                                {/* All Category */}
                                <li
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedSubcategory("All");
                                        setSelectedAlphabet(null);

                                        const basePath = pathname.includes("/hecate-quickGo")
                                            ? "/hecate-quickGo/categories"
                                            : "/categories";

                                        router.push(`${basePath}?category=All&subcategory=All`);
                                    }}
                                    className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
                                        }`}
                                >
                                    All
                                </li>

                                {/* Filtered Categories */}
                                {(isXpress
                                    ? categories.filter(cat =>
                                        cat.platform?.includes("xpress") &&
                                        cat.states?.some(st => st.name === selectedState)
                                    )
                                    : categories
                                ).map((cat) => (
                                    <li key={cat.id} className="mb-2">
                                        <div
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 
                    ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""}`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-lg font-bold">
                                                {selectedCategory === cat.id ? "−" : "+"}
                                            </span>
                                        </div>

                                        {/* Filtered Subcategories */}
                                        {selectedCategory === cat.id &&
                                            subcategories.some(s => s.categoryId === cat.id) && (
                                                <ul className="ml-4 mt-1 flex flex-col gap-1">
                                                    {(isXpress
                                                        ? subcategories
                                                            .filter(s => s.categoryId === cat.id)
                                                            .filter(s => s.platform?.includes("xpress"))
                                                            .filter(s => s.states?.some(st => st.name === selectedState))
                                                        : subcategories.filter(s => s.categoryId === cat.id)
                                                    ).map(sub => (
                                                        <li
                                                            key={sub.id}
                                                            onClick={() => handleSubcategoryClick(cat, sub)}
                                                            className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm 
                                    ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""}`}
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



                        {/* Tags */}
                        <div>
                            <h3 className="font-semibold mb-2">Tags</h3>
                            <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                <li
                                    onClick={() => setSelectedTag("All")}
                                    className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedTag === "All" ? "bg-blue-200 font-semibold" : ""}`}
                                >
                                    All
                                </li>
                                {displayedTags.map((tagName) => (
                                    <li
                                        key={tagName}
                                        onClick={() => setSelectedTag(tagName)}
                                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedTag === tagName ? "bg-blue-200 font-semibold" : ""}`}
                                    >
                                        {tagName}
                                    </li>
                                ))}
                            </ul>
                        </div>



                        {/* Price */}
                        <div>
                            <h3 className="font-semibold mb-2">
                                Price: {products[0]?.currency} {products[0]?.currencySymbol || "₹"}{priceRange}
                            </h3>
                            <input
                                type="range"
                                min={0}
                                max={highestPrice}
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full cursor-pointer accent-gray-500"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="font-semibold mb-2">Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full cursor-pointer p-2 border rounded"
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

                {/* Products or Subcategory Grid */}
                <div className="w-full md:w-3/4 relative pt-0 md:pt-0">

                    {/* Breadcrumbs */}
                    <div className="mb-4">
                        <div className="flex flex-wrap items-center gap-1 text-sm">

                            {/* All Category */}
                            <span
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedSubcategory("All");
                                }}
                                className={`cursor-pointer font-medium ${selectedCategory === "All"
                                    ? "text-black"
                                    : "text-gray-600 hover:text-black"
                                    }`}
                            >
                                All Category
                            </span>

                            {/* Selected Category */}
                            {selectedCategory !== "All" && (
                                <>
                                    <span className="mx-1 text-gray-400">{">>"}</span>
                                    <span
                                        onClick={() => setSelectedSubcategory("All")}
                                        className={`cursor-pointer font-medium ${selectedSubcategory === "All"
                                            ? "text-black"
                                            : "text-gray-600 hover:text-black"
                                            }`}
                                    >
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                    </span>
                                </>
                            )}

                            {/* Selected Subcategory */}
                            {selectedCategory !== "All" && selectedSubcategory !== "All" && (
                                <>
                                    <span className="mx-1 text-gray-400">{">>"}</span>
                                    <span className="font-semibold text-black">
                                        {subcategories.find(s => s.id === selectedSubcategory)?.name}
                                    </span>
                                </>
                            )}

                        </div>
                    </div>





                    {showSubcategoryCards ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {displayedItems.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    onClick={() => handleSubcategoryClick(
                                        categories.find(c => c.id === selectedCategory),
                                        sub
                                    )}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden">
                                        {sub.image ? (
                                            <Image
                                                src={sub.image}
                                                alt={sub.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {sub.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : currentProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    // onClick={() => router.push(`/product/${product.id}`)}
                                    onClick={() => {
                                        if (isXpress) {
                                            router.push(`/hecate-quickGo/product/${product.id}`);
                                        } else {
                                            router.push(`/product/${product.id}`);
                                        }
                                    }}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden">
                                        {Array.isArray(product.image) && product.image[0] ? (
                                            <Image
                                                src={product.image[0]}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Price:{" "}
                                            <span className="text-xl font-bold text-gray-600">
                                                {product.currency} {product.currencySymbol}{product.price}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-400 text-lg">No products found 😔</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Try changing the category, subcategory, price, or alphabet filter.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {/* {!showSubcategoryCards && (
                        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`px-4 py-2 rounded transition ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                                    }`}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded transition ${currentPage === i + 1
                                        ? "bg-gray-600 text-white font-semibold cursor-default"
                                        : "bg-gray-100 hover:bg-gray-400 cursor-pointer"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )} */}

                    {!showSubcategoryCards && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                            {/* Prev */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`px-3 py-2 rounded ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800"
                                    }`}
                            >
                                Prev
                            </button>

                            {/* Page Numbers */}
                            {getPaginationPages(currentPage, totalPages).map((page, idx) =>
                                page === "..." ? (
                                    <span key={idx} className="px-2 text-gray-500">...</span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${currentPage === page
                                            ? "bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 hover:bg-gray-300"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            {/* Next */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`px-3 py-2 rounded ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                </div>
                {isDesktop && (
                    <div className="hidden md:flex flex-col gap-4 ml-4 sticky top-20">
                        {availableAlphabets.map((letter) => {
                            const isSelected = selectedAlphabet === letter;

                            return (
                                <button
                                    key={letter}
                                    onClick={() =>
                                        setSelectedAlphabet(prev => (prev === letter ? null : letter))
                                    }
                                    className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-200
                        ${isSelected
                                            ? "bg-gray-500 text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                )}



                {/* Mobile Filters Modal */}
                {!isDesktop && showFilters && (
                    <div className="fixed inset-0 z-[999] bg-white flex flex-col">

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-4 py-4 border-b shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-600 hover:text-gray-900 text-xl font-semibold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="flex flex-1 overflow-hidden">

                            {/* LEFT PANEL */}
                            <div className="w-1/3 border-r bg-gray-50 flex flex-col overflow-y-auto">

                                {/* MAIN FILTER TABS */}
                                <div className="border-b">
                                    {[
                                        { key: "category", label: "Category" },
                                        { key: "price", label: "Price" },
                                        { key: "alphabet", label: "Alphabet" },
                                        { key: "tags", label: "Tags" },
                                        { key: "sort", label: "Sort By" },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveFilter(key)}
                                            className={`w-full text-left px-4 py-3 text-sm border-b transition-colors
                    ${activeFilter === key
                                                    ? "bg-white font-semibold text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* ATTRIBUTES SECTION */}
                                {/* ATTRIBUTES (LEFT SIDE – NAMES ONLY) */}
                                {tempFilters.subcategory !== "All" &&
                                    Object.keys(categoryVariations).length > 0 && (
                                        <div className="border-t">
                                            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                                Attributes
                                            </p>

                                            {Object.keys(categoryVariations).map((attr) => (
                                                <button
                                                    key={attr}
                                                    onClick={() => setActiveFilter(attr)}
                                                    className={`w-full text-left px-4 py-3 text-sm border-b transition
            ${activeFilter === attr
                                                            ? "bg-white font-semibold text-gray-900"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {attr}
                                                </button>
                                            ))}
                                        </div>
                                    )}




                            </div>


                            {/* RIGHT PANEL */}
                            <div className="flex-1 p-4 overflow-y-auto">
                                {!activeFilter && (
                                    <div className="flex items-center justify-center h-full text-center text-gray-400 text-sm">
                                        Select a filter from the left to see options here.
                                    </div>
                                )}

                                {/* CATEGORY */}
                                {activeFilter === "category" && (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() =>
                                                setTempFilters((p) => ({
                                                    ...p,
                                                    category: "All",
                                                    subcategory: "All",
                                                }))
                                            }
                                            className={`block py-2 font-medium ${tempFilters.category === "All" ? "text-black font-semibold" : "text-gray-600 hover:text-gray-900"}`}
                                        >
                                            All Categories
                                        </button>

                                        {categories.map((cat) => {
                                            const isOpen = tempFilters.category === cat.id;
                                            return (
                                                <div key={cat.id} className="border-b">
                                                    <button
                                                        onClick={() =>
                                                            setTempFilters((p) => ({
                                                                ...p,
                                                                category: isOpen ? null : cat.id,
                                                                subcategory: null,
                                                            }))
                                                        }
                                                        className="w-full flex justify-between py-3 font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                                    >
                                                        {cat.name} <span>{isOpen ? "−" : "+"}</span>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="pl-4 pb-3 space-y-2">
                                                            {subcategories.filter((s) => s.categoryId === cat.id).map((sub) => (
                                                                <button
                                                                    key={sub.id}
                                                                    onClick={() =>
                                                                        setTempFilters((p) => ({
                                                                            ...p,
                                                                            subcategory: sub.id,
                                                                        }))
                                                                    }
                                                                    className={`block text-sm transition-colors duration-200 ${tempFilters.subcategory === sub.id ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                                                                >
                                                                    {sub.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* TAGS */}
                                {activeFilter === "tags" && (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setTempFilters((p) => ({ ...p, tag: "All" }))}
                                            className={`block text-sm ${tempFilters.tag === "All" ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                                        >
                                            All Tags
                                        </button>

                                        {displayedTags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setTempFilters((p) => ({ ...p, tag }))}
                                                className={`block text-sm ${tempFilters.tag === tag ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* ATTRIBUTE VALUES (RIGHT SIDE) */}
                                {activeFilter &&
                                    categoryVariations[activeFilter] && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                                {activeFilter}
                                            </h3>

                                            <div className="flex flex-wrap gap-2">
                                                {categoryVariations[activeFilter].map((value) => {
                                                    const isSelected = selectedVariations[activeFilter] === value;

                                                    return (
                                                        <button
                                                            key={value}
                                                            onClick={() =>
                                                                setSelectedVariations((prev) => ({
                                                                    ...prev,
                                                                    [activeFilter]: isSelected ? null : value,
                                                                }))
                                                            }
                                                            className={`px-4 py-2 rounded-full text-xs border transition
                ${isSelected
                                                                    ? "bg-gray-900 text-white border-gray-900"
                                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {value}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}



                                {/* ALPHABET */}
                                {activeFilter === "alphabet" && (
                                    <div className="flex flex-wrap gap-2 justify-start mt-2">
                                        {availableAlphabets.map((letter) => (
                                            <button
                                                key={letter}
                                                onClick={() =>
                                                    setTempFilters((p) => ({
                                                        ...p,
                                                        alphabet: p.alphabet === letter ? null : letter,
                                                    }))
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
                  ${tempFilters.alphabet === letter
                                                        ? "bg-gray-700 text-white shadow-lg scale-110"
                                                        : "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-white hover:scale-105"
                                                    }`}
                                            >
                                                {letter}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* PRICE */}
                                {activeFilter === "price" && (
                                    <div className="mt-4">
                                        <p className="font-medium mb-2 text-gray-700">
                                            Price: ₹{tempFilters.price}
                                        </p>
                                        <input
                                            type="range"
                                            min={0}
                                            max={highestPrice}
                                            value={tempFilters.price}
                                            onChange={(e) =>
                                                setTempFilters((p) => ({
                                                    ...p,
                                                    price: Number(e.target.value),
                                                }))
                                            }
                                            className="w-full accent-gray-600"
                                        />
                                    </div>
                                )}

                                {/* SORT */}
                                {activeFilter === "sort" && (
                                    <select
                                        value={tempFilters.sortBy}
                                        onChange={(e) =>
                                            setTempFilters((p) => ({
                                                ...p,
                                                sortBy: e.target.value,
                                            }))
                                        }
                                        className="w-full border p-2 rounded mt-2"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex border-t">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-1/2 py-3 text-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedCategory(tempFilters.category);
                                    setSelectedSubcategory(tempFilters.subcategory);
                                    setPriceRange(tempFilters.price);
                                    setSortBy(tempFilters.sortBy);
                                    setSelectedTag(tempFilters.tag);
                                    setSelectedAlphabet(tempFilters.alphabet);
                                    setShowFilters(false);
                                }}
                                className="w-1/2 py-3 bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}



            </div>
        </div>
    );
};

export default Categories;
