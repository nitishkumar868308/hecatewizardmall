"use client";
import { useState, useEffect } from "react";

export const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=cca3,name,currencies"
                );
                const data = await res.json();

                if (!Array.isArray(data)) {
                    console.error("Expected an array but got:", data);
                    setError("Invalid data format");
                    return;
                }

                const formatted = data.map((c) => {
                    const currencyKey = c.currencies ? Object.keys(c.currencies)[0] : null;
                    const currencySymbol =
                        c.currencies && currencyKey && c.currencies[currencyKey]?.symbol
                            ? c.currencies[currencyKey].symbol
                            : "";

                    return {
                        code: c.cca3,
                        name: c.name?.common || "",
                        currency: currencyKey || "",
                        currencySymbol,
                    };
                });

                setCountries(formatted);
                setFilteredCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
                setError(err.message || "Failed to fetch countries");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, filteredCountries, setFilteredCountries, loading, error };
};
