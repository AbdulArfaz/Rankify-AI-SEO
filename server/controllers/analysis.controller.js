import Analysis from '../models/analysis.model.js';

//analyze a url
export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if(!url) {
      return res.status(400).json({success: false, message: "URL is required"});
    }
    let validUrl;
    try {
      validUrl = new Url(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
      return res.status(400).json({success: false, message: "Invalid URL format"});
    }
    const analysis = await Analysis.create({userId: req.userId, url: validUrl.href, status: "processing"})
    return res.status(201).json({success: true, message: "Analysis created", analysisId:analysis._id});

    
  } catch (error) {
    return res.status(500).json({success: false, message: "Internal server error"});
  }
}


//get analysis by ID
export const getAnalysis = async (req, res) => {
    
}

//get all analyses for user
export const getUserAnalyses = async (req, res) => {
    
}

//delete analysis
export const deleteAnalysis = async (req, res) => {
    
}