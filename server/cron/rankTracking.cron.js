import cron from 'node-cron';
import {KeywordTracking} from '../models/keywordTracking.model.js'
import { keywordTracking } from '../services/keywordTracking.service.js'

export function startRankTrackingCron() {
    cron.schedule("0 6 * * *", async () => {
        console.log("Starting daily rank tracking...");
        try {
            const activeTracking = await KeywordTracking.find({active: true})
            for(const tracking of activeTracking)
                tracking.status = "checking";
              await tracking.save()

              const result = await keywordTracking(tracking)
              await new Promise((r)=>setTimeout(r, 10000 + Math.random() * 5000))
        } catch (error) {
            console.log("[CRON] Rank Tracking cron error:", error.message)
        }
    })
    console.log("Ranking Tracking cron Job scheduled")
}