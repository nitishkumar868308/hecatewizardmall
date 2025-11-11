 const updateGroupBulkStatus = async (bulkStatus, isBulkEligible, newQty) => {
        const { sameGroupItems, variationBulkPrice, variationBulkMinQty } = bulkStatus;

        await Promise.all(
            sameGroupItems.map(async (item) => {
                let offerApplied = false;
                let itemBulkPrice = null;
                let itemBulkMinQty = null;
                let totalPrice = 0;

                // 🧩 Determine per item variation bulk price
                const itemVariation = product?.variations?.find(
                    (v) => v.id === item.variationId
                );
                const basePrice = Number(item.pricePerItem);

                if (isBulkEligible) {
                    offerApplied = true;
                    itemBulkPrice =
                        Number(itemVariation?.bulkPrice) || Number(item.bulkPrice) || basePrice;
                    itemBulkMinQty = variationBulkMinQty;
                    totalPrice = itemBulkPrice * (item.id === cartItem.id ? newQty : item.quantity);
                } else {
                    // Offer revoked
                    offerApplied = false;
                    itemBulkPrice = null;
                    itemBulkMinQty = null;
                    totalPrice = basePrice * (item.id === cartItem.id ? newQty : item.quantity);
                }

                // 🧩 Final payload for DB
                const payload = {
                    id: item.id,
                    quantity: item.id === cartItem.id ? newQty : item.quantity,
                    offerApplied,
                    bulkPrice: itemBulkPrice,
                    bulkMinQty: itemBulkMinQty,
                    totalPrice,
                };

                console.log("🔄 Updating cart item:", payload);

                await dispatch(updateCart(payload));
            })
        );

        console.log("✅ Bulk group updated in DB:", {
            offerApplied: isBulkEligible,
            sameGroupItems: sameGroupItems.map((i) => ({
                color: i.attributes?.color,
                qty: i.quantity,
            })),
        });

        // 🔁 Optional but recommended: re-fetch cart
        await dispatch(fetchCart());
    };

        const computeBulkStatus = ({ product, selectedVariation, selectedAttributes, userCart, quantity, cartItem }) => {
        const productMinQty = Number(product?.minQuantity || 0);
        const variationBulkPrice = Number(selectedVariation?.bulkPrice ?? 0);
        const variationBulkMinQty = Number(selectedVariation?.bulkMinQty ?? productMinQty) || 0;
        const requiredQty = variationBulkMinQty || productMinQty;

        // 🎯 Flatten attributes except color
        const flatAttributes = {};
        Object.entries(selectedAttributes || {}).forEach(([k, v]) => {
            if (v && v !== "N/A") flatAttributes[k.toLowerCase()] = v;
        });

        const coreAttributes = Object.entries(flatAttributes)
            .filter(([key]) => !["color", "colour"].includes(key.toLowerCase()));
        const coreKey = coreAttributes.map(([k, v]) => `${k}:${v}`).join("|");

        // 🧩 Find same group items
        const sameGroupItems = (Array.isArray(userCart) ? userCart : []).filter(item => {
            if (!item) return false;
            if (item.productId !== product.id) return false;
            const itemCoreKey = Object.entries(item.attributes || {})
                .filter(([k]) => !["color", "colour"].includes(k.toLowerCase()))
                .map(([k, v]) => `${k}:${v}`)
                .join("|");
            return itemCoreKey === coreKey;
        });

        // 🧮 FIXED: replace current item's qty with newQty
        const totalGroupQty = sameGroupItems.reduce((sum, item) => {
            if (item.id === cartItem?.id) {
                return sum + Number(quantity || 0);
            }
            return sum + (Number(item.quantity) || 0);
        }, 0);

        // const hasOfferApplied = sameGroupItems.some(it => it.offerApplied === true);
        // const validVariationBulk =
        //     selectedVariation?.bulkPrice != null &&
        //     selectedVariation?.bulkMinQty != null &&
        //     selectedVariation?.bulkPrice > 0 &&
        //     selectedVariation?.bulkMinQty > 0;

        // const hasBulkOffer = hasOfferApplied || validVariationBulk;
        // const eligible = hasBulkOffer && totalGroupQty >= requiredQty;
        const hasOfferApplied = sameGroupItems.some(it => it.offerApplied === true);

        // ✅ VALID bulk offer available if price and minQty are > 0
        const validVariationBulk = variationBulkPrice > 0 && variationBulkMinQty > 0;

        // ✅ Bulk eligibility logic
        const hasBulkOffer = true; // <— 🔥 force check always
        const eligible = totalGroupQty >= variationBulkMinQty; // <— 🔥 simplified clean condition

        console.log("💡 Bulk Check (Final)", {
            totalGroupQty,
            variationBulkMinQty,
            variationBulkPrice,
            validVariationBulk,
            eligible,
        });

        console.log("🧩 Bulk Debug =>", {
            productName: product?.name,
            sameGroupItems: sameGroupItems.map(i => ({
                id: i.id,
                qty: i.quantity,
                offerApplied: i.offerApplied,
            })),
            totalGroupQty,
            requiredQty,
            variationBulkPrice,
            variationBulkMinQty,
            validVariationBulk,
            eligible,
        });

        return {
            eligible,
            requiredQty,
            totalGroupQty,
            variationBulkPrice,
            variationBulkMinQty,
            sameGroupItems,
        };
    };