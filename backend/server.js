import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from './src/routes/auth.js';
import clientRoutes from './src/routes/client.js';
import interactionRoutes from './src/routes/interaction.js';
import taskRoutes from './src/routes/task.js';
import clientSegmentRoutes from './src/routes/clientSegment.js';
import reportRoutes from './src/routes/report.js';
import emailRoutes from './src/routes/email.js';
import documentRoutes from './src/routes/document.js';
import searchRoutes from './src/routes/search.js';

// Import jobs
import "./src/jobs/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Karm Baba CRM API" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/segments", clientSegmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});