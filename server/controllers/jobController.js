const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const { scrapeJobs } = require("../scraper/scrapeJobs");

const SORT_MAP = {
  posting_date_desc: { posting_date: -1 },
  posting_date_asc: { posting_date: 1 },
  title_asc: { title: 1 },
  title_desc: { title: -1 },
};

exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
});

exports.getJobs = asyncHandler(async (req, res) => {
  const {
    job_type,
    location,
    tag,
    tags,
    q,
    sort = "posting_date_desc",
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (job_type) filter.job_type = job_type;
  if (location) filter.location = new RegExp(location, "i");
  if (tag) filter.tags = tag;
  if (tags) {
    const arr = String(tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length) filter.tags = { $all: arr };
  }
  if (q)
    filter.$or = [
      { title: new RegExp(q, "i") },
      { company: new RegExp(q, "i") },
    ];

  const sortBy = SORT_MAP[sort] || SORT_MAP.posting_date_desc;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    Job.find(filter).sort(sortBy).skip(skip).limit(limitNum),
    Job.countDocuments(filter),
  ]);

  res.json({
    data,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  });
});

exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(job);
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(job);
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.status(204).send();
});

exports.triggerScrape = asyncHandler(async (req, res) => {
  const token = (req.query.token || req.headers["x-scrape-token"] || "")
    .toString()
    .trim();
  const secret = (process.env.SCRAPE_SECRET || "").toString().trim();
  if (!token || token !== secret) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const jobs = await scrapeJobs({ pages: 1 });
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
  res.status(200).json({ message: "Scrape completed", count: upserted });
});
