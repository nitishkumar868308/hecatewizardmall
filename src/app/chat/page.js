"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socket;

export default function Chat({ orderId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const chatRef = useRef();

    useEffect(() => {
        socket = io("http://localhost:3000");

        socket.emit("join-room", { orderId });

        socket.on("previous-messages", (msgs) => setMessages(msgs));
        socket.on("receive-message", (msg) => setMessages((prev) => [...prev, msg]));

        return () => socket.disconnect();
    }, [orderId]);

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim()) return;
        socket.emit("send-message", { orderId, sender: currentUser, text });
        setText("");
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Messages */}
            <div
                className="flex-1 p-4 space-y-2 overflow-y-auto"
                ref={chatRef}
            >
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm">No messages yet...</div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                        <b>{msg.sender}:</b> {msg.text}{" "}
                        <span className="text-gray-400 text-xs">
                            ({new Date(msg.createdAt).toLocaleTimeString()})
                        </span>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t p-2 flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
