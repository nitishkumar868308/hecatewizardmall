

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

// export function convertPrice(basePrice, countryCode, countryPricingList) {
//     const country = countryPricingList.find(c => c.code === countryCode)
//         || countryPricingList.find(c => c.code === "IN");

//     const multiplier = country?.multiplier || 1;
//     const currency = country?.currency || "INR";
//     const currencySymbol = country?.currencySymbol || "₹";

//     return {
//         price: Math.round(basePrice * multiplier),
//         currency,
//         currencySymbol,
//     };
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

//         // ✅ matched link by normalized country if exists
//         const matchedMarketLink = p.marketLinks?.find(
//             (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//         ) || null;

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
//             matchedMarketLink,       // only the matched country link
//             marketLinks: p.marketLinks || [], // keep full list for frontend usage
//         };
//     });
// }

import { fetchConversionRates } from "./CustomHook/conversionRate"

export async function convertPrice(basePriceINR, targetCountryCode, countryPricingList) {
    const countryPricingListRates = await fetchConversionRates();

    // Always have a base country fallback
    const baseCountry = countryPricingList.find(c => c.code === "IN") || { code: "IN", currency: "INR", currencySymbol: "₹", multiplier: 1 };

    const targetCountry = countryPricingList.find(c => c.code === targetCountryCode) || baseCountry;

    const matchedCountry =
        countryPricingListRates.find(c => c.currency === targetCountry.currency) ||
        { conversionRate: 1, currency: targetCountry.currency || "INR", currencySymbol: targetCountry.currencySymbol || "₹" };

    const conversionRate = matchedCountry?.conversionRate || 1;
    const multiplier = targetCountry?.multiplier || 1;

    const priceInTargetCurrency = Number(basePriceINR) || 0;
    const finalPrice = priceInTargetCurrency * conversionRate * multiplier;

    return {
        price: Math.round(finalPrice * 100) / 100,
        currency: matchedCountry.currency || "INR",
        currencySymbol: matchedCountry.currencySymbol || "₹",
    };
}


export async function convertProducts(products, countryCode, countryPricingList) {
    const normalizedCountryCode =
        countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

    const convertedProducts = await Promise.all(
        (products || []).map(async (p) => {
            const basePrice = Number(p.price) || 0;
            const { price, currency, currencySymbol } = await convertPrice(basePrice, countryCode, countryPricingList);

            const matchedMarketLink =
                p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

            const variations = await Promise.all(
                (p.variations || []).map(async (v) => {
                    const varPrice = Number(v.price) || 0;
                    const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
                        await convertPrice(varPrice, countryCode, countryPricingList);

                    return {
                        ...v,
                        price: vPrice,
                        currency: vCurrency,
                        currencySymbol: vSymbol,
                    };
                })
            );

            return {
                ...p,
                price,
                currency,
                currencySymbol,
                variations,
                matchedMarketLink,
                marketLinks: p.marketLinks || [],
            };
        })
    );

    return convertedProducts;
}

let conversionRatesCache = null;

export async function initConversionRatesCache() {
    if (!conversionRatesCache) {
        conversionRatesCache = await fetchConversionRates();
    }
}

export function convertProductsFast(products, countryCode, countryPricingList) {
    if (!conversionRatesCache) throw new Error("Conversion rates not initialized");

    const normalizedCountryCode = (countryCode.length === 3 ? countryCode.slice(0, 2) : countryCode).toUpperCase();

    const countryPricingMap = {};
    countryPricingList.forEach(c => countryPricingMap[c.code.toUpperCase()] = c);

    const conversionRatesMap = {};
    conversionRatesCache.forEach(c => conversionRatesMap[c.currency] = c);

    const targetCountry = countryPricingMap[normalizedCountryCode] || countryPricingMap["IN"] || { multiplier: 1, currency: "INR", currencySymbol: "₹" };
    const matchedCountry = conversionRatesMap[targetCountry.currency] || { conversionRate: 1, currency: targetCountry.currency, currencySymbol: targetCountry.currencySymbol };

    const multiplier = (matchedCountry.conversionRate || 1) * (targetCountry.multiplier || 1);

    return products.map(p => {
        const price = Math.round((Number(p.price) || 0) * multiplier * 100) / 100;

        const variations = (p.variations || []).map(v => ({
            ...v,
            price: Math.round((Number(v.price) || 0) * multiplier * 100) / 100,
            currency: matchedCountry.currency,
            currencySymbol: matchedCountry.currencySymbol
        }));

        const matchedMarketLink = p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

        return {
            ...p,
            price,
            currency: matchedCountry.currency,
            currencySymbol: matchedCountry.currencySymbol,
            variations,
            matchedMarketLink,
            marketLinks: p.marketLinks || [],
        };
    });
}





// export async function convertPrice(basePriceINR, targetCountryCode, countryPricingList) {
//     const countryPricingListRates = await fetchConversionRates();
//     const baseCountry = countryPricingList.find(c => c.code === "IN");
//     const targetCountry = countryPricingList.find(c => c.code === targetCountryCode) || baseCountry;

//     const matchedCountry = countryPricingListRates.find(
//         (c) => c.currency === targetCountry.currency
//     ) || { conversionRate: 1 };
//     console.log("matchedCountry", matchedCountry)
//     const conversionRate = matchedCountry?.conversionRate || 1;
//     console.log("conversionRate", conversionRate)
//     const multiplier = targetCountry?.multiplier || 1;

//     const priceInTargetCurrency = basePriceINR * conversionRate;
//     const finalPrice = priceInTargetCurrency * multiplier;

//     return {
//         price: Math.round(finalPrice * 100) / 100,
//         currency: targetCountry?.currency || "INR",
//         currencySymbol: targetCountry?.currencySymbol || "₹",
//     };
// }

// export async function convertProducts(products, countryCode, countryPricingList) {
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     const convertedProducts = await Promise.all(
//         products.map(async (p) => {
//             const basePrice = Number(p.price) || 0; // ensure numeric
//             const { price, currency, currencySymbol } = await convertPrice(
//                 basePrice,
//                 countryCode,
//                 countryPricingList
//             );

//             const matchedMarketLink =
//                 p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

//             const variations = await Promise.all(
//                 (p.variations || []).map(async (v) => {
//                     const varPrice = Number(v.price) || 0; // ensure numeric
//                     const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                         await convertPrice(varPrice, countryCode, countryPricingList);

//                     return {
//                         ...v,
//                         price: vPrice,
//                         currency: vCurrency,
//                         currencySymbol: vSymbol,
//                     };
//                 })
//             );

//             return {
//                 ...p,
//                 price,
//                 currency,
//                 currencySymbol,
//                 variations,
//                 matchedMarketLink,
//                 marketLinks: p.marketLinks || [],
//             };
//         })
//     );

//     return convertedProducts;
// }


// export async function convertProducts(products, countryCode, countryPricingList) {
//     console.log("productsbackend", products);

//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     // Map products asynchronously
//     const convertedProducts = await Promise.all(
//         products.map(async (p) => {
//             const { price, currency, currencySymbol } = await convertPrice(
//                 Number(p.price),
//                 countryCode,
//                 countryPricingList
//             );

//             const matchedMarketLink =
//                 p.marketLinks?.find(
//                     (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//                 ) || null;

//             const variations = await Promise.all(
//                 (p.variations || []).map(async (v) => {
//                     const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                         await convertPrice(Number(v.price), countryCode, countryPricingList);

//                     return {
//                         ...v,
//                         price: vPrice,
//                         currency: vCurrency,
//                         currencySymbol: vSymbol,
//                     };
//                 })
//             );

//             return {
//                 ...p,
//                 price,
//                 currency,
//                 currencySymbol,
//                 variations,
//                 matchedMarketLink,
//                 marketLinks: p.marketLinks || [],
//             };
//         })
//     );

//     return convertedProducts;
// }

// export function convertProducts(products, countryCode, countryPricingList) {
//     console.log("productsbackend", products)
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(
//             Number(p.price),
//             countryCode,
//             countryPricingList
//         );

//         const matchedMarketLink = p.marketLinks?.find(
//             (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//         ) || null;

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } = convertPrice(
//                     Number(v.price),
//                     countryCode,
//                     countryPricingList
//                 );

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//             matchedMarketLink,
//             marketLinks: p.marketLinks || [],
//         };
//     });
// }

