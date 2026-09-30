import { KeywordTracking } from "../models/keywordTracking.model.js";
import { keywordTracking } from "../services/keywordTracking.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a keyword to track
export const addKeyword = asyncHandler(async (req, res) => {
  const { keyword, url } = req.body;

  if (!keyword || !url) {
    throw new ApiError(400, "Keyword and URL are required");
  }

  let domain;
  try {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(formattedUrl);
    domain = urlObj.hostname.replace("www.", "");
  } catch (error) {
    throw new ApiError(400, "Invalid URL format");
  }

  const cleanKeyword = keyword.toLowerCase().trim();
  const finalUrl = url.startsWith("http") ? url : `https://${url}`;

  const existing = await KeywordTracking.findOne({
    userId: req.user._id,
    keyword: cleanKeyword,
    domain,
  });

  if (existing) {
    throw new ApiError(400, "Already tracking this keyword for this domain");
  }

  const tracking = await KeywordTracking.create({
    userId: req.user._id,
    keyword: cleanKeyword,
    url: finalUrl,
    domain,
    status: "checking",
  });

  keywordTracking(tracking).catch((err) => {
    console.error("Background tracking execution error:", err.message);
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tracking, "Keyword tracking started"));
});




//get all tracked keyword for user
export const getKeywords = asyncHandler(async (req, res) => {
  const keywords = await KeywordTracking.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-rankHistory");

  return res
    .status(200)
    .json(new ApiResponse(200, keywords, "Tracked keywords fetched successfully."));
});


//get single keyword with full history
export const getKeyword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tracking = await KeywordTracking.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tracking, "Keyword details fetched successfully."));
});



// Manually refresh a keyword ranking
export const refreshKeyword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tracking = await KeywordTracking.findOne({
    _id: id,
    userId: req.user._id, 
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found.");
  }

  tracking.status = "checking";
  await tracking.save();

  keywordTracking(tracking).catch((err) => {
    console.error("Background refresh execution error:", err.message);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tracking, "Rank check started successfully."));
});




// Delete keyword tracking
export const deleteKeyword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tracking = await KeywordTracking.findOneAndDelete({
    _id: id,
    userId: req.user._id, 
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Keyword tracking deleted successfully."));
});


// Toggle tracking active/inactive
export const toggleTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tracking = await KeywordTracking.findOne({
    _id: id,
    userId: req.user._id, 
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found.");
  }

  tracking.active = !tracking.active;
  await tracking.save();

  const statusMessage = tracking.active 
    ? "Keyword tracking resumed successfully." 
    : "Keyword tracking paused successfully.";

  return res
    .status(200)
    .json(new ApiResponse(200, tracking, statusMessage));
});