"use client";
import React, { useEffect } from "react";
import { Star, ArrowRight, MessageSquare, Phone, Award, Globe2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchAstrologers } from "@/app/redux/slices/jyotish/Register/RegisterSlice";

const FeaturedAstrologers = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { astrologers } = useSelector((state) => state.jyotishRegister);

    useEffect(() => {
        dispatch(fetchAstrologers());
    }, [dispatch]);

    const topAstrologers = astrologers
        ?.filter((astro) => astro.isTop && astro.isApproved && astro.isActive)
        ?.sort((a, b) => a.topRank - b.topRank)
        ?.slice(0, 6);

    // ✅ Card click handler
    const handleCardClick = (id) => {
        router.push(`/jyotish/astrologer/${id}`);
    };

    return (
        <section className="py-12 sm:py-20 px-4 bg-[#0B0C10] overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Expert <span className="text-[#66FCF1]">Astrologers</span>
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm sm:text-base">
                            Consult with India's most trusted psychic guides
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/consult-now")}
                        className="group flex items-center gap-2 text-[#66FCF1] font-bold hover:bg-[#66FCF1]/10 px-4 py-2 rounded-lg transition-all"
                    >
                        Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {topAstrologers?.map((astrologer, i) => {
                        const serviceNames = astrologer?.services?.map((s) => s.serviceName) || [];
                        const price = astrologer?.services?.[0]?.price || 0;
                        const currency = astrologer?.services?.[0]?.currencySymbol || "₹";
                        const isOnline = astrologer?.isOnline;

                        return (
                            <div
                                key={astrologer.id || i}
                                onClick={() => handleCardClick(astrologer.id)} // ✅ Full card clickable
                                className="cursor-pointer relative bg-[#1F2833] border border-white/10 rounded-3xl p-5 hover:border-[#45A29E] transition-all duration-500 group"
                            >
                                {/* Image */}
                                <div className="flex gap-5 mb-6">
                                    <div className="relative shrink-0">
                                        <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-[#1F2833] z-10 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                        <img
                                            src={astrologer?.profile?.image || `https://i.pravatar.cc/150?u=${astrologer.id}`}
                                            alt={astrologer.displayName}
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#66FCF1]/10 text-[#66FCF1] text-[10px] px-2 py-0.5 rounded">
                                                Top Rated
                                            </span>
                                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                                <Star size={14} fill="currentColor" /> 4.9
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white truncate">
                                            {astrologer.displayName || astrologer.fullName}
                                        </h3>

                                        <p className="text-gray-400 text-xs truncate">
                                            {serviceNames.slice(0, 2).join(", ")}
                                            {serviceNames.length > 2 && " +more"}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-[#0B0C10]/50 p-3 rounded-2xl">
                                        <p className="text-white text-sm font-semibold">
                                            {astrologer?.profile?.experience || 0} Years
                                        </p>
                                    </div>
                                    <div className="bg-[#0B0C10]/50 p-3 rounded-2xl">
                                        <p className="text-white text-sm font-semibold truncate">
                                            {Array.isArray(astrologer?.profile?.languages)
                                                ? astrologer.profile.languages[0]
                                                : "Hindi"}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <p className="text-[#66FCF1] text-lg font-bold">
                                        {currency}{price}/min
                                    </p>

                                    <div className="flex gap-2">
                                        {/* ❌ Stop navigation */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Chat clicked");
                                            }}
                                            className="px-4 py-2 rounded-xl bg-[#66FCF1] text-black font-bold text-sm"
                                        >
                                            <MessageSquare size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Call clicked");
                                            }}
                                            className="px-4 py-2 rounded-xl bg-[#66FCF1] text-black font-bold text-sm"
                                        >
                                            <Phone size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedAstrologers;