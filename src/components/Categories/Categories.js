"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    fetchProducts,
} from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { useDispatch, useSelector } from "react-redux";

const products = [
    { id: 1, name: "Red T-shirt", price: 25, category: "Clothing", color: "Red", image: "/products/product1.webp" },
    { id: 2, name: "Blue Jeans", price: 40, category: "Clothing", color: "Blue", image: "/products/product1.webp" },
    { id: 3, name: "Black Cap", price: 15, category: "Accessories", color: "Black", image: "/products/product1.webp" },
    { id: 4, name: "Sneakers", price: 60, category: "Footwear", color: "White", image: "/products/product1.webp" },
    { id: 5, name: "Jacket", price: 80, category: "Clothing", color: "Black", image: "/products/product1.webp" },
];

const categories = ["All", "Clothing", "Accessories", "Footwear"];
const colors = ["Red", "Blue", "Black", "White"];
const sortOptions = ["Price: Low to High", "Price: High to Low"];

const colorMap = {
    Red: "#f87171",
    Blue: "#60a5fa",
    Black: "#374151",
    White: "#f9fafb",
};

const Categories = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");
    const [priceRange, setPriceRange] = useState(100);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Filter products
    let filteredProducts = products.filter((p) => {
        const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
        const colorMatch = selectedColor === "All" || p.color === selectedColor;
        const priceMatch = p.price <= priceRange;
        return categoryMatch && colorMatch && priceMatch;
    });

    // Sort products
    if (sortBy === "Price: Low to High") filteredProducts.sort((a, b) => a.price - b.price);
    else filteredProducts.sort((a, b) => b.price - a.price);

    return (
        <>
            <div className=" md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
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

                <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"} `}>
                    {/* Sidebar */}
                    {(isDesktop || showFilters) && (
                        <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
                            <h2 className="text-xl font-bold">Filters</h2>

                            {/* Category */}
                            <div>
                                <h3 className="font-semibold mb-2">Category</h3>
                                <ul className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <li
                                            key={cat.id || cat.slug}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === cat ? "bg-blue-200 font-semibold" : ""
                                                }`}
                                        >
                                            {cat.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Color */}
                            <div>
                                <h3 className="font-semibold mb-2">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    <div
                                        onClick={() => setSelectedColor("All")}
                                        className={`w-6 h-6 rounded-full border cursor-pointer ${selectedColor === "All" ? "ring-2 ring-blue-500" : "border-gray-300"
                                            }`}
                                        title="All"
                                    ></div>
                                    {colors.map((c) => (
                                        <div
                                            key={c}
                                            onClick={() => setSelectedColor(c)}
                                            className={`w-6 h-6 rounded-full border cursor-pointer`}
                                            style={{
                                                backgroundColor: colorMap[c],
                                                border: selectedColor === c ? "2px solid #3b82f6" : "1px solid #d1d5db",
                                            }}
                                            title={c}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
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

                    {/* Products */}
                    <div className="w-full md:w-3/4">

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    onClick={() => router.push(`/product/${product.id}`)}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden ">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    </div>

                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">${product.price}</p>
                                    <p className="text-sm text-gray-400">{product.category}</p>
                                    <p className="text-sm text-gray-400">Color: {product.color}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Categories;
