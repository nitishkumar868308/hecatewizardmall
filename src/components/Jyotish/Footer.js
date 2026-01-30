import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#0B0C10] border-t border-[#45A29E]/10 pt-16 pb-8 px-6 overflow-hidden relative">
            {/* Background Glow Effect */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#66FCF1] opacity-[0.03] blur-[100px] rounded-full"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {/* Brand Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-[#66FCF1] flex items-center justify-center text-[#66FCF1] text-xs">✨</div>
                        <span className="text-white font-black text-xl tracking-tighter uppercase">Jyotish<span className="text-[#66FCF1]">Veda</span></span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Merging ancient Vedic wisdom with modern technology to guide your celestial journey. Your destiny, decoded.
                    </p>
                    <div className="flex gap-4">
                        {['FB', 'IG', 'TW', 'YT'].map((soc) => (
                            <div key={soc} className="w-8 h-8 rounded-lg border border-[#45A29E]/30 flex items-center justify-center text-[10px] text-[#66FCF1] hover:border-[#66FCF1] hover:bg-[#66FCF1]/10 cursor-pointer transition-all">
                                {soc}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em] border-b border-[#66FCF1]/30 pb-2 inline-block">Divination</h4>
                    <ul className="space-y-3 text-sm">
                        {['Vedic Astrology', 'Tarot Card Reading', 'Palmistry', 'Gemology'].map(item => (
                            <li key={item} className="text-gray-500 hover:text-[#66FCF1] cursor-pointer transition-colors flex items-center gap-2">
                                <span className="text-[10px]">✦</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em] border-b border-[#66FCF1]/30 pb-2 inline-block">Navigation</h4>
                    <ul className="space-y-3 text-sm">
                        {['About Our Saints', 'Contact Support', 'Privacy Policy', 'Terms of Fate'].map(item => (
                            <li key={item} className="text-gray-500 hover:text-[#66FCF1] cursor-pointer transition-colors">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] border-b border-[#66FCF1]/30 pb-2 inline-block">Cosmic Alerts</h4>
                    <p className="text-xs text-gray-500">Subscribe to get your weekly planetary transit reports.</p>
                    <div className="flex bg-[#1F2833] rounded-xl p-1 border border-[#45A29E]/20 focus-within:border-[#66FCF1] transition-all">
                        <input
                            type="email"
                            placeholder="Email..."
                            className="bg-transparent px-3 py-2 text-xs w-full focus:outline-none text-white"
                        />
                        <button className="bg-[#66FCF1] text-[#0B0C10] px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all">
                            JOIN
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#45A29E]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2024 JyotishVeda • Built for the awakened</p>
                <div className="flex gap-6 text-[10px] text-gray-600 uppercase tracking-widest">
                    <span>Stars Align at 23.5°</span>
                    <span>Server: Cosmic-1</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;