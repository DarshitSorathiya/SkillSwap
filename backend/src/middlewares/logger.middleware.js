import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDirectory = path.resolve("logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, "access-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d",
});

const loggerInstance = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()} - ${message}`
    )
  ),
  transports: [transport],
});

const logger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const endpoint = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    const statusCode = res.statusCode;
    const authHeader = req.header("Authorization") || "";
    const token =
      req.cookies?.apiToken ||
      (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : "N/A");

    const logMessage = `${method} ${endpoint} | IP: ${ip} | Token: ${token} | Status: ${statusCode} | ${duration}ms`;

    loggerInstance.info(timestamp, logMessage);
  });

  next();
};

export { logger };
