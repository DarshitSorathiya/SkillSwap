import express from "express";
import {
  toggleUserBan,
  toggleAdminAccess,
  getAllUsers,
  downloadUserReport,
  getAdminLogs,
  clearExpiredNotifications,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.get("/users", verifyJWT, isAdmin, getAllUsers);
router.put("/ban/:userId", verifyJWT, isAdmin, toggleUserBan);
router.put("/admin/:userId", verifyJWT, isAdmin, toggleAdminAccess);
router.get("/logs", verifyJWT, isAdmin, getAdminLogs);
router.get("/report/users", verifyJWT, isAdmin, downloadUserReport);
router.put(
  "/notifications/cleanup",
  verifyJWT,
  isAdmin,
  clearExpiredNotifications
);

export default router;
