"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/app/redux/slices/book_consultant/services/serviceSlice";

const Services = () => {
    const dispatch = useDispatch();
    const { services } = useSelector((state) => state.services);

    // ✅ Fetch services
    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    // ✅ Only active services
    const activeServices = services?.filter(
        (s) => s.active === true || s.status === "ACTIVE"
    );

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-[#0B0C10]">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-2 text-[#66FCF1]">
                    Our Services
                </h2>
                <div className="h-1 w-20 bg-[#66FCF1] rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {activeServices?.map((service) => (
                    <motion.div
                        key={service.id}
                        whileHover={{ y: -8, borderColor: "#66FCF1" }}
                        className="group bg-[#1F2833]/40 p-8 rounded-3xl border border-white/5 transition-all text-center cursor-pointer"
                    >
                        <div className="w-14 h-14 bg-[#0B0C10] rounded-2xl mx-auto mb-5 flex items-center justify-center text-[#66FCF1] group-hover:rotate-12 transition-transform shadow-lg">
                            <Star fill="currentColor" size={22} />
                        </div>

                        {/* ✅ Dynamic title */}
                        <h3 className="font-bold text-white text-md md:text-lg">
                            {service.title}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Services;