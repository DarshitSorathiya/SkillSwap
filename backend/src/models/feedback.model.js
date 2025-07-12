import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    editHistory: [
      {
        comment: String,
        editedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
