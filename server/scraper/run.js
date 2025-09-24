require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { scrapeJobs } = require("./scrapeJobs");
const Job = require("../models/Job");

(async () => {
  try {
    await connectDB();
    console.log("Starting scrape...");
    const jobs = await scrapeJobs({ pages: 1 });
    console.log(`Scraped ${jobs.length} jobs. Upserting...`);

    let upserted = 0;
    for (const j of jobs) {
      const key = {
        title: j.title,
        company: j.company,
        posting_date: j.posting_date,
      };
      await Job.updateOne(key, { $set: j }, { upsert: true });
      upserted++;
    }
    console.log(`Upserted ${upserted} jobs.`);
  } catch (e) {
    console.error("Scrape failed:", e);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
