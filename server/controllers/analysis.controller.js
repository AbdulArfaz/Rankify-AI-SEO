import {Analysis} from "../models/analysis.model.js";
import { scrapeUrl } from "../services/scraper.service.js";
import { analyzeWithGemini } from "../services/gemini.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const analyzeUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  let validUrl;
  try {
    validUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch (error) {
    throw new ApiError(400, "Invalid URL format");
  }

  const analysis = await Analysis.create({
    userId: req.user._id,
    url: validUrl.href,
    status: "processing",
  });

  const scrapResult = await scrapeUrl(validUrl.href);
  if (!scrapResult.success) {
    analysis.status = "failed";
    await analysis.save();
    throw new ApiError(500, scrapResult.error || "Failed to scrape target URL");
  }

  const aiResult = await analyzeWithGemini(scrapResult.data);
  if (!aiResult.success) {
    analysis.status = "failed";
    await analysis.save();
    throw new ApiError(500, aiResult.error || "AI analysis failed");
  }

  analysis.overallScore = aiResult.data.overallScore || 0;
  analysis.categories = aiResult.data.categories || {};
  analysis.metaData = aiResult.data.metaData || {};
  analysis.headings = aiResult.data.headings || {};
  analysis.links = aiResult.data.links || {};
  analysis.images = aiResult.data.images || {};
  analysis.keywords = aiResult.data.keywords || [];
  analysis.issues = aiResult.data.issues || [];
  analysis.loadTime = scrapResult.data.loadTime || 0;
  analysis.wordCount = scrapResult.data.wordCount || 0;
  analysis.pageSize = scrapResult.data.pageSize || 0;
  analysis.status = "completed";

  await analysis.save();

  return res
    .status(200)
    .json(new ApiResponse(200, analysis, "Analysis completed successfully"));
});

// Get analysis by ID
export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, analysis, "Analysis fetched successfully"));
});

// Get all analyses for user with pagination
export const getUserAnalyses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-issues -keywords");

  const totalAnalyses = await Analysis.countDocuments({
    userId: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analyses,
        pagination: {
          page,
          limit,
          total: totalAnalyses,
          pages: Math.ceil(totalAnalyses / limit),
        },
      },
      "User analyses fetched successfully"
    )
  );
});

// Delete analysis by ID
export const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findByIdAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Analysis not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Analysis deleted successfully"));
});
