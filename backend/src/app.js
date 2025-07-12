import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { logger } from "./middlewares/logger.middleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";
import userRoutes from "./routes/user.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import swapRoutes from "./routes/swap.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb" }));
app.use(express.static("public"));

app.use(cookieParser());

app.use(logger);
app.use(verifyToken);
app.use(rateLimiter);

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

export { app };
