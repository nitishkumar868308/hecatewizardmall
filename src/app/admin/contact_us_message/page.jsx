"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import {
  fetchContactMessages,
  deleteContactMessage,
  resetContactState,
  postReplyMessage,
  readContactMessage
} from "@/app/redux/slices/contact/contactMessageSlice";
import { FiTrash2, FiCheckCircle, FiMessageCircle, FiSend, FiSearch } from "react-icons/fi";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";

const ContactMessagesPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.contactMessage);
  const { user } = useSelector((state) => state.me);
  console.log("user" , user)
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchContactMessages());
    dispatch(fetchMe())
    return () => {
      dispatch(resetContactState());
    };
  }, [dispatch]);

  // Filter messages by search
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeMessage = messages.find((msg) => msg.id === activeMessageId);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteContactMessage(id));
      setActiveMessageId(null);
    }
  };

  const handleOpenMessage = (msg) => {
    setActiveMessageId(msg.id);

    // ✅ Admin ne message open kiya → mark as read
    if (!msg.readByAdmin) {
      dispatch(readContactMessage({ id: msg.id, role: "admin" }));
    }
  };


  const handleReply = () => {
    if (!replyText.trim()) return;

    const senderRole = user?.role === "ADMIN" ? "admin" : "user";

    dispatch(postReplyMessage({
      contactMessageId: activeMessageId,
      message: replyText,
      sender: senderRole, // ✅ use dynamic role
    }));

    setReplyText("");
  };


  return (
    <DefaultPageAdmin>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiMessageCircle className="w-6 h-6 text-blue-500" /> Contact Inbox
        </h1>

        {/* Search Bar */}
        <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full max-w-md">
          <FiSearch className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="outline-none flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-[75vh]">
          {/* Sidebar / Message List */}
          <div className="w-full lg:w-1/3 border rounded-md overflow-y-auto">
            {loading && <p className="p-4 text-gray-500">Loading messages...</p>}
            {error && <p className="p-4 text-red-500">{error}</p>}
            {filteredMessages.length === 0 && !loading && (
              <p className="p-4 text-gray-600">No messages found.</p>
            )}
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-3 border-b cursor-pointer transition flex justify-between items-center hover:bg-gray-100
      ${!msg.readByAdmin ? "bg-white font-semibold" : "bg-gray-50"}
      ${activeMessageId === msg.id ? "bg-blue-50" : ""}
    `}
              >
                <div className="flex flex-col">
                  <span className="truncate">{msg.name}</span>
                  <span className="text-xs text-gray-500 truncate">{msg.email}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {msg.message.slice(0, 40)}...
                  </span>
                </div>

                <div className="flex gap-1 items-center">
                  {!msg.readByAdmin && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  {msg.replied && (
                    <span className="text-green-500 text-xs font-bold">Replied</span>
                  )}
                </div>
              </div>
            ))}

          </div>

          {/* Message Detail */}
          <div className="w-full lg:w-2/3 border rounded-md p-4 overflow-y-auto">
            {!activeMessage ? (
              <p className="text-gray-500">Select a message to view details</p>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{activeMessage.name}</h2>
                    <p className="text-sm text-gray-500">{activeMessage.email}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activeMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      //onClick={() => toggleReadStatus(activeMessage)}
                      title={activeMessage.read ? "Mark as Unread" : "Mark as Read"}
                      className={`p-1 rounded-full ${activeMessage.read ? "text-gray-400 hover:text-blue-500" : "text-blue-500 hover:text-blue-700"
                        }`}
                    >
                      <FiCheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(activeMessage.id)}
                      title="Delete Message"
                      className="p-1 rounded-full text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-4">

                  {/* USER ORIGINAL MESSAGE (LEFT) */}
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-200 text-gray-800 p-3 rounded-lg">
                      <p className="whitespace-pre-line">{activeMessage.message}</p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(activeMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* REPLIES */}
                  {activeMessage.replies?.map((reply) => (
                    <div
                      key={reply.id}
                      className={`flex ${reply.sender === "admin" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${reply.sender === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-800"
                          }`}
                      >
                        <p className="whitespace-pre-line">{reply.message}</p>
                        <span className="text-xs opacity-70 block mt-1">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>


                {/* Reply Box */}
                <div className="flex flex-col gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleReply}
                      className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      <FiSend className="w-4 h-4" /> Send
                    </button>
                    <button
                      onClick={() => setActiveMessageId(null)}
                      className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DefaultPageAdmin >
  );
};

export default ContactMessagesPage;
