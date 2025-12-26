import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import routes from "./routes/index.js";

// Import jobs
import "./jobs/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Karm Baba CRM API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});