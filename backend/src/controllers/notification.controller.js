import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createNotification = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin)
    throw new ApiError(403, "Only admins can send notifications");

  const {
    title,
    message,
    type = "info",
    visibleTo = ["all"],
    priority = 1,
    expiresAt,
    dismissible = true,
  } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(
      400,
      "Message is required and must be a non-empty string"
    );
  }

  if (title && typeof title !== "string") {
    throw new ApiError(400, "Title must be a string");
  }

  if (!Array.isArray(visibleTo)) {
    throw new ApiError(400, "visibleTo must be an array");
  }

  if (expiresAt && isNaN(Date.parse(expiresAt))) {
    throw new ApiError(400, "Invalid expiresAt date");
  }

  const notification = await Notification.create({
    title,
    message,
    type,
    visibleTo,
    priority,
    dismissible,
    createdBy: req.user._id,
    expiresAt,
  });

  res.status(201).json(new ApiResponse(201, notification, "Notification sent"));
});

const getNotifications = asyncHandler(async (req, res) => {
  const user = req.user;

  const visibility = ["all"];
  if (user.isBanned) visibility.push("banned");
  else visibility.push("non-banned");
  if (user.isAdmin) visibility.push("admins-only");

  const now = new Date();
  const notifications = await Notification.find({
    $or: [
      { recipient: user._id },
      { recipient: null, visibleTo: { $in: visibility } },
    ],
    isArchived: false,
    expiresAt: { $gt: now },
  }).sort({ priority: -1, createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notifications));
});

const archiveNotification = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) throw new ApiError(403, "Admin access only");

  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new ApiError(400, "Invalid notification ID");
  }

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, "Notification not found");

  notification.isArchived = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, {}, "Notification archived"));
});

const getAllActiveNotifications = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) throw new ApiError(403, "Admin access only");

  const notifications = await Notification.find({ isArchived: false }).sort({
    createdAt: -1,
  });

  res.status(200).json(new ApiResponse(200, notifications));
});

export {
  createNotification,
  getNotifications,
  archiveNotification,
  getAllActiveNotifications,
};
