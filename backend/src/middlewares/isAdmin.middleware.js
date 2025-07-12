import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }
  next();
};
