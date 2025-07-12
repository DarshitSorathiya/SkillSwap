import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    requestedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    isDeletedByRequester: {
      type: Boolean,
      default: false,
    },
    isDeletedByRecipient: {
      type: Boolean,
      default: false,
    },
    ratingByRequester: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedbackByRequester: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    ratingByRecipient: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedbackByRecipient: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      },
    },

    flaggedByAdmin: {
      type: Boolean,
      default: false,
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
