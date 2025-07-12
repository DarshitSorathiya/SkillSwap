import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = 3000;

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
