const puppeteer = require("puppeteer");

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function parsePostingDate(text) {
  const cleaned = (text || "").replace(/Posted:?/i, "").trim();
  const parsed = Date.parse(cleaned);
  return isNaN(parsed) ? new Date() : new Date(parsed);
}

function inferJobType(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("intern")) return "Internship";
  if (t.includes("part-time") || t.includes("part time")) return "Part-time";
  if (t.includes("contract")) return "Contract";
  return "Full-time";
}

async function scrapeActuaryList(page, maxPages = 1) {
  const results = [];
  for (let p = 1; p <= maxPages; p++) {
    const url =
      p === 1
        ? "https://www.actuarylist.com/"
        : `https://www.actuarylist.com/?page=${p}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("div.Job_job-card__YgDAV", { timeout: 15000 });

    const pageJobs = await page.evaluate(() => {
      function txt(el) {
        return el ? el.textContent.trim() : "";
      }
      const cards = Array.from(
        document.querySelectorAll("div.Job_job-card__YgDAV")
      );

      return cards.map((card) => {
        const company = txt(
          card.querySelector("p.Job_job-card__company__7T9qY")
        );
        const title = txt(
          card.querySelector("p.Job_job-card__position__ic1rc")
        );
        const locationNodes = card.querySelectorAll(
          "div.Job_job-card__locations__x1exr a"
        );
        const locations = Array.from(locationNodes)
          .map((n) => txt(n))
          .filter(Boolean)
          .join(", ");
        const tags = Array.from(
          card.querySelectorAll("div.Job_job-card__tags__zfriA a")
        ).map((n) => txt(n));
        const meta = txt(
          card.querySelector("p.Job_job-card__posted-on__NCZaJ")
        );

        return { title, company, location: locations, meta, tags };
      });
    });

    console.log(`Page ${p} raw scraped jobs:`, pageJobs.slice(0, 3));

    for (const j of pageJobs) {
      const title = normalizeText(j.title);
      const company = normalizeText(j.company);
      const location = normalizeText(j.location);
      const posting_date = parsePostingDate(j.meta);
      const job_type = inferJobType([j.meta, ...(j.tags || [])].join(" "));
      const tags = Array.from(
        new Set((j.tags || []).map((t) => normalizeText(t)).filter(Boolean))
      ).slice(0, 10);

      if (title && company) {
        results.push({
          title,
          company,
          location,
          posting_date,
          job_type,
          tags,
        });
      }
    }
  }
  return results;
}

async function scrapeJobs({ headless = "new", pages = 1 } = {}) {
  const browser = await puppeteer.launch({
    headless,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
    );
    const jobs = await scrapeActuaryList(page, pages);
    console.log(`✅ Scraped ${jobs.length} jobs`);
    return jobs;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeJobs };
