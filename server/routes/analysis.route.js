import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { analyzeUrl, getUserAnalyses, getAnalysis, deleteAnalysis } from "../controllers/analysis.controller.js";

const analysisRouter = express.Router();

analysisRouter.post('/analyze', verifyJWT, analyzeUrl);
analysisRouter.get('/list', verifyJWT, getUserAnalyses);
analysisRouter.get('/:id', verifyJWT, getAnalysis);
analysisRouter.delete('/:id', verifyJWT, deleteAnalysis);


export default analysisRouter;
