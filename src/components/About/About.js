"use client";
import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Users, Package, Award, Headphones } from "lucide-react"
import { usePathname } from "next/navigation";
import Image from "next/image";

const About = () => {
    const pathname = usePathname();
    const isXpress = pathname.includes("/hecate-quickGo");
    return (
        <>
            {isXpress ? (
                <section className="bg-white text-gray-900 font-functionPro">

                    {/* ===== INTRO / ABOUT HEADER ===== */}
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                                About <span className="text-[#264757]">Hecate Wizard Mall</span>
                            </h1>
                            <p className="max-w-4xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed">
                                Hecate Wizard Mall is a spiritual sanctuary where ancient mystical wisdom
                                meets modern-day solutions. Guided by powerful visionaries, we empower
                                individuals across the globe to find clarity, healing, and purpose.
                            </p>
                        </div>
                    </div>

                    {/* ===== FOUNDERS SECTION ===== */}
                    <div className="max-w-7xl mx-auto px-6 py-0 ">

                        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">
                            Meet Our Visionaries
                        </h2>



                        {/* ===== PRATIEK A JAIN ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center ">

                            {/* Image */}
                            <div className="relative w-full aspect-[16/16] ">
                                <Image
                                    src="/image/Pratiek A jain.jpg"
                                    alt="Pratiek A Jain"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-6 order-2 md:order-1">
                                <h3 className="text-3xl font-bold">Pratiek A Jain</h3>
                                <p className="text-[#264757] font-semibold text-lg">
                                    Founder & Managing Director
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Pratiek A Jain is a visionary leader and a powerhouse of mystical
                                    wisdom. As the Founder & Managing Director, he bridges the material
                                    world with the profound energies of the spiritual realm.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    A gifted psychic and expert practitioner, his journey reflects years
                                    of deep study and spiritual discipline.
                                </p>

                                {/* Skills */}
                                <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-700">
                                    <p>• Tarot & Numerology</p>
                                    <p>• Vastu Shastra</p>
                                    <p>• Reiki & Lama Fera Guru</p>
                                    <p>• Mystical Work & Spell Casting</p>
                                </div>

                                <p className="text-gray-700 leading-relaxed pt-4">
                                    Pratiek has impacted over <strong>10 lakh+</strong> lives across India
                                    and abroad. He ensures that <strong>10%</strong> of profits support
                                    children, hospitals, old age homes, and animal shelters.
                                </p>

                                <blockquote className="border-l-4 border-[#264757] pl-4 italic text-gray-600">
                                    “My mission is to empower individuals to unlock their true potential
                                    through the mystical sciences.”
                                </blockquote>
                            </div>


                        </div>

                        {/* ===== KAKULLIE A JAIN ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mt-20">



                            {/* Content */}
                            <div className="space-y-6 order-2 md:order-1">
                                <h3 className="text-3xl font-bold">Kakullie A Jain</h3>
                                <p className="text-[#264757] font-semibold text-lg">
                                    Co-Founder & CEO
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Kakullie A Jain is a name synonymous with spiritual enlightenment,
                                    profound intuition, and selfless service. As the Co-Founder of Hecate
                                    Wizard Mall, she bridges ancient mystical wisdom with modern-day
                                    challenges, helping individuals find clarity, purpose, and peace.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    With a strong spiritual lineage and innate psychic abilities, she has
                                    emerged as one of the most trusted names in the global occult and
                                    healing community.
                                </p>

                                {/* Skills */}
                                <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-700">
                                    <p>• Tarot Reading</p>
                                    <p>• Vedic & KP Astrology</p>
                                    <p>• Vastu & Feng Shui</p>
                                    <p>• Numerology</p>
                                </div>

                                <p className="text-gray-700 leading-relaxed pt-4">
                                    To date, Kakullie has guided over <strong>10 lakh+</strong> individuals
                                    worldwide. She donates <strong>10%</strong> of all profits to
                                    children’s welfare, old age homes, medical aid, and animal shelters.
                                </p>

                                <blockquote className="border-l-4 border-[#264757] pl-4 italic text-gray-600">
                                    “Spirituality is not about seeing the future; it is about empowering
                                    people to create a better one.”
                                </blockquote>
                            </div>
                            {/* Image */}
                            <div className="relative w-full aspect-[16/16]  order-1 md:order-2">
                                <Image
                                    src="/image/koyal.jpeg"
                                    alt="Kakullie A Jain"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                    </div>

                    {/* Call to Action */}
                    <div className="bg-white text-white py-16 text-center mt-20">
                        <h2 className="text-3xl md:text-4xl text-gray-500 font-bold mb-6">
                            Join the <span className="text-gray-900">Hecate Wizard Mall</span> Family
                        </h2>
                        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
                            Be the first to know about exclusive drops, offers, and updates from our store.
                        </p>

                        {/* Social Icons Row */}
                        <div className="flex justify-center gap-6">
                            <a href="#" className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition transform hover:scale-110">
                                <Facebook className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-blue-400 hover:bg-blue-500 p-4 rounded-full transition transform hover:scale-110">
                                <Twitter className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full transition transform hover:scale-110">
                                <Instagram className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition transform hover:scale-110">
                                <Youtube className="w-6 h-6 text-white" />
                            </a>
                        </div>
                    </div>
                </section>




            ) : (
                <section className="bg-white text-gray-900 font-functionPro">

                    {/* ===== INTRO / ABOUT HEADER ===== */}
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                                About <span className="text-gray-900">Hecate Wizard Mall</span>
                            </h1>
                            <p className="max-w-4xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed">
                                Hecate Wizard Mall is a spiritual sanctuary where ancient mystical wisdom
                                meets modern-day solutions. Guided by powerful visionaries, we empower
                                individuals across the globe to find clarity, healing, and purpose.
                            </p>
                        </div>
                    </div>

                    {/* ===== FOUNDERS SECTION ===== */}
                    <div className="max-w-7xl mx-auto px-6 py-0 ">

                        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">
                            Meet Our Visionaries
                        </h2>



                        {/* ===== PRATIEK A JAIN ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center ">

                            {/* Image */}
                            <div className="relative w-full aspect-[16/16] ">
                                <Image
                                    src="/image/Pratiek A jain.jpg"
                                    alt="Pratiek A Jain"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-6 order-2 md:order-1">
                                <h3 className="text-3xl font-bold">Pratiek A Jain</h3>
                                <p className="text-[#264757] font-semibold text-lg">
                                    Founder & Managing Director
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Pratiek A Jain is a visionary leader and a powerhouse of mystical
                                    wisdom. As the Founder & Managing Director, he bridges the material
                                    world with the profound energies of the spiritual realm.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    A gifted psychic and expert practitioner, his journey reflects years
                                    of deep study and spiritual discipline.
                                </p>

                                {/* Skills */}
                                <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-700">
                                    <p>• Tarot & Numerology</p>
                                    <p>• Vastu Shastra</p>
                                    <p>• Reiki & Lama Fera Guru</p>
                                    <p>• Mystical Work & Spell Casting</p>
                                </div>

                                <p className="text-gray-700 leading-relaxed pt-4">
                                    Pratiek has impacted over <strong>10 lakh+</strong> lives across India
                                    and abroad. He ensures that <strong>10%</strong> of profits support
                                    children, hospitals, old age homes, and animal shelters.
                                </p>

                                <blockquote className="border-l-4 border-[#264757] pl-4 italic text-gray-600">
                                    “My mission is to empower individuals to unlock their true potential
                                    through the mystical sciences.”
                                </blockquote>
                            </div>


                        </div>

                        {/* ===== KAKULLIE A JAIN ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mt-20">



                            {/* Content */}
                            <div className="space-y-6 order-2 md:order-1">
                                <h3 className="text-3xl font-bold">Kakullie A Jain</h3>
                                <p className="text-[#264757] font-semibold text-lg">
                                    Co-Founder & CEO
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Kakullie A Jain is a name synonymous with spiritual enlightenment,
                                    profound intuition, and selfless service. As the Co-Founder of Hecate
                                    Wizard Mall, she bridges ancient mystical wisdom with modern-day
                                    challenges, helping individuals find clarity, purpose, and peace.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    With a strong spiritual lineage and innate psychic abilities, she has
                                    emerged as one of the most trusted names in the global occult and
                                    healing community.
                                </p>

                                {/* Skills */}
                                <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-700">
                                    <p>• Tarot Reading</p>
                                    <p>• Vedic & KP Astrology</p>
                                    <p>• Vastu & Feng Shui</p>
                                    <p>• Numerology</p>
                                </div>

                                <p className="text-gray-700 leading-relaxed pt-4">
                                    To date, Kakullie has guided over <strong>10 lakh+</strong> individuals
                                    worldwide. She donates <strong>10%</strong> of all profits to
                                    children’s welfare, old age homes, medical aid, and animal shelters.
                                </p>

                                <blockquote className="border-l-4 border-[#264757] pl-4 italic text-gray-600">
                                    “Spirituality is not about seeing the future; it is about empowering
                                    people to create a better one.”
                                </blockquote>
                            </div>
                            {/* Image */}
                            <div className="relative w-full aspect-[16/16]  order-1 md:order-2">
                                <Image
                                    src="/image/koyal.jpeg"
                                    alt="Kakullie A Jain"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                    </div>

                    {/* Call to Action */}
                    <div className="bg-white text-white py-16 text-center mt-20">
                        <h2 className="text-3xl md:text-4xl text-gray-500 font-bold mb-6">
                            Join the <span className="text-gray-900">Hecate Wizard Mall</span> Family
                        </h2>
                        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
                            Be the first to know about exclusive drops, offers, and updates from our store.
                        </p>

                        {/* Social Icons Row */}
                        <div className="flex justify-center gap-6">
                            <a href="#" className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition transform hover:scale-110">
                                <Facebook className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-blue-400 hover:bg-blue-500 p-4 rounded-full transition transform hover:scale-110">
                                <Twitter className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full transition transform hover:scale-110">
                                <Instagram className="w-6 h-6 text-white" />
                            </a>
                            <a href="#" className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition transform hover:scale-110">
                                <Youtube className="w-6 h-6 text-white" />
                            </a>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default About;
