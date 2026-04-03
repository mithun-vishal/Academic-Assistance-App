import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import aiRoutes from "./routes/AI";
import analyticsRoutes from "./routes/analyticsRoutes";
import testRoutes from "./routes/testRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
connectDB();

// Mount all routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

export { };