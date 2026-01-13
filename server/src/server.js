import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import chartRoutes from "./routes/chartRoutes.js";
import authRoutes from "./routes/authRoutes.js";

config();
connectDB();

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/charts", chartRoutes);
app.use("/auth", authRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g. db connection errors)
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("uncaughtException: ", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
