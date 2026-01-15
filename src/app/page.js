"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCountry } from "@/app/redux/slices/countrySlice";
import { fetchStates } from "@/app/redux/slices/state/addStateSlice";
import { useCountries } from "@/lib/CustomHook/useCountries";
import HomeSlider from "@/components/HomeSlider/HomeSlider";
import ProductSlider from "@/components/Product/Product";
import TestMonial from "@/components/Testmonial/TestMonial";
import StorySection from "@/components/StorySection/StorySection";
import Section1 from "@/components/HomePage/Section1";
import ProductHomePage from "@/components/HomePage/prdouctHomePage";
import Section2 from "@/components/HomePage/Section2";

export default function Home() {
  const dispatch = useDispatch();
  const { countries } = useCountries();

  useEffect(() => {
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
      dispatch(setCountry(savedCountry));
      return;
    }

    // ✅ Call geolocation prompt only if countries loaded
    if (!countries?.length) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );

          const data = await res.json();

          const matchedCountry = countries.find(
            (c) => c.name.toLowerCase() === data.countryName.toLowerCase()
          );

          const countryISO3 = matchedCountry?.code || "IND";

          localStorage.setItem("selectedCountry", countryISO3);
          localStorage.setItem("selectedState", data.principalSubdivision);

          dispatch(setCountry(countryISO3));
          dispatch(fetchStates());
        } catch (err) {
          console.log("Location fetch error → fallback to IND");
          dispatch(setCountry("IND"));
          localStorage.setItem("selectedCountry", "IND");
        }
      },
      () => {
        // ❌ Only fallback if user denies
        console.log("Location denied → fallback to IND");
        dispatch(setCountry("IND"));
        localStorage.setItem("selectedCountry", "IND");
      }
    );
  }, [dispatch, countries]);



  return (
    <>
      <HomeSlider />
      <StorySection />
      <Section1 />
      <ProductHomePage />
      <Section2 />
      {/* <ProductSlider showSection={["featured", "new"]} />
      <TestMonial /> */}
    </>
  );
}
