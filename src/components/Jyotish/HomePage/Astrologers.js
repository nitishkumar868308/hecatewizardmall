import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

const FeaturedAstrologers = () => {
    const experts = [
        { name: "Acharya Rahul", exp: "12 Yrs", price: "25", img: "11" },
        { name: "Sonia Tarot", exp: "8 Yrs", price: "15", img: "12" },
        { name: "Pt. Bhaskar", exp: "20 Yrs", price: "50", img: "13" },
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-[#0B0C10]">
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-white">Top Astrologers</h2>
                <button className="text-[#66FCF1] flex items-center gap-2 font-bold group">
                    View All <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {experts.map((astrologer, i) => (
                    <div key={i} className="bg-[#1F2833] rounded-[2.5rem] overflow-hidden border border-white/5 p-5 hover:border-[#66FCF1]/30 transition-all">
                        <div className="relative mb-5">
                            <img src={`https://i.pravatar.cc/300?img=${astrologer.img}`} alt="expert" className="w-full h-64 object-cover rounded-[2rem]" />
                            <div className="absolute top-4 right-4 bg-[#0B0C10]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-[#66FCF1] font-bold text-sm">
                                <Star size={12} fill="#66FCF1" /> 4.9
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{astrologer.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">Vedic Astrology • {astrologer.exp}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="font-bold text-[#66FCF1]">₹{astrologer.price}/min</span>
                            <button className="bg-[#66FCF1] text-[#0B0C10] px-6 py-2 rounded-full font-bold text-sm hover:shadow-[0_0_15px_rgba(102,252,241,0.4)] transition-all">
                                Chat
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedAstrologers;