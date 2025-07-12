// import redis from "../config/redisClient.js";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// const rateLimiter = asyncHandler(async (req, _, next) => {
//   try {
//     const authHeader = req.header("Authorization") || "";
//     const token =
//       req.cookies?.apiToken ||
//       (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

//     if (!token) {
//       throw new ApiError(401, "Missing API token for rate limiting");
//     }

//     const key = `rate-limit:${token}`;

//     const requestCount = await redis.incr(key);

//     if (requestCount === 1) {
//       await redis.expire(key, process.env.WINDOW_SIZE);
//     }

//     if (requestCount > process.env.RATE_LIMIT) {
//       throw new ApiError(429, "Too many requests. Try again later.");
//     }

//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Access Token is not varified");
//   }
// });

// export { rateLimiter };
