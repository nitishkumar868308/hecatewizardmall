"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MoreVertical, Smile, CheckCheck, Image as ImageIcon } from "lucide-react";
import { socket } from "../../socket";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";

export default function Chat() {
    const [currentUser, setCurrentUser] = useState("");
    const [otherUser, setOtherUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const chatRef = useRef();
    const fileInputRef = useRef();
    const [typingUsers, setTypingUsers] = useState([]);
    const typingTimeoutsRef = useRef({});
    const [showPicker, setShowPicker] = useState(false);

    // Assign random user per browser
    useEffect(() => {
        let user = localStorage.getItem("chatUser");
        if (!user) {
            user = Math.random() < 0.5 ? "User1" : "User2";
            localStorage.setItem("chatUser", user);
        }
        setCurrentUser(user);
        setOtherUser(user === "User1" ? "User2" : "User1");
    }, []);


    // Listen for typing from others
    useEffect(() => {
        socket.on("user_typing", ({ sender }) => {
            if (sender !== currentUser) {
                // Add sender to typingUsers
                setTypingUsers((prev) => [...new Set([...prev, sender])]);

                // Clear previous timeout for this sender if any
                if (typingTimeoutsRef.current[sender]) {
                    clearTimeout(typingTimeoutsRef.current[sender]);
                }

                // Remove after 1.5s of inactivity
                typingTimeoutsRef.current[sender] = setTimeout(() => {
                    setTypingUsers((prev) => prev.filter(u => u !== sender));
                    delete typingTimeoutsRef.current[sender];
                }, 1500);
            }
        });

        return () => socket.off("user_typing");
    }, [currentUser]);

    const handleTyping = (e) => {
        setText(e.target.value);
        socket.emit("typing", { sender: currentUser });
    };

    // Socket.IO
    useEffect(() => {
        socket.on("receive_message", (msg) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });
    }, []);

    // Auto scroll
    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const sendMessage = () => {
        if (!text.trim() && !previewUrl) return;
        const newMessage = {
            id: uuidv4(),
            sender: currentUser,
            text,
            image: previewUrl,
            createdAt: new Date(),
        };
        socket.emit("send_message", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setText("");
        setPreviewUrl(null);
    };

    if (!currentUser) return null; // wait until user is set

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-slate-100 p-0 sm:p-4">
                <div className="flex flex-col w-full max-w-4xl h-screen sm:h-[85vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

                    {/* Header */}
                    <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    {otherUser.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{otherUser}</h3>
                                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">
                                    {typingUsers.includes(otherUser) ? "Typing..." : "Online"}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc] custom-scrollbar">
                        {messages.map((msg) => {
                            const isMe = msg.sender === currentUser;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                        <div className={`relative group p-3 sm:p-4 rounded-2xl shadow-sm transition-all ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"}`}>
                                            {msg.image && <div className="mb-2 overflow-hidden rounded-lg"><img src={msg.image} className="max-h-72 w-full object-cover" /></div>}
                                            {msg.text && <p className="text-[15px] sm:text-base leading-relaxed">{msg.text}</p>}
                                            <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? "text-blue-200" : "text-gray-500"}`}>
                                                <span className="text-[10px] font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMe && <CheckCheck size={14} />}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t">
                        <AnimatePresence>
                            {previewUrl && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-3 relative inline-block">
                                    <img src={previewUrl} className="w-24 h-24 object-cover rounded-xl border-2 border-blue-500 shadow-md" />
                                    <button onClick={() => setPreviewUrl(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600">
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-end gap-2 max-w-full relative">
                            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[24px] px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all relative">
                                <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-400 hover:text-blue-500 transition">
                                    <ImageIcon size={22} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                <textarea
                                    value={text}
                                    onChange={handleTyping}
                                    rows={1}
                                    placeholder="Write a message..."
                                    className="flex-1 bg-transparent border-none outline-none py-3 text-[15px] resize-none max-h-32"
                                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                />
                                <button onClick={() => setShowPicker(!showPicker)}>
                                    <Smile size={22} />
                                </button>

                                {/* Emoji Picker */}
                                {showPicker && (
                                    <div className="absolute bottom-full mb-2 right-0 z-50">
                                        <Picker onEmojiClick={(emoji) => setText(prev => prev + emoji.emoji)} />
                                    </div>
                                )}
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={sendMessage}
                                disabled={!text.trim() && !previewUrl}
                                className={`p-4 rounded-full flex items-center justify-center transition-all shadow-lg ${(text.trim() || previewUrl) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed"}`}
                            >
                                <Send size={20} fill={(text.trim() || previewUrl) ? "currentColor" : "none"} />
                            </motion.button>
                        </div>


                    </div>
                </div>
            </div>


        </>

    );
}