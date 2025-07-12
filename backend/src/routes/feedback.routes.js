import express from "express";
import {
  giveFeedback,
  replyToFeedback,
  getUserFeedback,
  flagFeedback,
  unflagFeedback,
  getFlaggedFeedback,
  deleteFeedback,
  editFeedback,
} from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.post("/:swapId", verifyJWT, giveFeedback);
router.put("/:feedbackId/reply", verifyJWT, replyToFeedback);
router.get("/", verifyJWT, getUserFeedback);
router.put("/:feedbackId/edit", verifyJWT, editFeedback);
router.put("/:feedbackId/flag", verifyJWT, flagFeedback);

// Admin
router.put("/:feedbackId/unflag", verifyJWT, isAdmin, unflagFeedback);
router.get("/admin/flagged", verifyJWT, isAdmin, getFlaggedFeedback);
router.delete("/:feedbackId", verifyJWT, isAdmin, deleteFeedback);

export default router;
