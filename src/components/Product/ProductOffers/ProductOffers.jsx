// "use client";
// import React from "react";

// const ProductOffers = ({ product, quantity }) => {
//     const currency = product.currency || ""; // ✅ use currency instead of currencySymbol

//     // Range offer logic
//     const getRangeOfferApplied = (offer) => {
//         if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
//         const { start, end, free } = offer.discountValue || {};
//         if (quantity >= start && quantity <= end) {
//             const payQty = quantity - free;
//             return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
//         }
//         return null;
//     };

//     // ✅ Ensure product.offers is always an array
//     const offers = Array.isArray(product.offers) ? product.offers : [];

//     // Merge normal offers + bulk offer
//     const offersList = [
//         ...offers,
//         product.minQuantity && product.bulkPrice
//             ? {
//                 id: "bulk-offer",
//                 description:
//                     quantity >= product.minQuantity
//                         ? `Bulk price applied: ${currency} ${product.bulkPrice} each`
//                         : `Buy ${product.minQuantity}+ items to get ${currency} ${product.bulkPrice} each`,
//                 type: ["product"],
//                 applied: quantity >= product.minQuantity,
//                 discountType: "bulk",
//             }
//             : null,
//     ].filter(Boolean);

//     // ✅ If no offers at all, hide section
//     if (offersList.length === 0) return null;

//     return (
//         <div className="p-4 rounded-md shadow-sm bg-yellow-100 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
//             {[...new Map(offersList.map((o) => [o.id, o])).values()].map(
//                 (offer, index) => {
//                     const rangeAppliedMsg = getRangeOfferApplied(offer);
//                     return (
//                         <div
//                             key={index}
//                             className="flex flex-col sm:flex-row justify-between sm:items-center"
//                         >
//                             <span className="font-semibold">
//                                 {offer.discountType === "rangeBuyXGetY"
//                                     ? `Buy minimum ${offer.discountValue?.start}, get ${offer.discountValue?.free} free`
//                                     : offer.description}
//                             </span>

//                             {(offer.applied || rangeAppliedMsg) && (
//                                 <span className="text-sm font-medium text-green-700">
//                                     {rangeAppliedMsg || "Applied ✅"}
//                                 </span>
//                             )}
//                         </div>
//                     );
//                 }
//             )}
//         </div>
//     );
// };

// export default ProductOffers;


// "use client";
// import React from "react";

// const ProductOffers = ({ product, quantity, selectedVariation }) => {
//     const currency = selectedVariation?.currency || product.currency || "₹";

//     // 🟡 Get effective bulk data (variation > product)
//     const effectiveMinQty =
//         selectedVariation?.minQuantity ?? product.minQuantity ?? null;
//     const effectiveBulkPrice =
//         selectedVariation?.bulkPrice ?? product.bulkPrice ?? null;

//     // 🧮 Range offer logic
//     const getRangeOfferApplied = (offer) => {
//         if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
//         const { start, end, free } = offer.discountValue || {};
//         if (quantity >= start && quantity <= end) {
//             const payQty = quantity - free;
//             return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
//         }
//         return null;
//     };

//     // ✅ Normalize offers array
//     const offers = Array.isArray(product.offers) ? product.offers : [];

//     // 🧩 Merge normal offers + effective bulk offer (if available)
//     const offersList = [
//         ...offers,
//         effectiveMinQty && effectiveBulkPrice
//             ? {
//                 id: "bulk-offer",
//                 description:
//                     quantity >= effectiveMinQty
//                         ? `Bulk price applied: ${currency} ${effectiveBulkPrice} each`
//                         : `Buy ${effectiveMinQty}+ items to get ${currency} ${effectiveBulkPrice} each`,
//                 type: ["product"],
//                 applied: quantity >= effectiveMinQty,
//                 discountType: "bulk",
//             }
//             : null,
//     ].filter(Boolean);

//     if (offersList.length === 0) return null;

//     return (
//         <div className="p-4 rounded-md shadow-sm bg-yellow-100 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
//             {[...new Map(offersList.map((o) => [o.id, o])).values()].map(
//                 (offer, index) => {
//                     const rangeAppliedMsg = getRangeOfferApplied(offer);
//                     return (
//                         <div
//                             key={index}
//                             className="flex flex-col sm:flex-row justify-between sm:items-center"
//                         >
//                             <span className="font-semibold">
//                                 {offer.discountType === "rangeBuyXGetY"
//                                     ? `Buy minimum ${offer.discountValue?.start}, get ${offer.discountValue?.free} free`
//                                     : offer.description}
//                             </span>

//                             {(offer.applied || rangeAppliedMsg) && (
//                                 <span className="text-sm font-medium text-green-700">
//                                     {rangeAppliedMsg || "Applied ✅"}
//                                 </span>
//                             )}
//                         </div>
//                     );
//                 }
//             )}
//         </div>
//     );
// };

// export default ProductOffers;


"use client";
import React from "react";

const ProductOffers = ({
    product,
    quantity,
    selectedVariation,
    bulkStatus,
    userCart = [],
}) => {
    const currency = selectedVariation?.currency || product.currency || "₹";

    // 🧩 Extract attributes safely (fallback chain)
    const selectedAttrs =
        selectedVariation?.attributes ||
        selectedVariation?.attribute_values ||
        product?.items?.find((i) => i.variationId === selectedVariation?.id)
            ?.attributes ||
        {};

    // 🧠 Compare attributes ignoring color (case-insensitive)
    const isSameAttributes = (attrs1 = {}, attrs2 = {}) => {
        const keys = new Set([...Object.keys(attrs1), ...Object.keys(attrs2)]);
        for (const key of keys) {
            if (key.toLowerCase() === "color") continue; // ✅ ignore color
            const val1 = (attrs1[key] ?? "").toString().toLowerCase().trim();
            const val2 = (attrs2[key] ?? "").toString().toLowerCase().trim();
            if (val1 !== val2) return false;
        }
        return true;
    };

    // 🧠 Range offer message
    const getRangeOfferApplied = (offer) => {
        if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
        const { start, end, free } = offer.discountValue || {};
        if (quantity >= start && quantity <= end) {
            const payQty = quantity - free;
            return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
        }
        return null;
    };

    const offers = Array.isArray(product.offers) ? product.offers : [];

    // ✅ Detect applied offer ignoring color
    let appliedItem =
        userCart.find(
            (i) =>
                i.productOfferApplied &&
                i.variationId === selectedVariation?.id
        ) ||
        userCart.find(
            (i) =>
                i.productOfferApplied &&
                i.productId === product?.id &&
                isSameAttributes(i.attributes || {}, selectedAttrs)
        );


    console.log("🟢 matched appliedItem:", appliedItem);
    console.log("🎨 selectedAttrs:", selectedAttrs);

    const appliedOfferFromItem = appliedItem?.productOfferId || null;
    const appliedOfferFlagFromItem = !!appliedItem;

    const appliedOfferId =
        selectedVariation?.productOfferId ||
        product?.productOfferId ||
        appliedOfferFromItem ||
        null;

    const offerAppliedFlag =
        selectedVariation?.productOfferApplied ||
        product?.productOfferApplied ||
        appliedOfferFlagFromItem ||
        false;

    // 🧮 Build offers list
    const offersList = [
        ...offers.map((o) => {
            let applied = false;

            if (o.discountType === "rangeBuyXGetY") {
                const { start, end } = o.discountValue || {};
                applied =
                    (quantity >= start && quantity <= end) ||
                    (offerAppliedFlag && appliedOfferId === o.id);
            } else if (o.discountType === "bulk") {
                applied = bulkStatus?.eligible;
            }

            return { ...o, applied };
        }),

        // ✅ Bulk price logic
        selectedVariation?.bulkPrice && {
            id: "bulk-offer",
            description: bulkStatus?.eligible
                ? `Bulk price applied: ${currency} ${selectedVariation?.bulkPrice
                } each`
                : `Buy ${selectedVariation?.minQuantity ?? product.minQuantity
                }+ items to get ${currency} ${selectedVariation?.bulkPrice
                } each`,
            discountType: "bulk",
            applied: bulkStatus?.eligible,
        },
    ].filter(Boolean);

    if (offersList.length === 0) return null;

    return (
        <div className="p-4 rounded-md shadow-sm bg-yellow-100 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
            {[...new Map(offersList.map((o) => [o.id, o])).values()].map(
                (offer, index) => {
                    const rangeAppliedMsg = getRangeOfferApplied(offer);
                    return (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row justify-between sm:items-center"
                        >
                            <span className="font-semibold text-gray-800">
                                {offer.discountType === "rangeBuyXGetY"
                                    ? `Buy minimum ${offer.discountValue?.start}, get ${offer.discountValue?.free} free`
                                    : offer.description}
                            </span>

                            {(offer.applied || rangeAppliedMsg) && (
                                <span className="text-sm font-medium text-green-700">
                                    {rangeAppliedMsg || "Applied ✅"}
                                </span>
                            )}
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default ProductOffers;
