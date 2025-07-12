import express from "express";
import {
  createNotification,
  getNotifications,
  archiveNotification,
  getAllActiveNotifications,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.post("/", verifyJWT, isAdmin, createNotification);
router.put("/:notificationId/archive", verifyJWT, isAdmin, archiveNotification);
router.get("/admin/active", verifyJWT, isAdmin, getAllActiveNotifications);

export default router;
