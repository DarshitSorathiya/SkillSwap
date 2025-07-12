import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
  try {
    if (!path) return null;
    // upload file in cloudinary
    const response = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary", response.url);
    fs.unlink(path);
    return response;
  } catch (error) {
    fs.unlinkSync(path); // remove the locally saved temp file
    return null;
  }
};

export { uploadOnCloudinary };
