import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    message: { type: String, required: true, maxlength: 1000 },
    type: {
      type: String,
      enum: ["info", "warning", "alert", "feature"],
      default: "info",
    },
    priority: { type: Number, default: 1 },
    visibleTo: {
      type: String,
      enum: ["all", "banned", "non-banned", "admins-only"],
      default: "all",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    isArchived: { type: Boolean, default: false },
    dismissible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
