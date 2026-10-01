import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeUrl(url) {
  const startTime = Date.now();
  try {
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

    // Fetch raw HTML using Axios with a standard browser User-Agent
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 30000,
    });

    const loadTime = Date.now() - startTime;
    const statusCode = response.status;
    const html = response.data;
    const pageSize = html.length;

    // Load HTML into Cheerio for fast DOM parsing
    const $ = cheerio.load(html);

    const getMeta = (name) => {
      const el = $(`meta[name="${name}"], meta[property="${name}"]`).first();
      return el.attr("content") || null;
    };

    const title = $("title").text().trim() || "";
    const description = getMeta("description");
    const canonical = $('link[rel="canonical"]').attr("href") || "";
    const robots = getMeta("robots");
    const ogTitle = getMeta("og:title") || getMeta("og:Title");
    const ogDescription = getMeta("og:description");
    const ogImage = getMeta("og:image");
    const twitterCard = getMeta("twitter:card");
    const viewport = getMeta("viewport");
    const charset = $("meta[charset]").attr("charset") || "";

    const h1Texts = [];
    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Texts.push(text);
    });

    const headings = {
      h1: $("h1").length,
      h2: $("h2").length,
      h3: $("h3").length,
      h4: $("h4").length,
      h5: $("h5").length,
      h6: $("h6").length,
      h1Texts,
    };

    let internalLinks = 0;
    let externalLinks = 0;
    const currentHost = new URL(targetUrl).hostname;
    const allLinks = $("a[href]");

    allLinks.each((_, el) => {
      const href = $(el).attr("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
      try {
        const linkUrl = new URL(href, targetUrl);
        if (linkUrl.hostname === currentHost) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch {}
    });

    const allImages = $("img");
    let missingAlt = 0;
    allImages.each((_, el) => {
      const alt = $(el).attr("alt");
      if (!alt || alt.trim() === "") missingAlt++;
    });

    // Remove scripts and styles before extracting body text for accurate word count
    $("script, style, noscript").remove();
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

    return {
      success: true,
      data: {
        url: targetUrl,
        statusCode,
        loadTime,
        metaData: {
          title,
          description,
          canonical,
          robots,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          viewport,
          charset,
        },
        headings,
        links: {
          internal: internalLinks,
          external: externalLinks,
          total: allLinks.length,
        },
        images: {
          total: allImages.length,
          missingAlt,
          withAlt: allImages.length - missingAlt,
        },
        wordCount,
        pageSize,
        bodyText: bodyText.substring(0, 3000),
      },
    };
  } catch (error) {
    console.error("[SCRAPER ERROR]:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}