"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./Login";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logoutUser } from "@/app/redux/slices/meProfile/meSlice";
import {
    fetchHeaders,
} from "@/app/redux/slices/addHeader/addHeaderSlice";
import {
    fetchCategories,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import {
    fetchSubcategories,
} from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCart, updateLocalCartItem, updateCart, deleteCartItem } from "@/app/redux/slices/addToCart/addToCartSlice";
import SearchPage from "./SearchPage";
import ProductOffers from "../Product/ProductOffers/ProductOffers";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";


const Header = () => {
    const pathname = usePathname();
    const [active, setActive] = useState("Home");
    const [expanded, setExpanded] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [openItem, setOpenItem] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { headers } = useSelector((state) => state.headers);
    const { categories, loading, error } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { items, refreshFlag } = useSelector((state) => state.cart);
    console.log("user", user)
    const userCart = items?.filter((item) => item.userId === (user?.id)) || [];
    console.log("userCart", userCart)
    // const userCartCount = userCart.length;
    console.log("categories", categories)
    console.log("subcategories", subcategories)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { products } = useSelector((state) => state.products);
    const [userCartState, setUserCartState] = useState([]);
    useEffect(() => {
        setUserCartState(prev => {
            // Only update if different length or different ids
            const prevIds = prev.map(i => i.id).join(',');
            const newIds = userCart.map(i => i.id).join(',');
            if (prevIds !== newIds) {
                return userCart;
            }
            return prev;
        });
    }, [userCart]);


    const userCartCount = userCartState.length;
    console.log("userCartCount", userCartCount);
    useEffect(() => {
        dispatch(fetchCart())
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
        dispatch(fetchProducts());
    }, [dispatch]);


    // useEffect(() => {
    //     dispatch(fetchCart());
    // }, [dispatch, refreshFlag]);

    useEffect(() => {
        dispatch(fetchHeaders());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    console.log("user", user)

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    //const menuItems = ["Home", "Candles", "About", "Contact", "Oil"];
    // const menuItems = ["Home", "Categories", "About", "Contact"];
    const menuItems = headers
        .filter(h => h.active === true)
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(h => h.name);
    const isXpress = pathname.includes("/hecate-quickGo");
    const filteredCategories = categories.filter(cat =>
        isXpress
            ? cat.platform?.includes("xpress")
            : cat.platform?.includes("website")
    );
    const categoriesMap = {};

    filteredCategories.forEach(cat => {
        categoriesMap[cat.id] = {
            id: cat.id,
            name: cat.name,
            img: cat.image,
            sub: [],
        };
    });

    // subcategories
    //     .filter(sub => sub.active)
    //     .forEach(sub => {
    //         const catId = sub.categoryId || sub.category.id;
    //         if (categoriesMap[catId]) {
    //             categoriesMap[catId].sub.push(sub.name);
    //         }
    //     });
    subcategories
        .filter(sub => sub.active)
        .filter(sub =>
            isXpress
                ? sub.platform?.includes("xpress")
                : sub.platform?.includes("website")
        )
        .forEach(sub => {
            const catId = sub.categoryId || sub.category.id;
            if (categoriesMap[catId]) {
                categoriesMap[catId].sub.push(sub.name);
            }
        });


    const mappedCategories = Object.values(categoriesMap);
    console.log("mappedCategories", mappedCategories);

    // const categoriesMap = filteredCategories.map(cat => ({
    //     id: cat.id,
    //     name: cat.name,
    //     img: cat.image,
    //     sub: cat.subcategories?.map(s => s.name) || [],
    // }));
    // Step 1: Map all categories first
    // const categoriesMap = {};
    // categories
    //     .filter(cat => cat.active)
    //     .forEach(cat => {
    //         categoriesMap[cat.id] = {
    //             name: cat.name,
    //             sub: [],
    //             img: cat.image || "/default-image.jpg",
    //         };
    //     });
    // console.log("categoriesMap", categoriesMap)
    // // Step 2: Fill subcategories
    // subcategories
    //     .filter(sub => sub.active)
    //     .forEach(sub => {
    //         const catId = sub.category.id;
    //         if (categoriesMap[catId]) {
    //             categoriesMap[catId].sub.push(sub.name);
    //         }
    //     });

    // // Step 3: Convert to array
    // const mappedCategories = Object.values(categoriesMap);
    // console.log("mappedCategories", mappedCategories)



    // const categories = [
    //     {
    //         name: "Electronics",
    //         sub: ["Mobiles", "Laptops", "Cameras", "Headphones"],
    //         img: "/image/banner1.jpg",
    //     },
    //     {
    //         name: "Fashion",
    //         sub: ["Men", "Women", "Kids", "Accessories"],
    //         img: "/image/banner7.jpg",
    //     },
    //     {
    //         name: "Home & Furniture",
    //         sub: ["Sofas", "Beds", "Dining", "Lighting"],
    //         img: "/image/banner8.jpg",
    //     },
    //     {
    //         name: "Sports",
    //         sub: ["Cricket", "Football", "Tennis", "Gym"],
    //         img: "/image/banner6.jpg",
    //     },
    //     {
    //         name: "Books",
    //         sub: ["Fiction", "Non-fiction", "Comics", "Study"],
    //         img: "/image/banner1.jpg",
    //     },
    //     {
    //         name: "Beauty",
    //         sub: ["Makeup", "Skincare", "Haircare", "Perfume"],
    //         img: "/image/banner8.jpg",
    //     },
    // ];
    // const dropdownItems = {
    //     Categories:
    //         [{ name: "Tech", subItems: [{ name: "AI" }, { name: "Blockchain" }], },
    //         { name: "Fashion", subItems: [{ name: "Men" }, { name: "Women" }], }, { name: "Sports" }, { name: "Music" },],
    // };
    const [activeCat, setActiveCat] = useState(categories[0])


    const handleMenuClick = (item) => {
        const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
        router.push(href);
        setActive(item);
        setMobileMenuOpen(false);
    };
    useEffect(() => {
        setOpenItem(null);
    }, [pathname]);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    const handleLogout = () => {
        dispatch(logoutUser());
        setDropdownOpen(false);
    };

    // const updateQuantity = (index, delta) => {
    //     const item = userCart[index];
    //     const newQuantity = Math.max(1, item.quantity + delta);
    //     dispatch(updateLocalCartItem({ id: item.id, newQuantity }));
    //     dispatch(updateCart({ id: item.id, quantity: newQuantity }));
    // };


    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("baseUrl", baseUrl)

    // const handleDelete = async () => {
    //     try {
    //         console.log("selectedItemId", selectedItemId);

    //         // agar selectedItemId ek object hai (multiple ke case me)
    //         let id;

    //         if (typeof selectedItemId === "object" && selectedItemId?.itemIds?.length) {
    //             id = selectedItemId.itemIds; // multiple delete
    //         } else if (typeof selectedItemId === "string") {
    //             id = selectedItemId; // single delete
    //         }

    //         if (!id || (Array.isArray(id) && id.length === 0)) {
    //             toast.error("No items selected to delete");
    //             return;
    //         }

    //         const result = await dispatch(deleteCartItem({ id })).unwrap();
    //         console.log("result", result);

    //         toast.success(result.message || "Item(s) deleted successfully");
    //         dispatch(fetchCart());
    //         setIsConfirmOpen(false);
    //     } catch (err) {
    //         toast.error(err.message || "Failed to delete item(s)");
    //     }
    // };




    // Function to update color quantity
    // const updateColorQuantity = (productId, color, delta) => {
    //     console.log("Updating:", { productId, color, delta });
    //     setUserCartState(prevCart => {
    //         return prevCart.map(item => {
    //             if (item.productId === productId && item.attributes?.color === color) {
    //                 const newQty = Math.max(0, item.quantity + delta);
    //                 return { ...item, quantity: newQty };
    //             }
    //             return item;
    //         }).filter(item => item.quantity > 0); // remove if 0
    //     });
    // };
    // Group cart ignoring color for card
    // const groupedCart = useMemo(() => {
    //     return userCartState.reduce((acc, item) => {
    //         console.log("itemkey", item)
    //         const key = item.productId + '-' + Object.entries(item.attributes || {})
    //             .filter(([k]) => k !== 'color')
    //             .map(([k, v]) => `${k}:${v}`).join('|');

    //         if (!acc[key]) {
    //             acc[key] = {
    //                 productId: item.productId,
    //                 productName: item.productName,
    //                 variationId: item.variationId || null,
    //                 attributes: { ...item.attributes, color: null },
    //                 currency: item.currency,
    //                 itemIds: [item.id], // ✅ store original item id
    //                 colors: [{ color: item.attributes?.color, quantity: item.quantity, pricePerItem: item.pricePerItem, image: item.image, itemId: item.id }]
    //             };
    //         } else {
    //             acc[key].itemIds.push(item.id);
    //             const colorIndex = acc[key].colors.findIndex(c => c.color === item.attributes?.color);
    //             if (colorIndex >= 0) {
    //                 acc[key].colors[colorIndex].quantity += item.quantity;
    //             } else {
    //                 acc[key].colors.push({ color: item.attributes?.color, quantity: item.quantity, pricePerItem: item.pricePerItem, image: item.image, itemId: item.id });
    //             }
    //         }
    //         return acc;
    //     }, {});
    // }, [userCartState]);
    // const updateQuantity = (itemId, delta) => {
    //     setUserCartState((prev) => {
    //         return prev.map((item) => {
    //             if (item.id === itemId) {
    //                 const newQuantity = Math.max(1, item.quantity + delta);
    //                 console.log("newQuantity", newQuantity)
    //                 return {
    //                     ...item,
    //                     quantity: newQuantity,
    //                     totalPrice: item.pricePerItem * newQuantity,
    //                 };
    //             }
    //             return item;
    //         });
    //     });

    //     // ✅ Redux ko bhi update karo (sync backend)
    //     const item = userCartState.find((i) => i.id === itemId);
    //     if (!item) return;

    //     const newQuantity = Math.max(1, item.quantity + delta);
    //     console.log("newQuantity", newQuantity)
    //     dispatch(updateLocalCartItem({ id: item.id, newQuantity }));
    //     dispatch(updateCart({ id: item.id, quantity: newQuantity }));
    // };


    // 🧮 Update quantity in cart

    // 🧩 Update all items in the same bulk group
    // const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty, cartItem, fullProduct) => {
    //     const { sameGroupItems } = bulkStatus;

    //     await Promise.all(
    //         sameGroupItems.map(async (item) => {
    //             // 🔍 Find variation safely (fallbacks included)
    //             let itemVariation =
    //                 fullProduct?.variations?.find((v) => v.id === item.variationId) ||
    //                 fullProduct?.variations?.find(
    //                     (v) =>
    //                         v.color?.toLowerCase() === item.attributes?.color?.toLowerCase() &&
    //                         v.size?.toLowerCase() === item.attributes?.size?.toLowerCase()
    //                 );

    //             const basePrice = Number(item.pricePerItem);
    //             const itemBulkPrice = Number(itemVariation?.bulkPrice || 0);
    //             const itemBulkMinQty = Number(itemVariation?.bulkMinQty || fullProduct?.minQuantity || 0);
    //             const currentQty = item.id === cartItem.id ? newQty : item.quantity;

    //             console.log("🧾 Variation Check:", {
    //                 color: item.attributes?.color,
    //                 size: item.attributes?.size,
    //                 itemBulkPrice,
    //                 itemBulkMinQty,
    //                 totalGroupQty: bulkStatus.totalGroupQty,
    //             });

    //             // ✅ Variation-based eligibility
    //             const isItemEligible =
    //                 itemBulkPrice > 0 &&
    //                 itemBulkMinQty > 0 &&
    //                 bulkStatus.totalGroupQty >= itemBulkMinQty;

    //             const payload = {
    //                 id: item.id,
    //                 quantity: currentQty,
    //                 offerApplied: isItemEligible,
    //                 bulkPrice: isItemEligible ? itemBulkPrice : null,
    //                 bulkMinQty: isItemEligible ? itemBulkMinQty : null,
    //                 totalPrice: (isItemEligible ? itemBulkPrice : basePrice) * currentQty,
    //             };

    //             console.log("🔄 Updating cart item:", payload);

    //             await dispatch(updateCart(payload));
    //         })
    //     );

    //     console.log("✅ Bulk group updated in DB:", {
    //         sameGroupItems: sameGroupItems.map((i) => ({
    //             color: i.attributes?.color,
    //             qty: i.quantity,
    //         })),
    //     });

    //     await dispatch(fetchCart());
    // };

    const handleDelete = async () => {
        try {
            console.log("selectedItemId", selectedItemId);

            let id;

            if (typeof selectedItemId === "object" && selectedItemId?.itemIds?.length) {
                id = selectedItemId.itemIds; // multiple delete
            } else if (typeof selectedItemId === "string") {
                id = selectedItemId; // single delete
            }

            if (!id || (Array.isArray(id) && id.length === 0)) {
                toast.error("No items selected to delete");
                return;
            }

            const result = await dispatch(deleteCartItem({ id })).unwrap();
            console.log("result", result);

            toast.success(result.message || "Item(s) deleted successfully");
            await dispatch(fetchCart());

            // 🔄 Re-evaluate all offers after delete
            const freshCart = await dispatch(fetchCart()).unwrap();

            for (const item of freshCart) {
                const fullProduct = products.find((p) => p.id === item.productId);
                if (!fullProduct) continue;

                const selectedVariation =
                    fullProduct.variations?.find((v) => v.id === item.variationId);

                // Recalculate bulk and offers
                const newBulkStatus = computeBulkStatus({
                    product: fullProduct,
                    selectedVariation,
                    selectedAttributes: item.attributes,
                    userCart: freshCart,
                    quantity: item.quantity,
                    cartItem: item,
                });

                const isBulkEligible = newBulkStatus.eligible;
                await updateGroupBulkStatus(newBulkStatus, isBulkEligible, item.quantity, item, fullProduct);
            }

            setIsConfirmOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete item(s)");
        }
    };


    const updateQuantity = async (itemId, delta) => {
        const targetItem = userCartState.find((i) => i.id === itemId);
        if (!targetItem) return;

        const newQuantity = Math.max(1, targetItem.quantity + delta);

        // ✅ Find the full product data (for price, variation, bulk info)
        const fullProduct = products.find((p) => p.id === targetItem.productId);
        if (!fullProduct) return;

        // ✅ Find correct variation (color/size-based)
        const selectedVariation =
            fullProduct.variations?.find((v) => v.id === targetItem.variationId) ||
            findColorVariation(
                fullProduct,
                {
                    color: targetItem.attributes?.color,
                    size: targetItem.attributes?.size,
                },
                targetItem
            );

        // ✅ Compute fresh bulk status
        const newBulkStatus = computeBulkStatus({
            product: fullProduct,
            selectedVariation,
            selectedAttributes: targetItem.attributes,
            userCart: userCartState,
            quantity: newQuantity,
            cartItem: targetItem,
        });

        const isBulkEligible = newBulkStatus.eligible;

        // ✅ Update all same-group items with their own bulk rules
        await updateGroupBulkStatus(newBulkStatus, isBulkEligible, newQuantity, targetItem, fullProduct);

        // ✅ Optional UI update
        setUserCartState((prev) =>
            prev.map((i) =>
                i.id === itemId ? { ...i, quantity: newQuantity } : i
            )
        );

        console.log("🧮 Cart bulk offer sync:", {
            itemId,
            newQuantity,
            isBulkEligible,
            groupQty: newBulkStatus.totalGroupQty,
        });
    };

    const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty, cartItem, fullProduct) => {
        const { sameGroupItems } = bulkStatus;

        // 🧮 Total group quantity (ignoring color)
        const totalGroupQty = sameGroupItems.reduce((sum, item) => {
            const qty = item.id === cartItem.id ? newQty : item.quantity;
            return sum + qty;
        }, 0);

        console.log("🧮 Group Total:", totalGroupQty);

        // 🧠 1️⃣ Apply product offer once for the whole group
        const sampleVariation =
            fullProduct?.variations?.find((v) => v.id === cartItem.variationId) ||
            fullProduct?.variations?.find(
                (v) =>
                    v.color?.toLowerCase() === cartItem.attributes?.color?.toLowerCase() &&
                    v.size?.toLowerCase() === cartItem.attributes?.size?.toLowerCase()
            );

        const { offerApplied, offerMeta, offerId } = applyProductOffers(
            fullProduct,
            sampleVariation,
            newQty,
            sameGroupItems,
            cartItem.id
        );

        // 🧩 Share the same offerMeta with all sameGroupItems
        const groupOffer = offerApplied ? offerMeta : null;
        const groupOfferId = offerApplied ? offerId : null;

        await Promise.all(
            sameGroupItems.map(async (item) => {
                const itemVariation =
                    fullProduct?.variations?.find((v) => v.id === item.variationId) ||
                    fullProduct?.variations?.find(
                        (v) =>
                            v.color?.toLowerCase() === item.attributes?.color?.toLowerCase() &&
                            v.size?.toLowerCase() === item.attributes?.size?.toLowerCase()
                    );

                const basePrice = Number(item.pricePerItem);
                const itemBulkPrice = Number(itemVariation?.bulkPrice || 0);
                const itemBulkMinQty = Number(itemVariation?.bulkMinQty || fullProduct?.minQuantity || 0);
                const currentQty = item.id === cartItem.id ? newQty : item.quantity;

                const isItemBulkEligible =
                    itemBulkPrice > 0 &&
                    itemBulkMinQty > 0 &&
                    bulkStatus.totalGroupQty >= itemBulkMinQty;

                let finalTotal = basePrice * currentQty;
                let offerAppliedFlag = false;
                let productOfferApplied = false;
                let productOffer = null;

                // ✅ Use the same shared group offer
                if (groupOffer && groupOffer.discountType === "rangeBuyXGetY") {
                    const { start, end, free } = groupOffer.discountValue;

                    if (totalGroupQty >= start && totalGroupQty <= end) {
                        productOfferApplied = true;
                        productOffer = offerMeta;

                        // Sort group items by price (ascending)
                        const sortedByPrice = [...sameGroupItems].sort((a, b) => a.pricePerItem - b.pricePerItem);
                        const freeItems = sortedByPrice.slice(0, free);

                        const isFree = freeItems.some((f) => f.id === item.id);
                        finalTotal = isFree ? 0 : basePrice * currentQty;

                        console.log("🎁 Range Offer Applied (shared):", {
                            itemId: item.id,
                            isFree,
                            freeItems: freeItems.map((f) => f.attributes?.color),
                            totalGroupQty,
                        });
                    }
                } else if (isItemBulkEligible) {
                    offerAppliedFlag = true;
                    finalTotal = itemBulkPrice * currentQty;
                }

                const payload = {
                    id: item.id,
                    quantity: currentQty,
                    offerApplied: offerAppliedFlag,
                    bulkPrice: isItemBulkEligible ? itemBulkPrice : null,
                    bulkMinQty: isItemBulkEligible ? itemBulkMinQty : null,
                    totalPrice: finalTotal,
                    productOfferApplied,
                    productOffer,
                    productOfferId: productOfferApplied ? groupOfferId : null,
                };

                await dispatch(updateCart(payload));
            })
        );

        console.log("✅ Cart updated with unified shared offer logic");
        await dispatch(fetchCart());
    };

    const buildFreePaidItems = (product, freeQty, sameCoreVariation, cart) => {
        let items = cart
            .filter(it => {
                if (it.productId !== product.id) return false;
                return sameCoreVariation(it); // color ignore + core attribute match
            })
            .map(it => ({
                id: it.id,
                variationId: it.variationId,
                attributes: it.attributes,
                quantity: it.quantity,
                price: Number(it.pricePerItem || it.price),
                addedAt: it.addedAt || 0
            }));


        const freeItems = [];
        const paidItems = [];

        while (freeQty > 0 && items.length > 0) {
            let minPrice = Math.min(...items.map(i => i.price));
            let lowestItems = items.filter(i => i.price === minPrice);
            let selected = lowestItems.reduce((a, b) =>
                a.addedAt > b.addedAt ? a : b
            );

            let freeTake = Math.min(selected.quantity, freeQty);

            freeItems.push({
                ...selected,
                freeQty: freeTake
            });

            selected.quantity -= freeTake;
            freeQty -= freeTake;

            if (selected.quantity === 0) {
                items = items.filter(i => i.id !== selected.id);
            }
        }

        for (const item of items) {
            paidItems.push({
                ...item,
                paidQty: item.quantity
            });
        }

        return { freeItems, paidItems };
    };

    const applyProductOffers = (product, selectedVariation, quantity, userCart = [], cartItemId = null) => {
        let offerApplied = false;
        let offerDiscount = 0;
        let offerMeta = null;
        let offerId = null;

        const productOffers = (product.offers || []).filter(o => o.active);
        if (!productOffers.length) return { offerApplied, offerDiscount, offerId, offerMeta };

        // 🔹 Normalize attributes ignoring color/colour
        const getCoreAttrs = (attrs = {}) => {
            const core = {};
            for (const [k, v] of Object.entries(attrs)) {
                if (!["color", "colour"].includes(k.toLowerCase())) {
                    core[k.toLowerCase().trim()] = String(v).toLowerCase().trim();
                }
            }
            return core;
        };

        const selectedCore = getCoreAttrs(selectedVariation?.attributes);

        const sameCoreVariation = (item) => {
            const itemCore = getCoreAttrs(item.attributes);
            return Object.entries(selectedCore).every(([k, v]) => itemCore[k] && itemCore[k] === v);
        };

        // 🔹 Compute total group quantity including updated item if cartItemId provided
        const totalGroupQty = userCart.reduce((sum, item) => {
            if (item.productId !== product.id) return sum;
            if (!sameCoreVariation(item)) return sum;

            // ✅ Replace qty for the item being updated
            if (cartItemId && item.id === cartItemId) return sum + quantity;
            return sum + item.quantity;
        }, 0);

        // 🔹 For new add-to-cart item, include quantity
        const finalGroupQty = cartItemId ? totalGroupQty : totalGroupQty + quantity;
        const price = Number(selectedVariation.pricePerItem || selectedVariation.price || 0);

        const updatedCartForFreeCalc = userCart.map(it => ({
            ...it,
            attributes: { ...(it.attributes || {}) }
        }));

        // 👉 If this is a new add-to-cart operation (not update)
        if (!cartItemId) {
            updatedCartForFreeCalc.push({
                id: "__temp__",
                productId: product.id,
                variationId: selectedVariation.id,
                attributes: selectedVariation.attributes,
                quantity,
                pricePerItem: selectedVariation.pricePerItem || selectedVariation.price,
                addedAt: Date.now()
            });
        }

        // 👉 If update case:
        if (cartItemId) {
            updatedCartForFreeCalc.forEach((it) => {
                if (it.id === cartItemId) {
                    it.quantity = quantity;   // now SAFE
                }
            });
        }

        for (const offer of productOffers) {

            // 🔥 Offer Check Starts

            // 1️⃣ Percentage
            if (offer.discountType === "percentage") {
                offerApplied = true;
                offerDiscount = Number(offer.discountValue.percent);
                offerId = offer.id;

                const totalBefore = finalGroupQty * price;
                const savings = (totalBefore * offerDiscount) / 100;
                const totalAfter = totalBefore - savings;

                offerMeta = {
                    id: offer.id,
                    name: "Percentage",
                    discountType: offer.discountType,
                    discountValue: offer.discountValue,
                    appliedQty: finalGroupQty,
                    totalPriceBeforeOffer: totalBefore,
                    totalPriceAfterOffer: totalAfter,
                    totalSavings: savings,
                    freeQuantityValue: 0,
                    freeItems: [],
                    paidItems: []
                };
                break;
            }

            // 2️⃣ Range Buy X Get Y
            if (offer.discountType === "rangeBuyXGetY") {
                const { start, end, free } = offer.discountValue;
                if (finalGroupQty >= start && finalGroupQty <= end) {
                    offerApplied = true;
                    offerDiscount = 0;
                    offerId = offer.id;

                    const { freeItems, paidItems } =
                        buildFreePaidItems(product, free, sameCoreVariation, updatedCartForFreeCalc);



                    const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

                    const totalBefore = updatedCartForFreeCalc
                        .filter(it => sameCoreVariation(it))
                        .reduce(
                            (sum, it) => sum + it.quantity * Number(it.pricePerItem || it.price),
                            0
                        );

                    const totalAfter = totalBefore - freeValue;

                    offerMeta = {
                        id: offer.id,
                        name: "Range",
                        discountType: offer.discountType,
                        discountValue: { start, end, free },
                        appliedQty: finalGroupQty,
                        freeQty: free,
                        freeItems,
                        paidItems,
                        // totalPriceBeforeOffer: finalGroupQty * price,
                        // totalPriceAfterOffer: finalGroupQty * price - freeValue,
                        // totalSavings: freeValue,
                        // freeQuantityValue: freeValue
                        totalPriceBeforeOffer: totalBefore,
                        totalPriceAfterOffer: totalAfter,
                        totalSavings: freeValue,
                        freeQuantityValue: freeValue,
                    };
                    break;
                }
            }

            // 3️⃣ Buy X Get Y
            if (offer.discountType === "buyXGetY") {
                const { buy, get } = offer.discountValue;
                if (finalGroupQty >= buy) {
                    offerApplied = true;
                    offerDiscount = 0;
                    offerId = offer.id;

                    const { freeItems, paidItems } =
                        buildFreePaidItems(product, free, sameCoreVariation, updatedCartForFreeCalc);


                    const freeValue = freeItems.reduce((sum, fi) => sum + fi.freeQty * fi.price, 0);

                    offerMeta = {
                        id: offer.id,
                        name: "BuyXGetY",
                        discountType: offer.discountType,
                        discountValue: { buy, get },
                        appliedQty: finalGroupQty,
                        freeQty: get,
                        freeItems,
                        paidItems,
                        totalPriceBeforeOffer: finalGroupQty * price,
                        totalPriceAfterOffer: finalGroupQty * price - freeValue,
                        totalSavings: freeValue,
                        freeQuantityValue: freeValue
                    };
                    break;
                }
            }
        }
        // for (const offer of productOffers) {
        //     if (offer.discountType === "percentage") {
        //         offerApplied = true;
        //         offerDiscount = Number(offer.discountValue.percent);
        //         offerId = offer.id;
        //         offerMeta = null;
        //         break;
        //     } else if (offer.discountType === "rangeBuyXGetY") {
        //         const { start, end, free } = offer.discountValue;
        //         if (finalGroupQty >= start && finalGroupQty <= end) {
        //             offerApplied = true;
        //             offerDiscount = 0;
        //             offerId = offer.id;
        //             const paidQty = finalGroupQty - free;
        //             offerMeta = {
        //                 id: offer.id,
        //                 name: "Range",
        //                 discountType: offer.discountType,
        //                 discountValue: { start, end, free },
        //                 appliedQty: finalGroupQty,
        //                 effectivePaidQty: paidQty,
        //                 freeQty: free,
        //                 offerValue: `${free} Free on ${start}–${end} range`,
        //             };
        //             break;
        //         }
        //     } else if (offer.discountType === "buyXGetY") {
        //         const { buy, get } = offer.discountValue;
        //         if (finalGroupQty >= buy) {
        //             offerApplied = true;
        //             offerDiscount = 0;
        //             offerId = offer.id;
        //             const paidQty = finalGroupQty - get;
        //             offerMeta = {
        //                 id: offer.id,
        //                 name: "BuyXGetY",
        //                 discountType: offer.discountType,
        //                 discountValue: { buy, get },
        //                 appliedQty: finalGroupQty,
        //                 effectivePaidQty: paidQty,
        //                 freeQty: get,
        //                 offerValue: `${get} Free on buying ${buy}`,
        //             };
        //             break;
        //         }
        //     }
        // }

        return { offerApplied, offerDiscount, offerId, offerMeta };
    };

    // 🧠 Compute bulk offer eligibility (shared across variations)
    const computeBulkStatus = ({
        product,
        selectedVariation,
        selectedAttributes,
        userCart,
        quantity,
        cartItem,
    }) => {
        const productMinQty = Number(product?.minQuantity || 0);
        const variationBulkPrice = Number(selectedVariation?.bulkPrice ?? 0);
        const variationBulkMinQty =
            Number(selectedVariation?.bulkMinQty ?? productMinQty) || 0;

        // 🎯 Flatten attributes except color
        const flatAttributes = {};
        Object.entries(selectedAttributes || {}).forEach(([k, v]) => {
            if (v && v !== "N/A") flatAttributes[k.toLowerCase()] = v;
        });

        const coreAttributes = Object.entries(flatAttributes).filter(
            ([key]) => !["color", "colour"].includes(key.toLowerCase())
        );
        const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

        // 🧩 Find same group items
        const sameGroupItems = (Array.isArray(userCart) ? userCart : []).filter((item) => {
            if (!item) return false;
            if (item.productId !== product.id) return false;
            const itemCoreKey = Object.entries(item.attributes || {})
                .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
                .map(([k, v]) => `${k}:${v}`)
                .join("|");
            return itemCoreKey === coreKey;
        });

        // 🧮 Replace current item's qty with new one
        const totalGroupQty = sameGroupItems.reduce((sum, item) => {
            if (item.id === cartItem?.id) {
                return sum + Number(quantity || 0);
            }
            return sum + (Number(item.quantity) || 0);
        }, 0);

        // ✅ Eligibility only depends on total group qty meeting the *lowest* bulk min qty
        const allMinQtys = sameGroupItems.map((it) => {
            const varData = product.variations?.find((v) => v.id === it.variationId);
            return Number(varData?.bulkMinQty || 0);
        });
        const minRequiredQty = Math.min(...allMinQtys.filter((x) => x > 0), variationBulkMinQty);

        const eligible = totalGroupQty >= minRequiredQty;

        console.log("💡 Bulk Check:", {
            totalGroupQty,
            minRequiredQty,
            eligible,
        });

        return {
            eligible,
            totalGroupQty,
            sameGroupItems,
        };
    };





    // const groupedCart = useMemo(() => {
    //     const acc = {};

    //     userCartState.forEach(item => {
    //         const key = item.productId + '-' + Object.entries(item.attributes || {})
    //             .filter(([k]) => k !== 'color')
    //             .map(([k, v]) => `${k}:${v}`).join('|');

    //         // ✅ ensure new object creation always
    //         if (!acc[key]) {
    //             acc[key] = {
    //                 productId: item.productId,
    //                 productName: item.productName,
    //                 variationId: item.variationId || null,
    //                 attributes: { ...item.attributes, color: null },
    //                 currency: item.currency,
    //                 itemIds: [item.id],
    //                 colors: [],
    //             };
    //         } else {
    //             // acc[key] = { ...acc[key], itemIds: [...acc[key].itemIds] }; // new reference
    //             acc[key] = { ...acc[key], itemIds: [...acc[key].itemIds, item.id] };
    //         }

    //         // ✅ now safely handle color
    //         const matchColor = (item.attributes?.color || "").toLowerCase().trim();
    //         const existing = acc[key].colors.find(
    //             c => (c.color || "").toLowerCase().trim() === matchColor
    //         );

    //         if (existing) {
    //             // replace with a new object (not mutate)
    //             acc[key].colors = acc[key].colors.map(c =>
    //                 (c.color || "").toLowerCase().trim() === matchColor
    //                     ? {
    //                         ...c,
    //                         quantity: item.quantity,
    //                         pricePerItem: item.pricePerItem,
    //                         image: item.image,
    //                         itemId: item.id
    //                     }
    //                     : c
    //             );
    //         } else {
    //             // push new color as new array reference
    //             acc[key].colors = [
    //                 ...acc[key].colors,
    //                 {
    //                     color: item.attributes?.color,
    //                     quantity: item.quantity,
    //                     pricePerItem: item.pricePerItem,
    //                     image: item.image,
    //                     itemId: item.id,
    //                     bulkPrice: item.bulkPrice,
    //                     bulkMinQty: item.bulkMinQty,
    //                     offerApplied: item.offerApplied,
    //                     totalPrice: item.totalPrice,
    //                 },
    //             ];
    //         }
    //     });

    //     return JSON.parse(JSON.stringify(acc));
    // }, [JSON.stringify(userCartState)]);


    const groupedCart = useMemo(() => {
        const acc = {};

        userCart.forEach(item => {
            // build key based on non-color attributes
            const key = item.productId + '-' + Object.entries(item.attributes || {})
                .filter(([k]) => k !== 'color')
                .map(([k, v]) => `${k}:${v}`).join('|');

            if (!acc[key]) {
                acc[key] = {
                    productId: item.productId,
                    productName: item.productName,
                    variationId: item.variationId || null,
                    attributes: { ...item.attributes, color: null },
                    currency: item.currency,
                    itemIds: [item.id],
                    colors: [],
                    productOfferApplied: Boolean(item.productOfferApplied),
                    productOffer: item.productOffer ?? null,
                };
            } else {
                acc[key] = { ...acc[key], itemIds: [...acc[key].itemIds, item.id] };
            }

            const matchColor = (item.attributes?.color || "").toString();
            const existing = acc[key].colors.find(
                c => (c.color || "").toLowerCase().trim() === matchColor.toLowerCase().trim()
            );

            // normalize numeric fields to Number (avoid string math)
            const normalized = {
                color: item.attributes?.color,
                quantity: Number(item.quantity || 0),
                pricePerItem: Number(item.pricePerItem || 0),
                image: item.image,
                itemId: item.id,
                variationId: item.variationId || null,
                // these may be null/undefined — keep as null or Number
                bulkPrice: item.bulkPrice == null ? null : Number(item.bulkPrice),
                bulkMinQty: item.bulkMinQty == null ? null : Number(item.bulkMinQty),
                offerApplied: Boolean(item.offerApplied),
                totalPrice: item.totalPrice == null ? Number(item.pricePerItem || 0) * Number(item.quantity || 0) : Number(item.totalPrice),

                productOfferApplied: Boolean(item.productOfferApplied),
                productOfferDiscount: item.productOfferDiscount ?? null,
                productOfferId: item.productOfferId ?? null,
                productOffer: item.productOffer ?? null,
            };
            console.log("range offer", item.productOfferApplied, item.productOffer);

            if (existing) {
                acc[key].colors = acc[key].colors.map(c =>
                    (c.color || "").toLowerCase().trim() === matchColor.toLowerCase().trim()
                        ? { ...c, ...normalized }
                        : c
                );
            } else {
                acc[key].colors = [...acc[key].colors, normalized];
            }
        });

        // return deep cloned plain object (safe for render)
        return JSON.parse(JSON.stringify(acc));
    }, [JSON.stringify(userCart)]);

    const findColorVariation = (fullProduct, c, item) => {
        if (!fullProduct?.variations?.length) return null;

        // ✅ Extract size properly — prioritize color-level first, then fallback
        const currentSize =
            (c.size && c.size.toLowerCase().trim()) ||
            (item.attributes?.size && item.attributes.size.toLowerCase().trim()) ||
            null;

        const currentColor =
            (c.color && c.color.toLowerCase().trim()) ||
            (item.attributes?.color && item.attributes.color.toLowerCase().trim()) ||
            null;

        if (!currentColor) return null; // must have color

        // ✅ exact color+size match from variation name
        const matched = fullProduct.variations.find((v) => {
            const name = v.variationName?.toLowerCase().trim() || "";
            const normalized = name.replace(/[\s/,-]+/g, " ").trim();

            const colorMatch = new RegExp(`\\b${currentColor}\\b`).test(normalized);
            const sizeMatch = currentSize
                ? new RegExp(`\\b${currentSize}\\b`).test(normalized)
                : true;

            return colorMatch && sizeMatch;
        });

        // ✅ Debug log to confirm
        console.log(
            `🧩 Matched for ${currentColor}/${currentSize || "no-size"} →`,
            matched?.variationName,
            matched?.bulkPrice
        );

        return matched;
    };

    const getTotalDisplay = (item, fullProduct) => {
        if (item.productOfferApplied && item.productOffer?.name === "Range") {
            const offer = item.productOffer;
            return {
                totalOriginal: offer.totalPriceBeforeOffer,
                totalAfterOffer: offer.totalPriceAfterOffer,
                savings: offer.totalSavings,
            };
        } else {
            const totalOriginal = item.colors.reduce((sum, c) => sum + Number(c.pricePerItem) * Number(c.quantity), 0);
            const totalVariationQty = item.colors.reduce((s, c) => s + Number(c.quantity), 0);
            const totalAfterBulk = item.colors.reduce((sum, c) => {
                const matchVar = findColorVariation(fullProduct, c, item);
                const bulkPrice = Number(
                    c.bulkPrice ??
                    matchVar?.bulkPrice ??
                    baseVariation?.bulkPrice ??
                    fullProduct?.bulkPrice ??
                    0
                );
                const minQty = Number(
                    c.bulkMinQty ??
                    matchVar?.minQuantity ??
                    baseVariation?.minQuantity ??
                    fullProduct?.minQuantity ??
                    0
                );
                const isBulk = bulkPrice > 0 && totalVariationQty >= minQty;
                const effectivePrice = isBulk ? bulkPrice : c.pricePerItem;
                return sum + effectivePrice * c.quantity;
            }, 0);
            return {
                totalOriginal,
                totalAfterOffer: totalAfterBulk,
                savings: totalOriginal - totalAfterBulk,
            };
        }
    };


    useEffect(() => {
        console.log("🟢 groupedCart changed:", JSON.parse(JSON.stringify(groupedCart)));
    }, [groupedCart]);


    return (
        <>
            {/* <header className="w-full bg-[#161619] shadow-md md:relative fixed md:static top-0 z-50"> */}
            <header className={`w-full shadow-md md:relative fixed md:static top-0 z-50 ${isXpress ? "bg-[#264757]" : "bg-[#161619]"}`}>
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        {/* <Link href="/">
                            <img
                                src="/image/HWM LOGO 1 GREY 100.png"
                                alt="Logo"
                                className="h-20 w-24 object-contain"
                            />
                        </Link> */}
                        <div className="flex items-center gap-2">
                            {isXpress ? (
                                <Link href="/hecate-quickGo/home">
                                    <img
                                        src="/image/quickgo logo.png"
                                        alt="Logo"
                                        className="h-24 w-24 object-contain"
                                    />
                                </Link>

                            ) : (
                                <Link href="/">
                                    <img
                                        src="/image/HWM LOGO 1 GREY 100.png"
                                        alt="Logo"
                                        className="h-24 w-24 object-contain"
                                    />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Navigation Menu (Desktop) */}
                    {/* <nav className="hidden md:flex flex-1 justify-center">
                    <ul className="flex items-center gap-6">
                        {menuItems.map((item) => (
                            <li key={item}>
                                <Link href="">
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${active === item
                                            ? "bg-white text-[#161619]"
                                            : "text-white hover:bg-gray-700"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav> */}

                    {/* <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-6">
                            {menuItems.map((item) => {
                                // Generate proper href for each item
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = pathname === href;

                                return (
                                    <li key={item}>
                                        <Link
                                            href={href}
                                            className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isActive
                                                ? "bg-white text-[#161619]"
                                                : "text-white hover:bg-gray-700"
                                                }`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav> */}


                    <nav className="hidden md:flex flex-1 justify-center relative">
                        <ul className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                {isXpress ? (
                                    <Link href="/">
                                        <img
                                            src="/image/HWM LOGO 1 GREY 100.png"
                                            alt="Logo"
                                            className="h-20 w-24 object-contain"
                                        />
                                    </Link>
                                ) : (
                                    <Link href="/hecate-quickGo/home">
                                        <img
                                            src="/image/quickgo logo.png"
                                            alt="Logo"
                                            className="h-20 w-24 object-contain"
                                        />
                                    </Link>
                                )}
                            </div>

                            {menuItems.map((item) => {
                                // const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const href =
                                    item === "Home"
                                        ? isXpress
                                            ? "/hecate-quickGo/home"
                                            : "/"
                                        : isXpress
                                            ? `/hecate-quickGo/${item.toLowerCase()}`
                                            : `/${item.toLowerCase()}`;

                                const isActive = pathname === href;

                                return (
                                    <li
                                        key={item}
                                        className="relative"
                                        onMouseEnter={() => setOpenItem(item)}
                                        onMouseLeave={() => setOpenItem(null)}
                                    >
                                        <Link
                                            href={href}
                                            className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isXpress
                                                ? isActive
                                                    ? "bg-black text-[#ffff]"
                                                    : "text-[#ffff] hover:bg-black"
                                                : isActive
                                                    ? "bg-white text-[#161619]"
                                                    : "text-white hover:bg-gray-700"
                                                }`}

                                        >
                                            {item}
                                        </Link>

                                        {/* Dropdown only for Categories */}
                                        {item === "Categories" && openItem === "Categories" && (
                                            <div className="absolute left-1/2 transform -translate-x-[48%]
 top-full mt-1 w-[1400px] bg-[#161619] text-white shadow-lg py-8 px-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-50">
                                                {mappedCategories.map((cat, index) => {
                                                    console.log("cat?.img", cat?.img)
                                                    const imgSrc = cat?.img
                                                        ? encodeURI(cat.img.startsWith("http") ? cat.img : cat.img)
                                                        : "/default-image.jpg";
                                                    console.log("imgSrc", imgSrc);

                                                    return (
                                                        <div
                                                            key={cat.id || `${cat.name}-${index}`}
                                                            className="flex items-start gap-6 border-b border-gray-700 pb-6 last:border-0"
                                                        >

                                                            <div className="flex-1">
                                                                <h3 className=" text-lg mb-3 font-functionPro">{cat.name}</h3>
                                                                <ul className="space-y-2">
                                                                    {cat.sub.map((sub) => (
                                                                        <li key={sub}>
                                                                            <Link
                                                                                href={`/categories?category=${encodeURIComponent(cat.name)}&&subcategory=${encodeURIComponent(sub)}`}
                                                                                className="text-gray-300 hover:text-white transition font-functionPro"
                                                                            >
                                                                                {sub}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>


                                                            <div className="w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
                                                                <Image
                                                                    src={imgSrc}
                                                                    alt={cat.name}
                                                                    fill
                                                                    className="object-cover hover:scale-125 transition-transform duration-500 ease-in-out"

                                                                    unoptimized
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-6">
                            {menuItems.map((item) => {
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = pathname === href;

                                // Check if item has dropdown
                                const hasDropdown = dropdownItems && dropdownItems[item]?.length > 0;

                                return (
                                    <li key={item} className={`relative ${hasDropdown ? "group" : ""}`}>
                                        {hasDropdown ? (
                                            <>
                                                <span
                                                    className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer inline-block ${isActive ? "bg-white text-[#161619]" : "text-white hover:bg-gray-700"
                                                        }`}
                                                >
                                                    {item}
                                                </span>

                                          
                                                <ul className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                                                    {dropdownItems[item].map((subItem) => (
                                                        <li key={subItem.name} className="px-4 py-2 hover:bg-gray-100 relative group">
                                                            <Link
                                                                href={`/${item.toLowerCase()}/${subItem.name.toLowerCase()}`}
                                                                className="block"
                                                            >
                                                                {subItem.name}
                                                            </Link>

                                                          
                                                            {/* {subItem.subItems && subItem.subItems.length > 0 && (
                                                                <ul className="absolute left-full top-0 mt-0 ml-0 w-40 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                                                                    {subItem.subItems.map((nested) => (
                                                                        <li key={nested.name} className="px-4 py-2 hover:bg-gray-100">
                                                                            <Link
                                                                                href={`/${item.toLowerCase()}/${subItem.name.toLowerCase()}/${nested.name.toLowerCase()}`}
                                                                                className="block"
                                                                            >
                                                                                {nested.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )} 
                                                        </li>
                                                    ))}
                                                </ul>

                                            </>
                                        ) : (
                                            <Link
                                                href={href}
                                                className={`font-functionPro px-4 py-2 rounded-lg font-medium transition cursor-pointer ${isActive ? "bg-white text-[#161619]" : "text-white hover:bg-gray-700"
                                                    }`}
                                            >
                                                {item}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav> */}

                    <div className=" sm:hidden flex items-end gap-2">
                        {isXpress ? (
                            <Link href="/">
                                <img
                                    src="/image/HWM LOGO 1 GREY 100.png"
                                    alt="Logo"
                                    className="h-16 w-16 object-contain"
                                />
                            </Link>
                        ) : (
                            <Link href="/hecate-quickGo/home">
                                <img
                                    src="/image/quickgo logo.png"
                                    alt="Logo"
                                    className="h-16 w-16 object-contain"
                                />
                            </Link>
                        )}
                    </div>

                    {/* Icons */}
                    <div className="font-functionPro flex items-center gap-4 md:gap-6">
                        <SearchPage />

                        <button onClick={() => setIsOpen(true)} className="relative cursor-pointer">
                            <ShoppingCart className="h-6 w-6 text-white" />
                            {userCartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {userCartCount}
                                </span>
                            )}
                        </button>




                        {isOpen && (
                            <div className="fixed inset-0 z-50 flex">
                                {/* Overlay */}
                                <div
                                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                ></div>

                                {/* Drawer */}
                                <div
                                    className="ml-auto w-130 h-full bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="self-end w-8 h-8 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white shadow-md transition-colors duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ✕
                                    </button>

                                    <h2 className="text-2xl font-bold text-center mt-4 mb-6">Your Cart</h2>

                                    {/* <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {userCartCount > 0 ? (
                                            Object.values(groupedCart).map((item, index) => {
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                const totalQuantity = item.colors.reduce((sum, c) => sum + c.quantity, 0);

                                                return (
                                                    <div key={index} className="relative flex flex-col gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50">

                                                      
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemId(item); // poora grouped item pass karo
                                                                setIsConfirmOpen(true);
                                                            }}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>

                                                 
                                                        <div className="flex items-center gap-3 cursor-pointer">
                                                            <Link href={`/product/${item.productId}`} onClick={() => setIsOpen(false)}>
                                                                <img src={item.colors[0].image || "/placeholder.png"} alt={item.productName} className="w-16 h-16 object-cover rounded-md border" />
                                                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.productName}</h3>
                                                            </Link>
                                                        </div>

                                                        {Object.entries(item.attributes).filter(([k]) => k !== 'color').map(([k, v]) => (
                                                            <p key={k} className="text-xs text-gray-500">{k}: {v}</p>
                                                        ))}

                                                    
                                                        {item.colors.map((c, idx) => (
                                                            <div key={idx} className="flex items-center justify-between gap-2 mt-1">
                                                                <span className="text-xs text-gray-500">{c.color}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <button onClick={() => updateColorQuantity(item.productId, c.color, -1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
                                                                    <span className="px-2 text-sm">{c.quantity}</span>
                                                                    <button onClick={() => updateColorQuantity(item.productId, c.color, 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">+</button>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-700">{item.currency} {(c.pricePerItem * c.quantity).toFixed(2)}</span>
                                                                <button
                                                                    onClick={() => removeColorFromCart(item.productId, c.color)}
                                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                                >
                                                                    ✕
                                                                </button>

                                                            </div>
                                                        ))}

                                               
                                                        {fullProduct && (
                                                            <div className="mt-1 text-xs text-green-700 space-y-1">
                                                                {Array.isArray(fullProduct.offers) &&
                                                                    fullProduct.offers
                                                                        .filter((offer) => {
                                                                            if (offer.discountType === "rangeBuyXGetY") {
                                                                                const { start, end } = offer.discountValue || {};
                                                                                return totalQuantity >= start && totalQuantity <= end;
                                                                            }
                                                                            if (offer.discountType === "bulk") {
                                                                                return totalQuantity >= fullProduct.minQuantity;
                                                                            }
                                                                            return offer.applied;
                                                                        })
                                                                        .map((offer, idx) => {
                                                                            const rangeMsg =
                                                                                offer.discountType === "rangeBuyXGetY"
                                                                                    ? `Pay ${totalQuantity - (offer.discountValue?.free || 0)}, get ${offer.discountValue?.free} free ✅`
                                                                                    : offer.description;
                                                                            return (
                                                                                <div key={idx} className="flex justify-between items-center">
                                                                                    <span className="font-medium">{rangeMsg}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                            </div>
                                                        )}

                                                  
                                                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap self-end mt-2">
                                                            {item.currency} {item.colors.reduce((sum, c) => sum + c.pricePerItem * c.quantity, 0).toFixed(2)}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )}
                                    </div> */}

                                    {/* <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                        {userCartCount > 0 ? (
                                            Object.values(groupedCart).map((item, index) => {
                                                console.log("groupedCart", groupedCart)
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                console.log("fullProduct", fullProduct.variations)
                                                const totalQuantity = item.colors.reduce((sum, c) => sum + c.quantity, 0);
                                                console.log("item", item)
                                                return (
                                                    <div
                                                        key={index}
                                                        className="relative p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-200"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemId(item);
                                                                setIsConfirmOpen(true);
                                                            }}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>

                                                        <div className="mb-2">
                                                            <Link
                                                                href={`/product/${item.productId}`}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                                                                    {item.productName}
                                                                </h3>
                                                            </Link>
                                                        </div>

                                                        {fullProduct && (
                                                            <div className="mt-2 text-xs text-green-700 space-y-1">
                                                                {(() => {
                                                                    // 🟢 Step 1: Determine correct bulk data (variation > product)
                                                                    // 🟢 Try to resolve variation from different sources
                                                                    const variationId =
                                                                        fullProduct.selectedVariation?.id ||
                                                                        fullProduct.selectedVariationId ||
                                                                        fullProduct.variationId ||
                                                                        item?.variationId; // ✅ for cart page case

                                                                    console.log("🟢 variationId used:", variationId);

                                                                    const variationData = fullProduct.variations?.find(v => v.id === variationId);

                                                                    console.log("🟢 Found variationData:", variationData);

                                                                    const bulkPrice = variationData?.bulkPrice ?? fullProduct.bulkPrice;
                                                                    const minQuantity = variationData?.minQuantity ?? fullProduct.minQuantity;

                                                                    // 🟢 Step 2: Merge normal offers + applicable bulk offer
                                                                    const offersList = [
                                                                        ...(Array.isArray(fullProduct.offers) ? fullProduct.offers : []),
                                                                        bulkPrice && minQuantity
                                                                            ? {
                                                                                id: "bulk-offer",
                                                                                discountType: "bulk",
                                                                                applied: totalQuantity >= minQuantity,
                                                                                description: `Buy ${minQuantity}+ items at ₹${bulkPrice} each`,
                                                                            }
                                                                            : null,
                                                                    ].filter(Boolean);

                                                                    // 🟢 Step 3: Filter only applied offers
                                                                    const appliedOffers = offersList.filter((offer) => {
                                                                        if (offer.discountType === "rangeBuyXGetY") {
                                                                            const { start, end } = offer.discountValue || {};
                                                                            return totalQuantity >= start && totalQuantity <= end;
                                                                        }
                                                                        if (offer.discountType === "bulk") {
                                                                            return totalQuantity >= minQuantity;
                                                                        }
                                                                        return offer.applied;
                                                                    });

                                                                    // 🟢 Step 4: If no offers applied, show nothing
                                                                    if (appliedOffers.length === 0) return null;

                                                                    // 🟢 Step 5: Display applied offers
                                                                    return (
                                                                        <div className="border border-green-200 bg-green-50 rounded-md p-2 text-green-800">
                                                                            <div className="font-semibold text-sm flex items-center gap-1">
                                                                                ✅ Offer Applied
                                                                            </div>

                                                                            <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                                                                                {appliedOffers.map((offer, idx) => {
                                                                                    let message = offer.description || "";

                                                                                    if (offer.discountType === "rangeBuyXGetY") {
                                                                                        const { free } = offer.discountValue || {};
                                                                                        message = `Buy ${totalQuantity - free}, get ${free} free`;
                                                                                    }

                                                                                    if (offer.discountType === "bulk") {
                                                                                        message = `Bulk offer: ₹${bulkPrice} per item (Min ${minQuantity})`;
                                                                                    }

                                                                                    return <li key={idx}>{message}</li>;
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}


                                                        <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2">
                                                            {Object.entries(item.attributes)
                                                                .filter(([k]) => k !== "color")
                                                                .map(([k, v]) => (
                                                                    <span key={k}>
                                                                        <span className="capitalize">{k}:</span> {v}
                                                                    </span>
                                                                ))}
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            {(() => {
                                                                const totalQuantity = item.colors.reduce((sum, c) => sum + c.quantity, 0);

                                                                // Identify offers
                                                                const rangeOffer = Array.isArray(fullProduct?.offers)
                                                                    ? fullProduct.offers.find(o =>
                                                                        o.discountType === "rangeBuyXGetY" &&
                                                                        totalQuantity >= o.discountValue?.start &&
                                                                        totalQuantity <= o.discountValue?.end
                                                                    )
                                                                    : null;

                                                                const bulkOffer =
                                                                    fullProduct?.minQuantity &&
                                                                    fullProduct?.bulkPrice &&
                                                                    totalQuantity >= fullProduct.minQuantity;

                                                                // Determine applied offer
                                                                let appliedOffer = null;
                                                                if (rangeOffer) appliedOffer = "range";
                                                                if (bulkOffer && (!rangeOffer || fullProduct.bulkPrice * totalQuantity < item.colors.reduce((s, c) => s + c.pricePerItem * c.quantity, 0)))
                                                                    appliedOffer = "bulk";

                                                                // For range offer (get free), find payable qty
                                                                const freeQty = rangeOffer?.discountValue?.free || 0;

                                                                // Flatten color items sorted by price descending
                                                                const sortedItems = [...item.colors]
                                                                    .sort((a, b) => b.pricePerItem - a.pricePerItem)
                                                                    .flatMap(c => Array(c.quantity).fill(c));

                                                                // Mark free items (for Buy X Get Y)
                                                                const paidItems = sortedItems.slice(0, Math.max(totalQuantity - freeQty, 0));
                                                                const freeItems = sortedItems.slice(totalQuantity - freeQty);

                                                                return item.colors.map((c, idx) => {
                                                                    // Count how many of this color are free
                                                                    const freeCount = freeItems.filter(f => f.color === c.color).length;

                                                                    // Determine new price if offer applied
                                                                    let displayPrice = c.pricePerItem;
                                                                    let isDiscounted = false;

                                                                    if (appliedOffer === "bulk") {
                                                                        displayPrice = fullProduct.bulkPrice;
                                                                        isDiscounted = true;
                                                                    } else if (appliedOffer === "range" && freeCount > 0) {
                                                                        isDiscounted = true; // show visual difference
                                                                    }

                                                                    const totalPrice = (displayPrice * c.quantity).toFixed(2);
                                                                    const originalTotal = (c.pricePerItem * c.quantity).toFixed(2);

                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex flex-col gap-1 border-t pt-2"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-2">
                                                                                    <img
                                                                                        src={c.image || "/placeholder.png"}
                                                                                        alt={c.color}
                                                                                        className="w-10 h-10 object-cover rounded-md border"
                                                                                    />
                                                                                    <span className="text-sm font-medium text-gray-700">{c.color}</span>
                                                                                    {freeCount > 0 && (
                                                                                        <span className="text-xs text-green-600 font-medium">
                                                                                            +{freeCount} free
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <button
                                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                                        onClick={() => updateQuantity(c.itemId, -1)}
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                    <span className="px-2 text-sm">{c.quantity}</span>
                                                                                    <button
                                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                                        onClick={() => updateQuantity(c.itemId, 1)}
                                                                                    >
                                                                                        +
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {(() => {
                                                                                const originalTotal = (c.pricePerItem * c.quantity).toFixed(2);
                                                                                let finalPrice = c.pricePerItem;
                                                                                let totalDiscounted = originalTotal;
                                                                                let savedAmount = 0;

                                                                                if (appliedOffer === "bulk") {
                                                                                    finalPrice = fullProduct.bulkPrice;
                                                                                    totalDiscounted = (finalPrice * c.quantity).toFixed(2);
                                                                                    savedAmount = (c.pricePerItem - fullProduct.bulkPrice) * c.quantity;
                                                                                } else if (appliedOffer === "range" && freeCount > 0) {
                                                                                    savedAmount = (c.pricePerItem * freeCount);
                                                                                }

                                                                                const showDiscount = savedAmount > 0;

                                                                                return (
                                                                                    <div className="pl-12 text-sm text-gray-800">
                                                                                        {showDiscount ? (
                                                                                            <>
                                                                                                <div>
                                                                                                    <span className="line-through text-gray-400">
                                                                                                        ₹{c.pricePerItem} × {c.quantity} = ₹{originalTotal}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="text-green-700 font-semibold">
                                                                                                    ₹{finalPrice} × {c.quantity} = ₹{totalDiscounted} ✅
                                                                                                </div>
                                                                                                <div className="text-xs text-green-600">
                                                                                                    You saved ₹{savedAmount.toFixed(2)} 🎉
                                                                                                </div>
                                                                                            </>
                                                                                        ) : (
                                                                                            <div>
                                                                                                ₹{c.pricePerItem} × {c.quantity} = ₹{originalTotal}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })()}

                                                                            <div className="flex justify-end">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedItemId(item.itemIds[idx]);
                                                                                        setIsConfirmOpen(true);
                                                                                    }}
                                                                                    className="text-red-500 hover:text-red-700 text-xs mt-1"
                                                                                    title="Remove item"
                                                                                >
                                                                                    ✕ Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    );

                                                                });
                                                            })()}
                                                        </div>




                                                      <div className="text-sm font-bold text-gray-900 text-right mt-3 border-t pt-2">
                                                            Total: {item.currency}{" "}
                                                            {item.colors
                                                                .reduce((sum, c) => sum + c.pricePerItem * c.quantity, 0)
                                                                .toFixed(2)}
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-900 text-right mt-3 border-t pt-2">
                                                            {(() => {
                                                                const totalOriginal = item.colors
                                                                    .reduce((sum, c) => sum + c.pricePerItem * c.quantity, 0);

                                                                let totalDiscounted = totalOriginal;

                                                                // 🟢 Apply Bulk Price if applicable
                                                                if (fullProduct?.minQuantity && fullProduct?.bulkPrice && totalQuantity >= fullProduct.minQuantity) {
                                                                    totalDiscounted = fullProduct.bulkPrice * totalQuantity;
                                                                }

                                                                // 🟢 Apply Range Offer if applicable
                                                                if (Array.isArray(fullProduct?.offers)) {
                                                                    fullProduct.offers.forEach((offer) => {
                                                                        if (offer.discountType === "rangeBuyXGetY") {
                                                                            const { start, end, free } = offer.discountValue || {};
                                                                            if (totalQuantity >= start && totalQuantity <= end) {
                                                                                const payable = totalQuantity - (free || 0);
                                                                                totalDiscounted = fullProduct.price * payable;
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                                const isDiscounted = totalDiscounted < totalOriginal;

                                                                return (
                                                                    <div>
                                                                        <span>Total: {item.currency} </span>
                                                                        {isDiscounted ? (
                                                                            <>
                                                                                <span className="line-through text-gray-400 mr-2">
                                                                                    {totalOriginal.toFixed(2)}
                                                                                </span>
                                                                                <span className="text-green-700">
                                                                                    {totalDiscounted.toFixed(2)} ✅
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <span>{totalOriginal.toFixed(2)}</span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>

                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )}
                                    </div> */}
                                    <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                                        {userCartCount > 0 ? (
                                            Object.values(groupedCart).map((item, index) => {
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                if (!fullProduct) return null;

                                                const baseVariation =
                                                    fullProduct?.variations?.find(v => v.id === item.variationId) ||
                                                    fullProduct?.selectedVariation ||
                                                    null;
                                                    console.log("baseVariation" , baseVariation)

                                                const totalVariationQty = item.colors.reduce((s, c) => s + Number(c.quantity || 0), 0);
                                                const minCandidates = item.colors
                                                    .map(c => Number(c.bulkMinQty || baseVariation?.minQuantity || fullProduct?.minQuantity || 0))
                                                    .filter(v => v > 0);
                                                const minRequired = minCandidates.length ? Math.min(...minCandidates) : 0;
                                                const isVariationOfferActive = minRequired > 0 && totalVariationQty >= minRequired;

                                                const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

                                                return (
                                                    <div
                                                        key={index}
                                                        className="relative border rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5"
                                                    >

                                                        {/* HEADER (always visible) */}
                                                        <div
                                                            className="flex justify-between items-start cursor-pointer"
                                                            onClick={() => setExpanded(expanded === index ? null : index)}
                                                        >
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                                                                    {item.productName}
                                                                </h3>

                                                                {/* Attributes */}
                                                                <div className="mt-1 space-y-0.5">
                                                                    {Object.entries(item.attributes || {})
                                                                        .filter(([k, v]) => k !== "color" && v !== null && v !== "")
                                                                        .map(([k, v], i) => (
                                                                            <div key={i} className="text-xs text-gray-500 capitalize">
                                                                                {k}: {v}
                                                                            </div>
                                                                        ))}
                                                                </div>

                                                                {/* Offer Label */}
                                                                {(isVariationOfferActive || item.productOfferApplied) && (
                                                                    <div className="text-green-600 font-medium text-xs mt-1">
                                                                        {item.productOfferApplied
                                                                            ? "Range Offer Applied"
                                                                            : "Bulk Offer Applied"}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button className="text-xl font-bold select-none">
                                                                {expanded === index ? "−" : "+"}
                                                            </button>
                                                        </div>

                                                        {/* EXPANDED SECTION */}
                                                        {expanded === index && (
                                                            <div className="mt-4 border-t pt-4">

                                                                {/* ⭐⭐⭐ YOUR FULL ORIGINAL UI STARTS HERE ⭐⭐⭐ */}

                                                                {/* Offer Box */}
                                                                {isVariationOfferActive && (
                                                                    <div className="border border-green-200 bg-green-50 rounded-lg p-2 sm:p-3 mb-4 text-green-800">
                                                                        <div className="font-medium text-sm mb-1">Active Bulk Offers:</div>
                                                                        <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5">
                                                                            {item.colors.map((c, i) => {
                                                                                const matchVar = findColorVariation(fullProduct, c, item);
                                                                                const bulkPrice = Number(
                                                                                    c.bulkPrice ??
                                                                                    matchVar?.bulkPrice ??
                                                                                    baseVariation?.bulkPrice ??
                                                                                    fullProduct?.bulkPrice ??
                                                                                    null
                                                                                );
                                                                                const minQty = Number(
                                                                                    c.bulkMinQty ??
                                                                                    matchVar?.minQuantity ??
                                                                                    baseVariation?.minQuantity ??
                                                                                    fullProduct?.minQuantity ??
                                                                                    0
                                                                                );
                                                                                if (!bulkPrice || !minQty) return null;
                                                                                return (
                                                                                    <li key={i}>
                                                                                        {c.color}: ₹{fmt(bulkPrice)} per item (Min {minQty})
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {item.productOfferApplied && (
                                                                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-2 sm:p-3 mb-4 text-blue-800">
                                                                        <div className="font-medium text-sm mb-1">Active Range Offer:</div>
                                                                        <ul className="list-disc list-inside text-xs sm:text-sm">
                                                                            <li>
                                                                                Buy {item.productOffer.discountValue.start}–{item.productOffer.discountValue.end},
                                                                                Get {item.productOffer.discountValue.free} Free
                                                                            </li>
                                                                            <li>Free items: Lowest priced variations 🎁</li>
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {/* Variations */}
                                                                <div className="space-y-4">
                                                                    {item.colors.map((c, idx) => {
                                                                        const matchVar = findColorVariation(fullProduct, c, item);
                                                                        const colorPrice = Number(c.pricePerItem ?? 0);
                                                                        const bulkPrice = Number(
                                                                            c.bulkPrice ??
                                                                            matchVar?.bulkPrice ??
                                                                            baseVariation?.bulkPrice ??
                                                                            fullProduct?.bulkPrice ??
                                                                            0
                                                                        );
                                                                        const minQty = Number(
                                                                            c.bulkMinQty ??
                                                                            matchVar?.minQuantity ??
                                                                            baseVariation?.minQuantity ??
                                                                            fullProduct?.minQuantity ??
                                                                            0
                                                                        );
                                                                        const isBulkActive =
                                                                            bulkPrice > 0 && totalVariationQty >= minQty;

                                                                        const originalTotal = colorPrice * Number(c.quantity);
                                                                        const discountedTotal =
                                                                            isBulkActive ? bulkPrice * Number(c.quantity) : originalTotal;
                                                                        const saved = isBulkActive
                                                                            ? (colorPrice - bulkPrice) * Number(c.quantity)
                                                                            : 0;

                                                                        return (
                                                                            <div key={idx} className="border-t border-gray-100 pt-3">
                                                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                                                    <div className="flex items-center gap-2">
                                                                                        {c.image && (
                                                                                            <img
                                                                                                src={c.image}
                                                                                                alt={c.color}
                                                                                                className="w-8 h-8 rounded-md object-cover border"
                                                                                            />
                                                                                        )}
                                                                                        <span className="text-sm font-medium text-gray-700">
                                                                                            {c.color}
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="flex items-center gap-2">
                                                                                        <button
                                                                                            onClick={() => updateQuantity(c.itemId, -1)}
                                                                                            className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                                                                                        >
                                                                                            −
                                                                                        </button>
                                                                                        <span className="px-2 text-sm">{c.quantity}</span>
                                                                                        <button
                                                                                            onClick={() => updateQuantity(c.itemId, 1)}
                                                                                            className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                                                                                        >
                                                                                            +
                                                                                        </button>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Price UI */}
                                                                                <div className="pl-2 sm:pl-4 text-sm mt-2">

                                                                                    {/* If Range Offer */}
                                                                                    {item.productOfferApplied &&
                                                                                        item.productOffer?.name === "Range" ? (
                                                                                        (() => {
                                                                                            const offer = item.productOffer;

                                                                                            const free = offer?.freeItems?.find(
                                                                                                f =>
                                                                                                    f.variationId === c.variationId ||
                                                                                                    f.id === c.variationId
                                                                                            );

                                                                                            const paid = offer?.paidItems?.find(
                                                                                                p =>
                                                                                                    p.variationId === c.variationId ||
                                                                                                    p.id === c.variationId
                                                                                            );

                                                                                            return (
                                                                                                <div className="flex flex-col">

                                                                                                    {paid && (
                                                                                                        <div className="text-gray-700 font-semibold">
                                                                                                            ₹{fmt(c.pricePerItem)} × {paid.paidQty} =
                                                                                                            ₹{fmt(c.pricePerItem * paid.paidQty)}
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {free && (
                                                                                                        <div className="text-green-700 font-semibold">
                                                                                                            🎁 {free.freeQty} FREE (Saved ₹
                                                                                                            {fmt(c.pricePerItem * free.freeQty)})
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {!paid && !free && (
                                                                                                        <div>
                                                                                                            ₹{fmt(c.pricePerItem)} × {c.quantity} =
                                                                                                            ₹{fmt(c.pricePerItem * c.quantity)}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            );
                                                                                        })()
                                                                                    ) : isBulkActive ? (
                                                                                        <>
                                                                                            <div>
                                                                                                <span className="line-through text-gray-400">
                                                                                                    ₹{fmt(colorPrice)} × {c.quantity} =
                                                                                                    ₹{fmt(originalTotal)}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="text-green-700 font-semibold">
                                                                                                ₹{fmt(bulkPrice)} × {c.quantity} =
                                                                                                ₹{fmt(discountedTotal)} ✅
                                                                                            </div>
                                                                                            <div className="text-xs text-green-600">
                                                                                                You saved ₹{fmt(saved)} 🎉
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div>
                                                                                            ₹{fmt(colorPrice)} × {c.quantity} =
                                                                                            ₹{fmt(originalTotal)}
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* Remove this variation */}
                                                                                <div className="flex justify-end">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setSelectedItemId(item.itemIds[idx]);
                                                                                            setIsConfirmOpen(true);
                                                                                        }}
                                                                                        className="text-red-500 hover:text-red-700 text-xs mt-1"
                                                                                    >
                                                                                        ✕ Remove
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* FOOTER (collapsed state only) */}
                                                        <div className="flex justify-between items-center mt-4 border-t pt-3">

                                                            {/* LEFT — REMOVE BUTTON */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItemId(item);
                                                                    setIsConfirmOpen(true);
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-sm"
                                                            >
                                                                🗑 Remove
                                                            </button>

                                                            {/* CENTER — TOTAL QTY */}
                                                            <div className="text-center text-gray-700 font-semibold text-sm">
                                                                Total Qty:&nbsp;
                                                                {item.colors.reduce((sum, c) => sum + Number(c.quantity), 0)}
                                                            </div>

                                                            {/* RIGHT — TOTAL PRICE */}
                                                            <div className="text-right text-sm font-bold text-gray-900">
                                                                {(() => {
                                                                    const { totalOriginal, totalAfterOffer, savings } = getTotalDisplay(item, fullProduct);
                                                                    return (
                                                                        <div className="flex flex-col items-end">
                                                                            <div>
                                                                                Total:&nbsp;
                                                                                {savings > 0 ? (
                                                                                    <>
                                                                                        <span className="line-through text-gray-400 mr-1">₹{fmt(totalOriginal)}</span>
                                                                                        <span className="text-green-700">₹{fmt(totalAfterOffer)} ✅</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span>₹{fmt(totalOriginal)}</span>
                                                                                )}
                                                                            </div>
                                                                            {savings > 0 && (
                                                                                <div className="text-xs text-green-600 font-semibold mt-1">
                                                                                    Total Savings: ₹{fmt(savings)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>


                                                        </div>

                                                    </div>


                                                );
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )}
                                    </div>


                                    {/* Checkout Button */}
                                    {userCartCount > 0 && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    router.push(`/checkout`);
                                                }}
                                                className="w-full bg-gray-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 
                                        {userCartCount > 0 ? (
                                            userCart.map((item, index) => {
                                                const fullProduct = products.find(p => p.id === item.productId);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="relative flex items-center gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                                                    >
                                               
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemId(item.id); // delete karne wala item
                                                                setIsConfirmOpen(true);      // modal open
                                                            }}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>

                                                        <div className="flex items-center gap-3 cursor-pointer">
                                                            <Link href={`/product/${item.productId}`} className="flex items-center gap-3" onClick={() => setIsOpen(false)} >
                                                                <img
                                                                    src={item.image || "/placeholder.png"}
                                                                    alt={item.productName}
                                                                    className="w-16 h-16 object-cover rounded-md border"
                                                                />
                                                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                                    {item.productName}
                                                                </h3>
                                                            </Link>
                                                        </div>

                                                  
                                                        <div className="flex-1 flex flex-col gap-1 ml-2">
                                                            <p className="text-xs text-gray-500">
                                                                {Object.entries(item.attributes || {})
                                                                    .map(([key, val]) => `${key}: ${val}`)
                                                                    .join(", ")}
                                                            </p>

                                                        
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <button
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                    onClick={() => updateQuantity(index, -1)}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-2 text-sm">{item.quantity}</span>
                                                                <button
                                                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                                    onClick={() => updateQuantity(index, 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <p className="text-sm font-medium text-gray-700 mt-1">
                                                                {item.currency} {(item.pricePerItem * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>

                                                  <ProductOffers product={fullProduct} quantity={item.quantity} /> 

                                                  
                                                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap self-center ml-auto">
                                                            {item.currency} {(item.pricePerItem * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>


                                                )
                                            })

                                        ) : (
                                            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
                                        )} */}


                        {/* <button onClick={() => setLoginModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition text-white font-functionPro">
                            <User className="h-6 w-6" />
                            <span className="hidden md:inline font-medium">Login</span>
                        </button> */}

                        <div className="relative">
                            {!user ? (
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition text-white font-functionPro"
                                >
                                    <User className="h-6 w-6" />
                                    <span className="hidden md:inline font-medium">Login</span>
                                </button>
                            ) : (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    {/* <div className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition text-white font-functionPro">
                                        <span className="font-medium">Welcome,</span>
                                        <div className="h-12 w-12 rounded-full bg-gray-500 flex items-center justify-center text-black font-bold">
                                            {getInitials(user.name)}
                                        </div>
                                    </div> */}
                                    <div className="flex items-center gap-3 cursor-pointer group">

                                        {/* <div className="text-white text-sm sm:text-base md:text-lg font-medium">
                                            Welcome,
                                        </div> */}
                                        <div className="hidden sm:block text-white text-sm font-medium sm:text-base md:text-lg">
                                            Welcome,
                                        </div>




                                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white bg-gray-500 flex items-center justify-center">
                                            {user.profileImage ? (
                                                <Image
                                                    src={user.profileImage}
                                                    alt={user.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-black font-bold text-lg">
                                                    {getInitials(user.name)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {dropdownOpen && (
                                        <div
                                            className="absolute z-50 bg-white shadow-lg rounded-md font-functionPro cursor-pointer"
                                            style={{
                                                top: "calc(100% - 6px)",
                                                right: 0,
                                                maxWidth: "90vw",
                                            }}
                                        >
                                            <Link
                                                href={
                                                    user.role === "USER"
                                                        ? "/dashboard"
                                                        : "/admin/dashboard"
                                                }
                                            >
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </button>
                                            </Link>

                                            <button
                                                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-red-500 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}

                                </div>

                            )}
                        </div>

                        {/* Hamburger for mobile */}
                        <button
                            className="md:hidden cursor-pointer text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div >




                {/* Mobile Menu */}
                {
                    mobileMenuOpen && (
                        <div className="md:hidden px-4 pb-3 font-functionPro">
                            <ul className="flex flex-col gap-3">
                                {menuItems.map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleMenuClick(item)}
                                            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer ${active === item
                                                ? "bg-white text-[#161619]"
                                                : "text-white hover:bg-gray-700"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </header >

            <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
                <Login onClose={() => setLoginModalOpen(false)} />
            </Modal>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Delete"
                message="Are you sure you want to remove this item from your cart?"
                onConfirm={handleDelete}
            />
        </>

    );
};

export default Header;
