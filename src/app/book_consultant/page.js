"use client";
import React, { useState } from "react";
import { motion } from "framer-motion"; // Animation library

const Page = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedConsultant, setSelectedConsultant] = useState(null);

    const consultants = [
        {
            id: 1,
            name: "John Doe",
            title: "Business Consultant",
            experience: "10 years",
            bio: "Helping startups grow with strategy and financial planning.",
            image: "https://i.pravatar.cc/150?img=3",
        },
        {
            id: 2,
            name: "Jane Smith",
            title: "Marketing Expert",
            experience: "8 years",
            bio: "Specialist in marketing strategies for brands and businesses.",
            image: "https://i.pravatar.cc/150?img=5",
        },
    ];

    const services = [
        { id: 1, name: "Business Strategy", description: "Comprehensive planning for your business." },
        { id: 2, name: "Financial Planning", description: "Manage finances for growth." },
        { id: 3, name: "Marketing Consulting", description: "Grow your brand with effective marketing." },
    ];

    const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

    return (
        <div className=" bg-gray-50 p-4 md:p-10">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-3">Book a Consultant</h1>
                <p className="text-gray-600 text-lg">Choose a consultant, select a service, and book your slot</p>
            </div>

            {/* Consultants */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
                {consultants.map((c) => (
                    <motion.div
                        key={c.id}
                        className={`bg-white shadow-lg rounded-xl p-6 cursor-pointer flex flex-col items-center text-center transition-transform ${selectedConsultant?.id === c.id ? "border-4 border-blue-500 scale-105" : "hover:scale-105"
                            }`}
                        onClick={() => setSelectedConsultant(c)}
                        whileHover={{ scale: 1.05 }}
                    >
                        <img src={c.image} alt={c.name} className="w-32 h-32 rounded-full mb-4" />
                        <h2 className="text-2xl font-semibold">{c.name}</h2>
                        <p className="text-gray-500">{c.title}</p>
                        <p className="text-gray-500 mb-2">{c.experience} experience</p>
                        <p className="text-gray-600 text-sm">{c.bio}</p>
                    </motion.div>
                ))}
            </div>

            {/* Services */}
            {selectedConsultant && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-8"
                >
                    <h2 className="text-3xl font-semibold mb-6 text-center">Services</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {services.map((s) => (
                            <motion.div
                                key={s.id}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                            >
                                <h3 className="font-semibold text-gray-800">{s.name}</h3>
                                <p className="text-gray-600 text-sm">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Schedule Booking */}
            {selectedConsultant && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6"
                >
                    <h2 className="text-3xl font-semibold mb-4 text-center">Select a Slot</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {slots.map((slot) => (
                            <motion.button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-lg border font-medium ${selectedSlot === slot
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                            >
                                {slot}
                            </motion.button>
                        ))}
                    </div>

                    {selectedSlot && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center font-semibold"
                        >
                            You selected <strong>{selectedSlot}</strong> with <strong>{selectedConsultant.name}</strong>
                        </motion.div>
                    )}

                    <button
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        disabled={!selectedSlot}
                    >
                        Book Now
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Page;
