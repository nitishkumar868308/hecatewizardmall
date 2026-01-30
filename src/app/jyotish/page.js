import React from 'react';
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish';

const AstrologyHome = () => {
    return (
        <>
            <DefaultPageJyotish>
                <div className="min-h-screen bg-[#0B0C10] text-white font-sans">
                    

                    {/* --- Hero Section --- */}
                    <section className="relative py-20 px-6 text-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#66FCF1] opacity-5 blur-[120px] rounded-full"></div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                            Consult Indias Best <br />
                            <span className="text-[#66FCF1]">Astrologers Live</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                            Chat with experts starting at just ₹1. Reveal your destiny through Vedic Astrology, Tarot, and Vastu.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-transparent border-2 border-[#66FCF1] text-[#66FCF1] px-8 py-3 rounded-lg font-bold hover:bg-[#66FCF1] hover:text-[#0B0C10] transition-all">
                                Chat with Astrologer
                            </button>
                            <button className="bg-[#1F2833] border-2 border-[#1F2833] px-8 py-3 rounded-lg font-bold hover:border-[#66FCF1] transition-all">
                                Book a Call
                            </button>
                        </div>
                    </section>

                    {/* --- Services Grid --- */}
                    <section className="py-16 px-6 max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-10 border-l-4 border-[#66FCF1] pl-4">Our Services</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {['Daily Horoscope', 'Kundli Matching', 'Tarot Reading', 'Vastu Consultation'].map((service) => (
                                <div key={service} className="bg-[#1F2833] p-6 rounded-2xl hover:border-[#66FCF1] border border-transparent transition group cursor-pointer">
                                    <div className="w-12 h-12 bg-[#0B0C10] rounded-lg mb-4 flex items-center justify-center text-[#66FCF1] group-hover:scale-110 transition">
                                        ✨
                                    </div>
                                    <h3 className="font-semibold text-sm md:text-base">{service}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- Live Astrologers --- */}
                    <section className="py-16 px-6 bg-[#1F2833]/30">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex justify-between items-end mb-10">
                                <h2 className="text-2xl font-bold border-l-4 border-[#66FCF1] pl-4">Live Astrologers</h2>
                                <button className="text-[#66FCF1] text-sm underline">View All</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="bg-[#0B0C10] p-5 rounded-3xl border border-[#45A29E]/30 relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">
                                            LIVE
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#66FCF1] to-blue-500 p-1">
                                                <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center italic text-xs">Photo</div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Astro Sharma</h4>
                                                <p className="text-xs text-gray-400">Vedic, Tarot, Vastu</p>
                                                <div className="flex text-[#66FCF1] mt-1 text-xs">
                                                    ★★★★★ <span className="ml-2 text-white">(500+ orders)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full mt-6 py-3 rounded-xl border border-[#66FCF1] text-[#66FCF1] font-bold group-hover:bg-[#66FCF1] group-hover:text-[#0B0C10] transition-all">
                                            Chat Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </DefaultPageJyotish>
        </>

    );
};

export default AstrologyHome;