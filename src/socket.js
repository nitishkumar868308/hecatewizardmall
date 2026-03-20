// src/socket.js
"use client";  // ← ye zaroori
import { io } from "socket.io-client";

export const socket = io(typeof window !== "undefined" ? window.location.origin : "", {
    path: "/socket.io",
    transports: ["websocket", "polling"],
});