import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { logger } from "./middlewares/logger.middleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";

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

export { app };
