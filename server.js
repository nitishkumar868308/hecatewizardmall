import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server, {
        path: "/socket.io",
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log("✅ Client connected:", socket.id);

        socket.on("send_message", (msg) => {
            io.emit("receive_message", msg);
        });

        socket.on("typing", ({ sender }) => {
            socket.broadcast.emit("user_typing", { sender }); // send typing info to others
        });

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });

    server.listen(port, () => {
        console.log(`> Server ready at http://localhost:${port}`);
    });
});