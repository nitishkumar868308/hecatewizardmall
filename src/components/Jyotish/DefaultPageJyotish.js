import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Topbar from '../Include/Topbar';

const DefaultPageJyotish = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#0B0C10] selection:bg-[#66FCF1]/30 selection:text-[#66FCF1]">

            {/* Navigation Wrapper: Isse Topbar aur Header ek ke niche ek rahenge */}
            <div className="fixed top-0 left-0 w-full z-[100] flex flex-col">
                <Topbar />
                <Header />
            </div>

            <main className="flex-grow w-full relative pt-10 md:pt-36">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default DefaultPageJyotish;