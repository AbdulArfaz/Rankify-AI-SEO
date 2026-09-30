import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

export async function rankTracker(keyword, targetDomain) {
  console.log("🔥 SCRAPER FUNCTION TRIGGERED FOR:", keyword, targetDomain);

  let browser;
  try {
    const session = await bb.sessions.create({
      browserSettings: { blockAds: true },
    });
    browser = await chromium.connectOverCDP(session.connectUrl);
    const page = browser.contexts()[0].pages()[0];
    page.setDefaultNavigationTimeout(45000);

    await page.goto("https://www.google.com/", {
      waitUntil: "domcontentloaded",
    });

    try {
      const btn = await page.$(
        'button[id="L2AGLb"], form[action*="consent"] button'
      );
      if (btn) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    } catch {}

    let found = null;
    let allResults = [];
    const cleanTarget = targetDomain.replace("www.", "").toLowerCase();

    for (let gPage = 0; gPage < 5; gPage++) {
      const startParam = gPage * 10;
      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${startParam}&num=10&hl=en&gl=us`,
        { waitUntil: "domcontentloaded" }
      );

      let pageResults = [];
      for (let retry = 0; retry < 3; retry++) {
        try {
          await page.waitForSelector("h3", { timeout: 8000 });
          await page.waitForTimeout(1500);

          pageResults = await page.evaluate(() => {
            const items = document.querySelectorAll("div.g, div.MjjYud");

            return Array.from(items)
              .map((el) => {
                const h3 = el.querySelector("h3");
                const a = el.querySelector("a");

                if (!h3 || !a || !a.href) return null;

                let s = "";
                let c = el;
                for (let j = 0; j < 6 && c; j++, c = c.parentElement) {
                  const txt = c.innerText || "";
                  if (txt.length > h3.innerText.length + 50) {
                    s = txt
                      .split("\n")
                      .find(
                        (l) =>
                          l.length > 30 &&
                          !l.includes(h3.innerText.substring(0, 20))
                      ) || "";
                    if (s) break;
                  }
                }

                return {
                  url: a.href,
                  domain: new URL(a.href).hostname.replace("www.", ""),
                  title: h3.innerText.trim(),
                  snippet: s.trim().substring(0, 300),
                };
              })
              .filter(Boolean);
          });

          console.log( `Current Page Scanned: ${gPage + 1}`);
          console.log(`Total Results Found on Page: ${pageResults.length}`);

          if (pageResults.length > 0) break;

          await page.reload({ waitUntil: "domcontentloaded" });
        } catch (error) {
          if (retry === 2) break;
          await page.reload({ waitUntil: "domcontentloaded" });
        }
      }

      if (!pageResults.length) break;

      for (const r of pageResults) {
        console.log(`Scraped Domain: ${r.domain} | Target: ${cleanTarget}`);
        r.position = allResults.length + 1;
        allResults.push(r);

        if (
          !found &&
          (r.domain.toLowerCase().includes(cleanTarget) ||
            cleanTarget.includes(r.domain.toLowerCase()))
        ) {
          found = { ...r, page: gPage + 1 };
        }
      }

      if (found) break;
      await page.waitForTimeout(2000 + Math.random() * 2000);
    }

    await browser.close();

    const competitors = allResults.filter(
      (r) =>
        !r.domain.toLowerCase().includes(cleanTarget) &&
        !cleanTarget.includes(r.domain.toLowerCase())
    ).slice(0, 10);

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
    console.error("Rank check error:", error.message);
    if (browser) await browser.close().catch(() => {});
    return { success: false, error: error.message };
  }
}