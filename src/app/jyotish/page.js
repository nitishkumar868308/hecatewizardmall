import React from 'react';
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish';
import Astrologers from '@/components/Jyotish/HomePage/Astrologers';
import Services from '@/components/Jyotish/HomePage/Services';
import HeroSection from '@/components/Jyotish/HomePage/HeroSection';
import TrustSection from '@/components/Jyotish/HomePage/TrustSection';
import HowItWorks from '@/components/Jyotish/HomePage/HowItWorks';
import CTASection from '@/components/Jyotish/HomePage/CTASection';

const AstrologyHome = () => {
    return (
        <>
            <DefaultPageJyotish>
                <div className="min-h-screen bg-[#0B0C10] text-white font-sans">
                    <HeroSection />
                    <Services />
                    <Astrologers />
                    <TrustSection />
                    <HowItWorks />
                    <CTASection />
                </div>
            </DefaultPageJyotish>
        </>

    );
};

export default AstrologyHome;