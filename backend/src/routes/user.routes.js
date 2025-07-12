import express from "express";
import {
  register,
  login,
  googleAuth,
  logout,
  deleteAccount,
  updateAccountDetails,
  changeCurrentPassword,
  getCurrentUser,
  uploadProfilePhoto,
  togglePrivacy,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/update", verifyJWT, updateAccountDetails);
router.put("/password", verifyJWT, changeCurrentPassword);
router.delete("/delete", verifyJWT, deleteAccount);
router.post(
  "/upload-avatar",
  verifyJWT,
  upload.single("avatar"),
  uploadProfilePhoto
);
router.put("/toggle-privacy", verifyJWT, togglePrivacy);
router.post("/logout", verifyJWT, logout);

export default router;
