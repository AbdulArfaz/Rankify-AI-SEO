import axios from "axios";

export async function rankTracker(keyword, targetDomain) {

  try {
    let cleanTarget = targetDomain.trim().toLowerCase();
    try {
      if (!cleanTarget.startsWith("http")) cleanTarget = "https://" + cleanTarget;
      cleanTarget = new URL(cleanTarget).hostname;
    } catch {}
    cleanTarget = cleanTarget.replace(/^www\./, "");

    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: keyword,
        gl: "us",
        hl: "en",
        num: 50, 
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const organicResults = response.data.organic || [];
    console.log(`Total Results Returned from Serper: ${organicResults.length}`);

    if (organicResults.length === 0) {
      return { success: false, error: "Zero results returned from SERP API." };
    }

    let found = null;
    let allResults = [];

    organicResults.forEach((item, index) => {
      let domain = "";
      try {
        domain = new URL(item.link).hostname.replace(/^www\./, "").toLowerCase();
      } catch {}

      const resultObj = {
        position: index + 1,
        page: Math.floor(index / 10) + 1,
        url: item.link,
        domain,
        title: item.title || "",
        snippet: item.snippet || "",
      };

      allResults.push(resultObj);

      if (
        !found &&
        (domain === cleanTarget || domain.endsWith("." + cleanTarget))
      ) {
        found = resultObj;
      }
    });

    const competitors = allResults
      .filter(
        (r) =>
          r.domain !== cleanTarget &&
          !r.domain.endsWith("." + cleanTarget)
      )
      .slice(0, 10);

    return {
      success: true,
      data: {
        keyword,
        targetDomain,
        position: found?.position || null,
        page: found?.page || null,
        title: found?.title || "",
        snippet: found?.snippet || "",
        competitors,
        totalResultsScanned: allResults.length,
      },
    };
  } catch (error) {
    console.error("Serper API error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}