import { User } from "../models/user.model.js";
import { AdminLog } from "../models/adminLog.model.js";
import { Skill } from "../models/skill.model.js";
import { Feedback } from "../models/feedback.model.js";
import { SwapRequest } from "../models/swap.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Parser } from "json2csv";

const toggleUserBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.isAdmin) throw new ApiError(403, "Cannot ban another admin");

  user.isBanned = !user.isBanned;
  await user.save();

  await AdminLog.create({
    action: user.isBanned ? "ban_user" : "unban_user",
    performedBy: req.user._id,
    targetUser: user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        user.isBanned ? "User banned" : "User unbanned"
      )
    );
});

const toggleAdminAccess = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.isAdmin = !user.isAdmin;
  await user.save();

  await AdminLog.create({
    action: user.isAdmin ? "promote_admin" : "demote_admin",
    performedBy: req.user._id,
    targetUser: user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        user.isAdmin ? "User promoted to admin" : "User demoted from admin"
      )
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, banned, search } = req.query;
  const filter = {};

  if (role === "admin") filter.isAdmin = true;
  if (role === "user") filter.isAdmin = false;
  if (banned === "true") filter.isBanned = true;
  if (banned === "false") filter.isBanned = false;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, users));
});

const downloadUserReport = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    "username fullname email isAdmin isBanned createdAt updatedAt"
  );
  const parser = new Parser();
  const csv = parser.parse(users);

  res.header("Content-Type", "text/csv");
  res.attachment("user_report.csv");
  res.send(csv);
});

const getAdminLogs = asyncHandler(async (req, res) => {
  const logs = await AdminLog.find()
    .populate(
      "performedBy targetUser targetSkill targetSwap",
      "username fullname name"
    )
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, logs));
});

const clearExpiredNotifications = asyncHandler(async (req, res) => {
  const now = new Date();
  const result = await Notification.updateMany(
    { expiresAt: { $lt: now }, isArchived: false },
    { $set: { isArchived: true } }
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "Expired notifications archived"));
});

export {
  toggleUserBan,
  toggleAdminAccess,
  getAllUsers,
  downloadUserReport,
  getAdminLogs,
  clearExpiredNotifications,
};
