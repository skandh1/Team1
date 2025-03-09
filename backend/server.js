import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import searchUser from "./routes/search.route.js";
import projectRoutes from "./routes/project.route.js";
import editProjectRoutes from "./routes/editProject.route.js";
import appliedProjectsRoutes from "./routes/appliedProjects.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://teamifymain.vercel.app",
  "https://teamify-pied.vercel.app",
  "https://teamifymain-sachs-projects-c51763c4.vercel.app",
  "https://teamifymain-git-main-sachs-projects-c51763c4.vercel.app",
  process.env.FRONTEND_URL,
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// ✅ Body parser for JSON and cookies
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/search", searchUser);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/editProject", editProjectRoutes);
app.use("/api/v1/appliedProjects", appliedProjectsRoutes);
app.use("/api/v1/chat/", chatRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Static file serving for frontend (Optional)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Handle React Router refresh issue
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB(); // ✅ Connect to the database
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
