import cron from "node-cron";
import { SwapRequest } from "../models/swaprequest.model.js";

export const expirePendingSwaps = () => {
  cron.schedule("*0 0 * * *", async () => {
    console.log("[CRON] Checking for expired swap requests...");

    const now = new Date();

    const result = await SwapRequest.updateMany(
      {
        status: "pending",
        expiresAt: { $lt: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[CRON] ${result.modifiedCount} swap requests expired.`);
    } else {
      console.log("[CRON] No pending swaps expired.");
    }
  });
};
