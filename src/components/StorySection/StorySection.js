"use client";
import React, { useState } from "react";

const StorySection = () => {
    const [activeStory, setActiveStory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const stories = [
        {
            id: 1,
            title: "Story 1",
            video: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail: "/image/banner1.jpg",
        },
        {
            id: 2,
            title: "Story 2",
            video: "https://www.w3schools.com/html/movie.mp4",
            thumbnail: "/image/banner7.jpg",
        },
        {
            id: 3,
            title: "Story 3",
            video: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail: "/image/banner8.jpg",
        },
    ];

    const openModal = (storyId) => {
        setActiveStory(storyId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setActiveStory(null);
        setModalOpen(false);
    };

    return (
        <div className="bg-gray-50 py-6 px-4">
            <h2 className="text-2xl  mb-6 font-functionPro">Stories</h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-1">
                {stories.map((story) => (
                    <div
                        key={story.id}
                        className="flex flex-col items-center flex-shrink-0 w-20 sm:w-28 md:w-32"
                    >
                        <div
                            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-tr from-pink-500 to-yellow-500 cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
                            onClick={() => openModal(story.id)}
                        >
                            <img
                                src={story.thumbnail}
                                alt={story.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="mt-2 text-xs sm:text-sm text-gray-700 font-functionPro text-center truncate w-full">
                            {story.title}
                        </span>
                    </div>
                ))}
            </div>


            {/* Modal */}
            {modalOpen && activeStory && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative w-full max-w-4xl h-[60vh] sm:h-[70vh] mx-2 bg-black rounded-2xl overflow-hidden flex items-center justify-center">

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-white text-3xl font-bold z-50 hover:text-red-300 cursor-pointer"
                        >
                            &times;
                        </button>

                        {/* Video */}
                        <video
                            src={stories.find((s) => s.id === activeStory).video}
                            autoPlay
                            controls
                            className="w-full h-full object-contain max-h-screen"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default StorySection;
