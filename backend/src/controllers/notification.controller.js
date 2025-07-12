import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNotification = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin)
    throw new ApiError(403, "Only admins can send notifications");

  const { title, message, type, visibleTo, priority, expiresAt, dismissible } =
    req.body;

  if (!message?.trim()) throw new ApiError(400, "Message is required");

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
    visibleTo: { $in: visibility },
    isArchived: false,
    expiresAt: { $gt: now },
  }).sort({ priority: -1, createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notifications));
});

const archiveNotification = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) throw new ApiError(403, "Admin access only");

  const { notificationId } = req.params;
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
