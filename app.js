import express from "express";
import { createServer } from "http";

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import cookieParser from "cookie-parser";

const secretKeyJWT = "kasjhjdfhalks";
const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-frontend-bxa9.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.end("Hello Everyone");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "ajdkjlkl" }, secretKeyJWT);
  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});
const user = false;
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));
    const decode = jwt.verify(token, secretKeyJWT);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User Joined room ${room}`);
  });
  socket.on("disconnect", () => {
    console.log(`user Disconnected  ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port  ${port}`);
});
