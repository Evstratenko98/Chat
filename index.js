require("dotenv").config();

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const socketio = require("socket.io");
const cors = require("cors");

const authRouter = require("./routers/authRouter.js");
const dbRouter = require("./routers/dbRouter.js");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/db", dbRouter);
app.use(cookie());

io.on("connection", (socket) => {
    socket.on("subscribe", ({ username, roomId }) => {
        socket.join(roomId);
        io.to(roomId).emit(`alert`, {
            text: `${username} вошёл в комнату!`,
            sender: "Admin",
        });
    });
    socket.on("unsubscribe", ({ username, roomId }) => {
        socket.leave(roomId);
        io.to(roomId).emit(`alert`, {
            text: `${username} вышел из комнаты!`,
            sender: "Admin",
        });
    });
    socket.on("sendMessage", ({ roomId, sender, text }) => {
        const _id = mongoose.Types.ObjectId();
        io.to(roomId).emit("message", {
            sender,
            text,
            _id,
        });
    });

    // socket.on("sendMessage", ({ message, username, roomId }, callback) => {
    //     io.sockets.in(roomId).emit("message", {
    //         message,
    //         username,
    //         roomId,
    //     });
    //     callback();
    // });
});

const start = async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
