import { KeywordTracking } from "../models/keywordTracking.model.js";


//add a keyword to track
export const addKeyword = async (req, res) => {
    try {
        const {keyword, url} = req.body;

        if(!keyword || !url) return res.status(400).json({ success: false, message: "Keyword and URL are required" });

        // Extract domain from URL
        let domain;
        try {
            const urlObj = new URL(url.startsWith("http")? url : `https://${url}`);
            domain = urlObj.hostname.replace("www.", "")
        } catch {
            return res.status(400).json({ success: false, message: "Invalid URL format" });
        }

        // Check if already tracking this keyword+domain
        const existing = await KeywordTracking.findOne({userId: req.userId, keyword: keyword.toLowerCase().trim(), domain})
        
        if(existing){
              return res.status(400).json({ success: false, message: "Already tracking this keyword for this domain" });
        }

        //create tracking entry
        const tracking = await KeywordTracking.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startsWith("http") ? url : `https://${url}`,
            domain,
            status: "checking"
        })
        res.status(201).json({ success: true, message: "Keyword tracking started", tracking });

    }catch(error) {

    }
}