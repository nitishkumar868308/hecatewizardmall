"use client";
import React from "react";

const Contact = () => {
    return (
        <div className=" bg-gray-50 font-sans px-0 py-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-gray-900 mb-16">
                    Contact Us
                </h1>

                <div className="flex flex-col md:flex-row w-full shadow-xl rounded-3xl overflow-hidden ">
                    <div className="flex-1 w-full ">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d77.2195!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b1e1e7abcd%3A0x123456789abcdef!2sCozy%20Creations!5e0!3m2!1sen!2sin!4v1693132800000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="flex-1 bg-white p-10">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Send us a Message</h2>
                        <form className="space-y-6">
                            {/* Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder=" "
                                    required
                                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Name
                                </label>
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder=" "
                                    required
                                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Email
                                </label>
                            </div>

                            {/* Message */}
                            <div className="relative">
                                <textarea
                                    id="message"
                                    placeholder=" "
                                    required
                                    rows="5"
                                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                ></textarea>
                                <label
                                    htmlFor="message"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Message
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
