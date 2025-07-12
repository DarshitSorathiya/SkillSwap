import express from "express";
import {
  createSwapRequest,
  getMySwaps,
  respondToSwap,
  deleteSwap,
  leaveFeedback,
  markSwapCompleted,
  adminGetAllSwaps,
  adminCancelSwap,
} from "../controllers/swap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createSwapRequest);
router.get("/mine", verifyJWT, getMySwaps);
router.put("/:swapId/respond", verifyJWT, respondToSwap);
router.delete("/:swapId", verifyJWT, deleteSwap);
router.post("/:swapId/feedback", verifyJWT, leaveFeedback);
router.put("/:swapId/complete", verifyJWT, markSwapCompleted);

router.get("/admin/all", verifyJWT, isAdmin, adminGetAllSwaps);
router.put("/admin/:swapId/cancel", verifyJWT, isAdmin, adminCancelSwap);

export default router;
