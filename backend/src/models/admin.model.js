import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "approve_skill",
        "flag_skill",
        "ban_user",
        "delete_swap",
        "send_notification",
      ],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    targetSwap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
