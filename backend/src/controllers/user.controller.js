import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User doesn't exist in database");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error generating access and refresh token");
  }
};

const register = asyncHandler(async (req, res) => {
  const {
    username,
    fullname,
    email,
    password,
    phoneNo,
    dob,
    gender,
    isPublicProfile = true,
    skillsOffered = [],
    skillsWanted = [],
    availability = [],
  } = req.body;

  if (
    [username, fullname, email, password, phoneNo, dob].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existed = await User.findOne({ $or: [{ username }, { email }] });
  if (existed) throw new ApiError(400, "User already exists. Try logging in.");

  const user = await User.create({
    username,
    fullname,
    email,
    password,
    phoneNo,
    dob,
    gender,
    isPublicProfile,
    skillsOffered,
    skillsWanted,
    availability,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "User creation failed");

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { createdUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email))
    throw new ApiError(400, "Username or email is required");

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(401, "User not found");

  const isCorrect = await user.isPasswordCorrect(password);
  if (!isCorrect) throw new ApiError(401, "Incorrect password");

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedIn) throw new ApiError(500, "Login failed");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { loggedIn, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id)
    throw new ApiError(400, "User is not authenticated");

  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {
    fullname,
    phoneNo,
    email,
    dob,
    skillsOffered,
    skillsWanted,
    availability,
    isPublicProfile,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(400, "User not found");

  user.fullname = fullname || user.fullname;
  user.phoneNo = phoneNo || user.phoneNo;
  user.email = email || user.email;
  user.dob = dob || user.dob;
  user.skillsOffered = skillsOffered || user.skillsOffered;
  user.skillsWanted = skillsWanted || user.skillsWanted;
  user.availability = availability || user.availability;
  user.isPublicProfile =
    typeof isPublicProfile === "boolean"
      ? isPublicProfile
      : user.isPublicProfile;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account updated successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (newPassword !== confPassword)
    throw new ApiError(400, "New password and confirm password must match");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(400, "User not found");

  const isCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isCorrect) throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!req.file || !req.file.path) {
    throw new ApiError(400, "No file uploaded");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const uploadResult = await uploadOnCloudinary(req.file.path);

  if (!uploadResult) {
    throw new ApiError(500, "Cloudinary upload failed");
  }

  if (user.profilePhoto?.public_id) {
    await cloudinary.uploader.destroy(user.profilePhoto.public_id);
  }

  user.profilePhoto = {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  };

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.profilePhoto,
        "Profile photo uploaded successfully"
      )
    );
});

const togglePrivacy = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  user.isPublicProfile = !user.isPublicProfile;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublicProfile: user.isPublicProfile },
        "Privacy status updated"
      )
    );
});

export {
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
};
