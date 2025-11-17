 <div
                                                        key={index}
                                                        className="relative border rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5"
                                                    >
                                                        {/* Header */}
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{item.productName}</h3>
                                                                <div className="mt-1 space-y-0.5">
                                                                    {Object.entries(item.attributes || {})
                                                                        .filter(([k, v]) => k !== "color" && v != null && v !== "")
                                                                        .map(([k, v], i) => (
                                                                            <div key={i} className="text-xs sm:text-sm text-gray-500 capitalize">
                                                                                {k}: {v}
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                                {isVariationOfferActive || item.productOfferApplied ? (
                                                                    <div className="text-green-600 font-medium text-xs mt-1 flex items-center gap-1">
                                                                        ✅ {item.productOfferApplied ? "Range Offer Applied" : "Bulk Offer Applied"}
                                                                    </div>
                                                                ) : null}

                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItemId(item);
                                                                    setIsConfirmOpen(true);
                                                                }}
                                                                className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                                                                title="Remove item"
                                                            >
                                                                <Trash className="w-5 h-5 sm:w-6 sm:h-6" />
                                                            </button>
                                                        </div>

                                                        {/* Offer Box */}
                                                        {isVariationOfferActive && (
                                                            <div className="border border-green-200 bg-green-50 rounded-lg p-2 sm:p-3 mb-4 text-green-800">
                                                                <div className="font-medium text-sm mb-1">Active Bulk Offers:</div>
                                                                <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5">
                                                                    {item.colors.map((c, i) => {
                                                                        const matchVar = findColorVariation(fullProduct, c, item);
                                                                        const bulkPrice = Number(
                                                                            c.bulkPrice ?? matchVar?.bulkPrice ?? baseVariation?.bulkPrice ?? fullProduct?.bulkPrice ?? null
                                                                        );
                                                                        const minQty = Number(
                                                                            c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0
                                                                        );
                                                                        if (!bulkPrice || !minQty) return null;
                                                                        return (
                                                                            <li key={i}>
                                                                                {c.color}: ₹{fmt(bulkPrice)} per item (Min {minQty})
                                                                            </li>
                                                                        );
                                                                    })}</ul>
                                                            </div>
                                                        )}
                                                        {item.productOfferApplied && (
                                                            <div className="border border-blue-200 bg-blue-50 rounded-lg p-2 sm:p-3 mb-4 text-blue-800">
                                                                <div className="font-medium text-sm mb-1">Active Range Offer:</div>
                                                                <ul className="list-disc list-inside text-xs sm:text-sm">
                                                                    <li>Buy {item.productOffer.discountValue.start}–{item.productOffer.discountValue.end}, Get {item.productOffer.discountValue.free} Free</li>
                                                                    <li>Free items: Lowest priced variations 🎁</li>
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Variations */}
                                                        <div className="space-y-4">
                                                            {item.colors.map((c, idx) => {
                                                                const matchVar = findColorVariation(fullProduct, c, item);
                                                                // const colorPrice = Number(matchVar?.price ?? c.pricePerItem ?? 0);
                                                                const colorPrice = Number(c.pricePerItem ?? 0);
                                                                const bulkPrice = Number(
                                                                    c.bulkPrice ??
                                                                    matchVar?.bulkPrice ??
                                                                    baseVariation?.bulkPrice ??
                                                                    fullProduct?.bulkPrice ??
                                                                    0
                                                                );
                                                                const minQty = Number(
                                                                    c.bulkMinQty ?? matchVar?.minQuantity ?? baseVariation?.minQuantity ?? fullProduct?.minQuantity ?? 0
                                                                );
                                                                const isBulkActive = bulkPrice > 0 && minQty > 0 && totalVariationQty >= minQty;

                                                                const originalTotal = colorPrice * Number(c.quantity);
                                                                const discountedTotal = isBulkActive ? bulkPrice * Number(c.quantity) : originalTotal;
                                                                const saved = isBulkActive ? (colorPrice - bulkPrice) * Number(c.quantity) : 0;

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
                                                                                <span className="text-sm font-medium text-gray-700">{c.color}</span>
                                                                            </div>

                                                                            {c.productOfferApplied && Number(c.totalPrice) === 0 ? (
                                                                                <div className="text-green-700 font-semibold">
                                                                                    🎁 FREE under Range Offer (₹{fmt(c.pricePerItem)} × {c.quantity})
                                                                                </div>
                                                                            ) : ""}



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

                                                                        {/* Price */}
                                                                        <div className="pl-2 sm:pl-4 text-sm mt-2">
                                                                            {/* {isBulkActive ? (
                                                                                <>
                                                                                    <div>
                                                                                        <span className="line-through text-gray-400">
                                                                                            ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-green-700 font-semibold">
                                                                                        ₹{fmt(bulkPrice)} × {c.quantity} = ₹{fmt(discountedTotal)} ✅
                                                                                    </div>
                                                                                    <div className="text-xs text-green-600">You saved ₹{fmt(saved)} 🎉</div>
                                                                                </>
                                                                            ) : (
                                                                                <div>
                                                                                    ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                </div>
                                                                            )} */}
                                                                            {/* {c.productOfferApplied && Number(c.totalPrice) === 0 ? (
                                                                                <div className="text-green-700 font-semibold">
                                                                                    🎁 FREE under Range Offer (₹{fmt(colorPrice)} × {c.quantity})
                                                                                </div>
                                                                            ) : isBulkActive ? (
                                                                                <>
                                                                                    <div>
                                                                                        <span className="line-through text-gray-400">
                                                                                            ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-green-700 font-semibold">
                                                                                        ₹{fmt(bulkPrice)} × {c.quantity} = ₹{fmt(discountedTotal)} ✅
                                                                                    </div>
                                                                                    <div className="text-xs text-green-600">You saved ₹{fmt(saved)} 🎉</div>
                                                                                </>
                                                                            ) : (
                                                                                <div>
                                                                                    ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                </div>
                                                                            )} */}
                                                                            {/* RANGE OFFER UI */}
                                                                            {item.productOfferApplied && item.productOffer?.name === "Range" ? (
                                                                                // (() => {
                                                                                //     const offer = item.productOffer;

                                                                                //     const free = offer.freeItems.find(f => f.id === c.itemId);
                                                                                //     const paid = offer.paidItems.find(p => p.id === c.itemId);

                                                                                //     if (free) {
                                                                                //         return (
                                                                                //             <div className="text-green-700 font-semibold">
                                                                                //                 🎁 FREE under Range Offer (₹{fmt(c.pricePerItem)} × {free.freeQty})
                                                                                //             </div>
                                                                                //         );
                                                                                //     }

                                                                                //     if (paid) {
                                                                                //         const total = paid.paidQty * c.pricePerItem;
                                                                                //         return (
                                                                                //             <div className="text-blue-700 font-semibold">
                                                                                //                 ₹{fmt(c.pricePerItem)} × {paid.paidQty} = ₹{fmt(total)}
                                                                                //             </div>
                                                                                //         );
                                                                                //     }

                                                                                //     return (
                                                                                //         <div>
                                                                                //             ₹{fmt(c.pricePerItem)} × {c.quantity} = ₹{fmt(c.pricePerItem * c.quantity)}
                                                                                //         </div>
                                                                                //     );
                                                                                // })()
                                                                                (() => {
                                                                                    const offer = item.productOffer;
                                                                                    console.log("variationandfreeItems", c.variationId, offer.freeItems)

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

                                                                                            {/* PAID ITEMS */}
                                                                                            {paid && (
                                                                                                <div className="text-gray-700 font-semibold">
                                                                                                    ₹{fmt(c.pricePerItem)} × {paid.paidQty} = ₹{fmt(c.pricePerItem * paid.paidQty)}
                                                                                                </div>
                                                                                            )}

                                                                                            {/* FREE ITEMS */}
                                                                                            {free && (
                                                                                                <div className="text-green-700 font-semibold">
                                                                                                    🎁 {free.freeQty} FREE (You saved ₹{fmt(c.pricePerItem * free.freeQty)})
                                                                                                </div>
                                                                                            )}

                                                                                            {/* NO OFFER ON THIS COLOR → NORMAL PRICE */}
                                                                                            {!paid && !free && (
                                                                                                <div>
                                                                                                    ₹{fmt(c.pricePerItem)} × {c.quantity} = ₹{fmt(c.pricePerItem * c.quantity)}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                })()
                                                                            ) : (
                                                                                /* existing bulk / normal logic */
                                                                                isBulkActive ? (
                                                                                    <>
                                                                                        <div>
                                                                                            <span className="line-through text-gray-400">
                                                                                                ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="text-green-700 font-semibold">
                                                                                            ₹{fmt(bulkPrice)} × {c.quantity} = ₹{fmt(discountedTotal)} ✅
                                                                                        </div>
                                                                                        <div className="text-xs text-green-600">You saved ₹{fmt(saved)} 🎉</div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div>
                                                                                        ₹{fmt(colorPrice)} × {c.quantity} = ₹{fmt(originalTotal)}
                                                                                    </div>
                                                                                )
                                                                            )}


                                                                        </div>

                                                                        {/* Remove button */}
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


                                                        <div className="text-sm font-bold text-gray-900 mt-4 border-t pt-2 flex justify-between items-start">

                                                            {/* LEFT SIDE — TOTAL QUANTITY */}
                                                            <div className="text-left text-gray-700 font-semibold">
                                                                Total Qty:&nbsp;
                                                                {item.colors.reduce((sum, c) => sum + Number(c.quantity), 0)}
                                                            </div>

                                                            {/* RIGHT SIDE — TOTAL + SAVINGS */}
                                                            <div className="text-right">
                                                                {(() => {
                                                                    const totalOriginal = item.colors.reduce(
                                                                        (sum, c) => sum + Number(c.pricePerItem) * Number(c.quantity),
                                                                        0
                                                                    );

                                                                    const offer = item.productOfferApplied ? item.productOffer : null;

                                                                    // RANGE OFFER TOTAL (paid only)
                                                                    let totalAfterOffer = 0;

                                                                    if (offer && offer.paidItems && offer.freeItems) {
                                                                        totalAfterOffer = offer.paidItems.reduce((sum, p) => {
                                                                            const color = item.colors.find(c => c.itemId === p.id || c.id === p.id);

                                                                            if (!color) return sum; // prevent crash if color not found

                                                                            return sum + (Number(color.pricePerItem) * Number(p.paidQty));
                                                                        }, 0);
                                                                    } else {
                                                                        // BULK OR NORMAL
                                                                        totalAfterOffer = item.colors.reduce((sum, c) => {
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
                                                                    }

                                                                    const isDiscounted = totalAfterOffer < totalOriginal;
                                                                    const savings = totalOriginal - totalAfterOffer;

                                                                    return (
                                                                        <div className="flex flex-col items-end">
                                                                            <div>
                                                                                Total:&nbsp;
                                                                                {isDiscounted ? (
                                                                                    <>
                                                                                        <span className="line-through text-gray-400 mr-1">
                                                                                            ₹{fmt(totalOriginal)}
                                                                                        </span>
                                                                                        <span className="text-green-700">₹{fmt(totalAfterOffer)} ✅</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span>₹{fmt(totalOriginal)}</span>
                                                                                )}
                                                                            </div>

                                                                            {/* SAVINGS LINE */}
                                                                            {isDiscounted && (
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