"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage as sendMessageAction } from "@/app/redux/slices/chat/chatSlice";

export default function OrderChat({ orderId, currentUser, currentUserRole, receiverId, receiverRole }) {

    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.messages || []);
    const [text, setText] = useState("");
    const chatRef = useRef();
    const [intervalMs, setIntervalMs] = useState(5000);

    // Polling messages
    useEffect(() => {
        let polling;

        const getMessages = async () => {
            if (!orderId) return;
            await dispatch(fetchMessages({ orderId }));
        };

        getMessages();
        polling = setInterval(getMessages, intervalMs);

        const handleVisibility = () => {
            if (document.hidden) setIntervalMs(15000);
            else setIntervalMs(5000);
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            clearInterval(polling);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [orderId, intervalMs, dispatch]);

    // Scroll to bottom
    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    // Send message
    const sendMessage = async () => {
        if (!text.trim()) return;

        console.log({
            orderId,
            sender: currentUser,
            senderRole: currentUserRole,
            receiverId,
            receiverRole,
            text
        });


        await dispatch(sendMessageAction({
            orderId,
            sender: currentUser,
            senderRole: currentUserRole,
            receiverId,
            receiverRole,
            text
        }));




        setText("");
    };


    return (
        <div className="flex flex-col flex-1 h-full border-t bg-gray-50">
            <div className="flex-1 p-4 space-y-2 overflow-y-auto" ref={chatRef}>
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm">
                        No messages yet...
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={`${msg.id}-${msg.createdAt}`}
                            className={`text-sm p-2 rounded ${msg.senderRole === currentUserRole ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
                                }`}
                        >
                            <b>{msg.senderRole === currentUserRole ? "You" : msg.sender}:</b> {msg.text}
                            <span className="text-gray-400 text-xs ml-2">
                                ({new Date(msg.createdAt).toLocaleTimeString()})
                            </span>
                        </div>
                    ))

                )}
            </div>
            <div className="p-2 flex gap-2 border-t">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // line break ko roke
                            sendMessage();      // Enter press → message send
                        }
                    }}
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
