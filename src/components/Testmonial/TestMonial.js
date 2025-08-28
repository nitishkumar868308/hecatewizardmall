"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaQuoteLeft } from "react-icons/fa";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Autoplay, Pagination } from "swiper/modules";

const TestMonial = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "CEO, TechCorp",
      text: "Ye platform mere business ke liye ek game-changer sabit hua. UI clean hai aur experience flawless.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sneha Patel",
      role: "Marketing Head, BrandX",
      text: "Customer support aur functionality dono hi top-notch hain. Highly recommend karungi.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Verma",
      role: "Freelancer",
      text: "Mujhe responsiveness aur design sabse zyada pasand aaya. Bahut hi professional look deta hai.",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];

  return (
    <section className="bg-gray-300 py-16 px-6 font-functionPro">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">
          What Our Clients Say
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          //pagination={{ clickable: true }}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
          className="pb-10"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className=" rounded-2xl shadow-lg p-8 flex flex-col items-center text-center text-black">
                <FaQuoteLeft className="text-blue-500 text-3xl mb-4" />
                <p className=" mb-6 leading-relaxed italic">
                  "{item.text}"
                </p>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-500 mb-3 object-cover"
                />
                <h3 className="text-lg font-semibold ">
                  {item.name}
                </h3>
                <p className="text-sm ">{item.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestMonial;
