import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSkill = asyncHandler(async (req, res) => {
  const { name, description, category, tags } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Skill name is required");
  }

  const existing = await Skill.findOne({
    name: name.toLowerCase(),
    createdBy: req.user._id,
  });

  if (existing) {
    throw new ApiError(409, "You already submitted this skill");
  }

  const skill = await Skill.create({
    name,
    description,
    createdBy: req.user._id,
    category,
    tags,
  });

  res
    .status(201)
    .json(new ApiResponse(201, skill, "Skill created successfully"));
});

const getAllApprovedSkills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const skills = await Skill.find({ isApproved: true, isFlagged: false })
    .populate("createdBy", "fullname username")
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, skills));
});

const getMySkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(new ApiResponse(200, skills));
});

const updateSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const { name, description, category, tags } = req.body;

  const skill = await Skill.findOne({ _id: skillId, createdBy: req.user._id });

  if (!skill) throw new ApiError(404, "Skill not found");
  if (skill.isApproved)
    throw new ApiError(403, "Approved skills cannot be edited");

  skill.name = name?.toLowerCase() || skill.name;
  skill.description = description || skill.description;
  skill.category = category || skill.category;
  skill.tags = tags || skill.tags;

  await skill.save();

  res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill updated successfully"));
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const skill = await Skill.findOne({
    _id: skillId,
    createdBy: req.user._id,
    isApproved: false,
  });

  if (!skill) throw new ApiError(404, "Skill not found or already approved");

  skill.isDeleted = true;
  await skill.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Skill soft-deleted successfully"));
});

const searchSkills = asyncHandler(async (req, res) => {
  const { keyword, category } = req.query;

  if (!keyword && !category)
    throw new ApiError(400, "Search keyword or category required");

  const filter = {
    isApproved: true,
    isFlagged: false,
  };

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) filter.category = category;

  const results = await Skill.find(filter).limit(20);
  res.status(200).json(new ApiResponse(200, results));
});

const getSkillsForModeration = asyncHandler(async (req, res) => {
  const skills = await Skill.find({
    $or: [{ isApproved: false }, { isFlagged: true }],
  })
    .populate("createdBy", "fullname email")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, skills));
});

const approveSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const skill = await Skill.findById(skillId);
  if (!skill) throw new ApiError(404, "Skill not found");

  skill.isApproved = true;
  skill.isFlagged = false;
  await skill.save();

  res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill approved successfully"));
});

const flagSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const skill = await Skill.findById(skillId);
  if (!skill) throw new ApiError(404, "Skill not found");

  skill.isFlagged = true;
  skill.isApproved = false;
  await skill.save();

  res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill flagged as inappropriate"));
});

const getSkillStats = asyncHandler(async (req, res) => {
  const total = await Skill.countDocuments();
  const approved = await Skill.countDocuments({ isApproved: true });
  const flagged = await Skill.countDocuments({ isFlagged: true });

  res
    .status(200)
    .json(
      new ApiResponse(200, { total, approved, flagged }, "Skill stats fetched")
    );
});

export {
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
};
