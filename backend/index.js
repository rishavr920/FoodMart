import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// allow both prod + local frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,    // vercel frontend
  "http://localhost:5173"      // local dev
];

const app = express();
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

// middlewares
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// socket handler
socketHandler(io);

// start
server.listen(PORT, () => {
  console.log(`🚀 Server started at ${PORT}`);
  connectDb();
});
