import { Feedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";
import { SwapRequest } from "../models/swaprequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const giveFeedback = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const { rating, comment, toUser } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(swapId) ||
    !mongoose.Types.ObjectId.isValid(toUser)
  ) {
    throw new ApiError(400, "Invalid swapId or toUser ID");
  }

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5");
  }

  if (comment && typeof comment !== "string") {
    throw new ApiError(400, "Comment must be a string");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");
  if (!["accepted", "completed"].includes(swap.status)) {
    throw new ApiError(400, "Feedback can only be left after a completed swap");
  }

  const existing = await Feedback.findOne({
    swap: swapId,
    fromUser: req.user._id,
    toUser,
  });
  if (existing) {
    throw new ApiError(
      409,
      "You have already submitted feedback for this user"
    );
  }

  const feedback = await Feedback.create({
    swap: swapId,
    fromUser: req.user._id,
    toUser,
    rating,
    comment,
  });

  const allFeedback = await Feedback.find({ toUser, isDeleted: { $ne: true } });
  const avgRating =
    allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

  await User.findByIdAndUpdate(toUser, {
    averageRating: avgRating.toFixed(1),
    feedbackCount: allFeedback.length,
  });

  res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted"));
});

const replyToFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { reply } = req.body;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  if (!reply || typeof reply !== "string" || !reply.trim()) {
    throw new ApiError(400, "Reply must be a non-empty string");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");
  if (feedback.isDeleted)
    throw new ApiError(400, "Cannot reply to deleted feedback");
  if (String(feedback.toUser) !== String(req.user._id)) {
    throw new ApiError(403, "You can only reply to feedback directed to you");
  }

  feedback.reply = reply;
  await feedback.save();

  res
    .status(200)
    .json(new ApiResponse(200, feedback, "Reply added to feedback"));
});

const getUserFeedback = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let filter = {};
  if (type === "given") filter.fromUser = req.user._id;
  else filter.toUser = req.user._id;

  filter.isDeleted = { $ne: true };

  const feedbacks = await Feedback.find(filter)
    .populate("fromUser toUser swap", "fullname username")
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, feedbacks));
});

const flagFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

  feedback.isFlagged = true;
  feedback.flaggedReason = reason?.trim() || "Inappropriate content";
  await feedback.save();

  res.status(200).json(new ApiResponse(200, feedback, "Feedback flagged"));
});

const unflagFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

  feedback.isFlagged = false;
  feedback.flaggedReason = undefined;
  await feedback.save();

  res.status(200).json(new ApiResponse(200, feedback, "Feedback unflagged"));
});

const getFlaggedFeedback = asyncHandler(async (req, res) => {
  const flagged = await Feedback.find({ isFlagged: true })
    .populate("fromUser toUser swap", "fullname username")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, flagged));
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

  feedback.isDeleted = true;
  await feedback.save();

  res.status(200).json(new ApiResponse(200, {}, "Feedback soft-deleted"));
});

const editFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    throw new ApiError(400, "Comment must be a non-empty string");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");
  if (feedback.isDeleted)
    throw new ApiError(400, "Cannot edit deleted feedback");
  if (String(feedback.fromUser) !== String(req.user._id)) {
    throw new ApiError(403, "You can only edit your own feedback");
  }

  feedback.editHistory = feedback.editHistory || [];
  feedback.editHistory.push({
    comment: feedback.comment,
    editedAt: new Date(),
  });
  feedback.comment = comment;
  await feedback.save();

  res
    .status(200)
    .json(new ApiResponse(200, feedback, "Feedback edited successfully"));
});

export {
  giveFeedback,
  replyToFeedback,
  getUserFeedback,
  flagFeedback,
  unflagFeedback,
  getFlaggedFeedback,
  deleteFeedback,
  editFeedback,
};
