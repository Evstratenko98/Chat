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
   console.log("user is connected");

   socket.on("join", ({ username, roomId }) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("message", {
         sender: "Admin",
         text: `${username} has joined!`,
      });
   });

   socket.on("sendMessage", (message, username, roomId, callback) => {
      console.log(message, username, roomId);
      io.to(roomId).emit("message", { sender: username, text: message });

      callback();
   });

   socket.on("disconnect", ({ username, roomId }, callback) => {
      io.to(roomId).emit("message", {
         sender: "Admin",
         text: `${username} has left!`,
      });
   });
});

const start = async () => {
   await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   });
   server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
