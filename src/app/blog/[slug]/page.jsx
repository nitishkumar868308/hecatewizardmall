"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Clock, ArrowLeft, Calendar, Share2, ChevronDown, User } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { toast } from "react-hot-toast";
import Loader from "@/components/Include/Loader";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import {
    fetchBlogReviews,
    createBlogReview,
} from "@/app/redux/slices/blogReviews/blogReviewsSlice";
import { useDispatch, useSelector } from "react-redux";

const BlogDetailPage = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const router = useRouter();
    const { slug } = params;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const { user } = useSelector((state) => state.me);
    const { reviews, loading: reviewsLoading } = useSelector((state) => state.blogReviews);
    console.log("reviews", reviews)

    // Reading Progress Bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Fetch blog & reviews
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/blog?slug=${slug}`);
                setBlog(res.data.data);

                // Fetch reviews using slice
                dispatch(fetchBlogReviews(res.data.data.id));
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch blog or reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug, dispatch]);

    const handleRating = (star) => setReviewData({ ...reviewData, rating: star });

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment || reviewData.rating === 0) {
            return toast.error("Please select rating and write a comment");
        }

        if (!user) return toast.error("Please login first to submit a review");

        try {
            setReviewSubmitting(true);
            const payload = {
                userId: user.id,
                userName: user.name,
                blogId: blog.id,
                rating: reviewData.rating,
                comment: reviewData.comment,
            };
            await dispatch(createBlogReview(payload)).unwrap();
            setReviewData({ rating: 0, comment: "" });
            toast.success("Review submitted successfully");
        } catch (err) {
            // console.error(err);
            toast.error(err?.message || "Failed to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!blog) return <div className="text-center text-white mt-32">Blog not found</div>;


    return (
        <div className="bg-[#050505] text-white min-h-screen selection:bg-[#66FCF1] selection:text-black">
            {/* --- Progress Bar --- */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#66FCF1] origin-left z-[100]" style={{ scaleX }} />

            {/* --- Navigation --- */}
            <nav className="fixed top-0 left-0 right-0 z-[60] p-6 flex justify-between items-center mix-blend-difference">
                <button onClick={() => router.back()} className="group flex items-center gap-2 text-sm font-bold tracking-tighter uppercase text-white transition-all">
                    <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Back
                </button>
                {/* <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-[#66FCF1] hover:text-black transition-all">
                    <Share2 size={18} />
                </button> */}
            </nav>

            {/* --- Hero Section (Full Screen) --- */}
            <header className="relative h-[90vh] md:h-screen w-full flex items-end overflow-hidden">
                {/* Image background - contain or cover based on your preference, but here we use cover with a focus */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                </motion.div>

                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pb-20">
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#66FCF1] text-black text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            {blog.category}
                        </span>
                        <h1 className="text-5xl md:text-[8vw] font-black leading-[0.9] tracking-tighter mb-8 max-w-5xl italic uppercase">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-zinc-400 text-sm font-medium border-t border-white/10 pt-8 mt-4">
                            <div className="flex items-center gap-2"><Calendar size={16} className="text-[#66FCF1]" /> {new Date(blog.createdAt).toDateString()}</div>
                            <div className="flex items-center gap-2"><Clock size={16} className="text-[#66FCF1]" /> {blog.readTime} min read</div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 right-10 animate-bounce hidden md:block text-zinc-500">
                    <ChevronDown size={30} />
                </div>
            </header>

            {/* --- Content Section --- */}
            <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6 py-24">

                {/* Left Sidebar (Meta/Author) - Sticky */}
                <aside className="lg:col-span-3 hidden lg:block">
                    <div className="sticky top-32 space-y-12">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                                Written By
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-15 h-15 rounded-full bg-zinc-800 flex items-center justify-center border border-[#66FCF1]/20 overflow-hidden">
                                    {blog.authorImage ? (
                                        <img
                                            src={blog.authorImage}
                                            alt={blog.authorName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={18} className="text-[#66FCF1]" />
                                    )}
                                </div>

                                <span className="font-bold text-lg tracking-tight">
                                    {blog.authorName}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-white/5" />
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Share Article</p>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-[#66FCF1] cursor-pointer transition-colors">𝕏</div>
                                <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-[#66FCF1] cursor-pointer transition-colors">in</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Article Body */}
                <article className="lg:col-span-8 lg:col-start-5 prose prose-invert prose-zinc max-w-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Summary Block */}
                        <p className="text-2xl md:text-4xl font-medium leading-tight text-[#66FCF1] mb-16 tracking-tight">
                            {blog.excerpt || "We deep dive into the core mechanics of " + blog.title + " and how it's shaping the future of digital experiences."}
                        </p>

                        {/* Middle image - purely to show full width and not cut */}
                        <div className="my-20 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900">
                            <img src={blog.image} alt="Full view" className="w-full h-auto object-contain" />
                            <p className="text-center text-xs text-zinc-500 py-4 italic">Featured Visual: {blog.title}</p>
                        </div>

                        {/* Actual Description */}
                        <div className="text-zinc-300 leading-[2] text-xl space-y-12 font-light">
                            {blog.description}
                        </div>
                    </motion.div>
                </article>
            </section>

            {/* --- Review & Rating Section --- */}

            <section className="relative z-10 max-w-[1400px] mx-auto px-6 pb-32">
                <div className="lg:grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 lg:col-start-5">
                        <div className="h-[1px] w-full bg-white/10 mb-16" />

                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                                Thoughts? <span className="text-[#66FCF1]">Leave a Review</span>
                            </h2>
                            <p className="text-zinc-500 text-sm md:text-base">
                                Your feedback helps us refine our digital narratives.
                            </p>
                        </div>

                        {/* Review Form */}
                        {user ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                                <form className="space-y-8" onSubmit={submitReview}>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Overall Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" className={`text-2xl md:text-3xl transition-colors focus:outline-none ${reviewData.rating >= star ? "text-[#66FCF1]" : "text-zinc-700"}`} onClick={() => handleRating(star)}>★</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Your Review</label>
                                        <textarea
                                            rows="5"
                                            value={reviewData.comment}
                                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                            placeholder="Share your insights about this article..."
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 text-white placeholder:text-zinc-600 focus:border-[#66FCF1] focus:outline-none transition-all resize-none shadow-inner"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="submit" disabled={reviewSubmitting} className="group relative px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full overflow-hidden transition-all active:scale-95 shadow-xl shadow-white/5">
                                            <span className="relative z-10">{reviewSubmitting ? "Submitting..." : "Post Review"}</span>
                                            <div className="absolute inset-0 bg-[#66FCF1] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 text-center text-white">
                                Please <span className="text-[#66FCF1] font-bold">login</span> first to leave a review.
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="mt-20 space-y-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-[#66FCF1]" /> Community Feedback
                            </h3>

                            {reviewsLoading ? (
                                <Loader />
                            ) : (
                                (() => {
                                    const approvedReviews = reviews.filter((rev) => rev.status === "approved");
                                    if (approvedReviews.length === 0) {
                                        return (
                                            <div className="p-8 rounded-3xl border border-white/5 bg-zinc-900/20 text-center text-zinc-400 italic">
                                                No reviews yet. Be the first to share your thoughts!
                                            </div>
                                        );
                                    }
                                    return approvedReviews.map((rev) => (
                                        <div key={rev.id} className="p-8 rounded-3xl border border-white/5 bg-zinc-900/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-white tracking-tight">{rev.userName}</h4>
                                                    <p className="text-[10px] text-[#66FCF1] font-mono">{new Date(rev.createdAt).toDateString()}</p>
                                                </div>
                                                <div className="flex text-[#66FCF1] text-sm">{Array(rev.rating).fill("★")}</div>
                                            </div>
                                            <p className="text-zinc-400 leading-relaxed text-sm italic">{rev.comment}</p>
                                        </div>
                                    ));
                                })()
                            )}
                        </div>


                    </div>
                </div>
            </section>

            {/* --- Footer Decoration --- */}
            <footer className="relative h-64 border-t border-white/5 bg-gradient-to-b from-transparent to-zinc-900/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="
        text-[#66FCF1]/5
        font-black
        uppercase
        italic
        select-none
        pointer-events-none
        tracking-tight
        leading-none
        text-center
        whitespace-nowrap
      "
                        style={{
                            fontSize: "clamp(2rem, 8vw, 7rem)",
                        }}
                    >
                        Hecate Wizard Mall
                    </span>
                </div>
            </footer>


        </div>
    );
};

export default BlogDetailPage;