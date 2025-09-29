export function convertPrice(basePrice, countryCode, countryPricingList) {
    const country = countryPricingList.find(c => c.code === countryCode)
        || countryPricingList.find(c => c.code === "IN");

    const multiplier = country?.multiplier || 1;
    const currency = country?.currency || "INR";
    const currencySymbol = country?.currencySymbol || "₹";

    return {
        price: Math.round(basePrice * multiplier),
        currency,
        currencySymbol,
    };
}

// export function convertProducts(products, countryCode, countryPricingList) {
//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(Number(p.price), countryCode, countryPricingList);

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                     convertPrice(Number(v.price), countryCode, countryPricingList);

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//         };
//     });
// }

// export function convertProducts(products, countryCode, countryPricingList) {
//     // Normalize 3-letter to 2-letter
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(
//             Number(p.price),
//             countryCode,
//             countryPricingList
//         );

//         // ✅ matched link by normalized country
//         const matchedMarketLink =
//             p.marketLinks?.find(
//                 (link) =>
//                     link.countryCode?.toUpperCase() === normalizedCountryCode
//             ) || null;

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const {
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 } = convertPrice(Number(v.price), countryCode, countryPricingList);

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//             matchedMarketLink, // attach matched link
//             marketLinks: undefined, // hide full list if not needed
//         };
//     });
// }

export function convertProducts(products, countryCode, countryPricingList) {
    // Normalize 3-letter to 2-letter
    const normalizedCountryCode =
        countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

    return products.map((p) => {
        const { price, currency, currencySymbol } = convertPrice(
            Number(p.price),
            countryCode,
            countryPricingList
        );

        // ✅ matched link by normalized country if exists
        const matchedMarketLink = p.marketLinks?.find(
            (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
        ) || null;

        return {
            ...p,
            price,
            currency,
            currencySymbol,
            variations: p.variations?.map((v) => {
                const {
                    price: vPrice,
                    currency: vCurrency,
                    currencySymbol: vSymbol,
                } = convertPrice(Number(v.price), countryCode, countryPricingList);

                return {
                    ...v,
                    price: vPrice,
                    currency: vCurrency,
                    currencySymbol: vSymbol,
                };
            }),
            matchedMarketLink,       // only the matched country link
            marketLinks: p.marketLinks || [], // keep full list for frontend usage
        };
    });
}


