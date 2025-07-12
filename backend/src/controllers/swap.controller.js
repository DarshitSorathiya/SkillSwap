import { SwapRequest } from "../models/swap.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSwapRequest = asyncHandler(async (req, res) => {
  const { recipientId, offeredSkill, requestedSkill, message } = req.body;

  if (!recipientId || !offeredSkill || !requestedSkill) {
    throw new ApiError(400, "All fields are required");
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

  const swap = await SwapRequest.findById(swapId);

  if (!swap) throw new ApiError(404, "Swap request not found");
  if (String(swap.recipient) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You are not authorized to respond to this request"
    );
  }

  if (!["accepted", "rejected"].includes(action)) {
    throw new ApiError(400, "Invalid action");
  }

  swap.status = action;
  await swap.save();

  res.status(200).json(new ApiResponse(200, swap, `Swap ${action}`));
});

const deleteSwap = asyncHandler(async (req, res) => {
  const { swapId } = req.params;

  const swap = await SwapRequest.findById(swapId);

  if (!swap) throw new ApiError(404, "Swap not found");
  if (swap.status !== "pending")
    throw new ApiError(400, "Only pending swaps can be deleted");

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

  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw new ApiError(404, "Swap not found");
  if (swap.status !== "accepted" && swap.status !== "completed") {
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
};
