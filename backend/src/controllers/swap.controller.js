import mongoose from "mongoose";
import { SwapRequest } from "../models/swaprequest.model.js";
import { User } from "../models/user.model.js";
import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

const createSwapRequest = asyncHandler(async (req, res) => {
  const { recipientId, offeredSkill, requestedSkill, message } = req.body;

  if (!recipientId || !offeredSkill || !requestedSkill) {
    throw new ApiError(400, "All fields are required");
  }
  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    throw new ApiError(400, "Invalid recipient ID");
  }
  if (!mongoose.Types.ObjectId.isValid(offeredSkill)) {
    throw new ApiError(400, "Invalid offered skill ID");
  }
  if (!mongoose.Types.ObjectId.isValid(requestedSkill)) {
    throw new ApiError(400, "Invalid requested skill ID");
  }

  if (recipientId === String(req.user._id)) {
    throw new ApiError(400, "You cannot send a swap request to yourself");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) throw new ApiError(404, "Recipient does not exist");

  const offeredSkillDoc = await Skill.findById(offeredSkill);
  if (!offeredSkillDoc) throw new ApiError(404, "Offered skill not found");

  const requestedSkillDoc = await Skill.findById(requestedSkill);
  if (!requestedSkillDoc) throw new ApiError(404, "Requested skill not found");

  const sender = await User.findById(req.user._id);
  if (!sender.skillsOffered.includes(offeredSkill)) {
    throw new ApiError(403, "You must list the offered skill in your profile");
  }
  if (!recipient.skillsWanted.includes(requestedSkill)) {
    throw new ApiError(403, "Recipient must have requested this skill");
  }

  const duplicate = await SwapRequest.findOne({
    requester: req.user._id,
    recipient: recipientId,
    offeredSkill,
    requestedSkill,
    status: "pending",
  });
  if (duplicate) {
    throw new ApiError(409, "A similar swap request is already pending");
  }

  const swap = await SwapRequest.create({
    requester: req.user._id,
    recipient: recipientId,
    offeredSkill,
    requestedSkill,
    message,
  });

  res.status(201).json(new ApiResponse(201, swap, "Swap request created"));
});

const getMySwaps = asyncHandler(async (req, res) => {
  const swaps = await SwapRequest.find({
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    $or: [
      { isDeletedByRequester: { $ne: true } },
      { isDeletedByRecipient: { $ne: true } },
    ],
  })
    .populate("offeredSkill requestedSkill requester recipient")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, swaps));
});

const respondToSwap = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const { action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID");
  }
  if (!action || !["accepted", "rejected"].includes(action)) {
    throw new ApiError(400, "Invalid action");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap request not found");
  if (String(swap.recipient) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to respond to this request"
    );
  }

  swap.status = action;
  await swap.save();

  if (action === "accepted") {
    const recipientUser = await User.findById(swap.recipient);
    const requesterUser = await User.findById(swap.requester);

    await sendEmail(
      requesterUser.email,
      "Your Swap Request Was Accepted!",
      `Hello ${requesterUser.fullname},\n\nGreat news! Your swap request has been accepted by ${recipientUser.fullname}.\nYou can now connect and proceed with the skill exchange.\n\nThanks,\nSkill Swap Platform Team`
    );
  }

  res.status(200).json(new ApiResponse(200, swap, `Swap ${action}`));
});

const deleteSwap = asyncHandler(async (req, res) => {
  const { swapId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");
  if (swap.status !== "pending") {
    throw new ApiError(400, "Only pending swaps can be deleted");
  }

  if (String(swap.requester) === String(req.user._id)) {
    swap.isDeletedByRequester = true;
  } else if (String(swap.recipient) === String(req.user._id)) {
    swap.isDeletedByRecipient = true;
  } else {
    throw new ApiError(403, "You are not authorized to delete this swap");
  }

  await swap.save();
  res.status(200).json(new ApiResponse(200, {}, "Swap deleted from your view"));
});

const leaveFeedback = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const { rating, feedback } = req.body;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID");
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");
  if (!["accepted", "completed"].includes(swap.status)) {
    throw new ApiError(
      400,
      "Feedback can only be left after a swap is accepted or completed"
    );
  }

  const userId = req.user._id;
  if (String(swap.requester) === String(userId)) {
    swap.ratingByRequester = rating;
    swap.feedbackByRequester = feedback;
  } else if (String(swap.recipient) === String(userId)) {
    swap.ratingByRecipient = rating;
    swap.feedbackByRecipient = feedback;
  } else {
    throw new ApiError(403, "You are not a participant in this swap");
  }

  await swap.save();
  res.status(200).json(new ApiResponse(200, swap, "Feedback submitted"));
});

const adminGetAllSwaps = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = status ? { status } : {};
  const swaps = await SwapRequest.find(filter)
    .populate("requester recipient offeredSkill requestedSkill")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, swaps));
});

const markSwapCompleted = asyncHandler(async (req, res) => {
  const { swapId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");

  const userId = req.user._id;
  if (
    String(swap.requester) !== String(userId) &&
    String(swap.recipient) !== String(userId)
  ) {
    throw new ApiError(403, "You are not authorized to complete this swap");
  }

  if (swap.status !== "accepted") {
    throw new ApiError(400, "Only accepted swaps can be marked as completed");
  }

  swap.status = "completed";
  await swap.save();

  res.status(200).json(new ApiResponse(200, swap, "Swap marked as completed"));
});

const adminCancelSwap = asyncHandler(async (req, res) => {
  const { swapId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID");
  }

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");

  swap.status = "cancelled";
  await swap.save();

  res.status(200).json(new ApiResponse(200, swap, "Swap cancelled by admin"));
});

export {
  createSwapRequest,
  getMySwaps,
  respondToSwap,
  deleteSwap,
  leaveFeedback,
  adminGetAllSwaps,
  markSwapCompleted,
  adminCancelSwap,
};
