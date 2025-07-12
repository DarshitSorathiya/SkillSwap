import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { expirePendingSwaps } from "./jobs/expireSwaps.job.js";
import "./jobs/clearExpiredOtps.js";

dotenv.config({
  path: "./.env",
});

expirePendingSwaps();

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR : ", err);
      throw err;
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
