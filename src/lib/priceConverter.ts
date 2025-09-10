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

export function convertProducts(products, countryCode, countryPricingList) {
    return products.map((p) => {
        const { price, currency, currencySymbol } = convertPrice(Number(p.price), countryCode, countryPricingList);

        return {
            ...p,
            price,
            currency,
            currencySymbol,
            variations: p.variations?.map((v) => {
                const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
                    convertPrice(Number(v.price), countryCode, countryPricingList);

                return {
                    ...v,
                    price: vPrice,
                    currency: vCurrency,
                    currencySymbol: vSymbol,
                };
            }),
        };
    });
}
