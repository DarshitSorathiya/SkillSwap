import { Feedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";
import { SwapRequest } from "../models/swap.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const giveFeedback = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const { rating, comment, toUser } = req.body;

  if (!rating || !toUser) {
    throw new ApiError(400, "Rating and toUser are required");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");
  if (swap.status !== "accepted" && swap.status !== "completed") {
    throw new ApiError(400, "Feedback can only be left after a completed swap");
  } 

  const existing = await Feedback.findOne({
    swap: swapId,
    fromUser: req.user._id,
    toUser,
  });
  if (existing)
    throw new ApiError(
      409,
      "You have already submitted feedback for this user"
    );

  const feedback = await Feedback.create({
    swap: swapId,
    fromUser: req.user._id,
    toUser,
    rating,
    comment,
  });

  const allFeedback = await Feedback.find({ toUser });
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

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

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

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

  feedback.isFlagged = true;
  feedback.flaggedReason = reason || "Inappropriate content";
  await feedback.save();

  res.status(200).json(new ApiResponse(200, feedback, "Feedback flagged"));
});

const unflagFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

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

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new ApiError(404, "Feedback not found");

  feedback.isDeleted = true;
  await feedback.save();

  res.status(200).json(new ApiResponse(200, {}, "Feedback soft-deleted"));
});

export {
  giveFeedback,
  replyToFeedback,
  getUserFeedback,
  flagFeedback,
  unflagFeedback,
  getFlaggedFeedback,
  deleteFeedback,
};
