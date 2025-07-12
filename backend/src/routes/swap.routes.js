import express from "express";
import {
  createSwap,
  getMySwaps,
  getSwapById,
  respondToSwap,
  deleteSwap,
  completeSwap,
  getAllSwapsAdmin,
} from "../controllers/swap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createSwap);
router.get("/mine", verifyJWT, getMySwaps);
router.get("/:swapId", verifyJWT, getSwapById);
router.put("/:swapId/respond", verifyJWT, respondToSwap);
router.delete("/:swapId", verifyJWT, deleteSwap);
router.put("/:swapId/complete", verifyJWT, completeSwap);

// Admin
router.get("/admin/all", verifyJWT, isAdmin, getAllSwapsAdmin);

export default router;
