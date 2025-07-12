import express from "express";
import {
  createSkill,
  getAllApprovedSkills,
  getMySkills,
  updateSkill,
  deleteSkill,
  searchSkills,
  getSkillsForModeration,
  approveSkill,
  flagSkill,
  getSkillStats,
} from "../controllers/skill.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createSkill);
router.get("/", getAllApprovedSkills);
router.get("/mine", verifyJWT, getMySkills);
router.put("/:skillId", verifyJWT, updateSkill);
router.delete("/:skillId", verifyJWT, deleteSkill);
router.get("/search", searchSkills);

// Admin only
router.get("/admin/moderation", verifyJWT, isAdmin, getSkillsForModeration);
router.put("/admin/approve/:skillId", verifyJWT, isAdmin, approveSkill);
router.put("/admin/flag/:skillId", verifyJWT, isAdmin, flagSkill);
router.get("/admin/stats", verifyJWT, isAdmin, getSkillStats);

export default router;
