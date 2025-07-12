import cron from "node-cron";
import { User } from "../models/user.model.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await User.updateMany(
      { otpExpiresAt: { $lt: new Date() } },
      { $unset: { otp: "", otpExpiresAt: "" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[CRON] Cleared ${result.modifiedCount} expired OTP(s)`);
    }
  } catch (error) {
    console.error("[CRON] Error clearing expired OTPs:", error.message);
  }
});
