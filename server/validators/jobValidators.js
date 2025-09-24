const { body, param, query } = require("express-validator");
const { JOB_TYPES } = require("../models/Job");

const parseTags = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const createJobValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("posting_date")
    .notEmpty()
    .withMessage("Posting date is required")
    .bail()
    .isISO8601()
    .withMessage("Posting date must be a valid date")
    .toDate(),
  body("job_type")
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(", ")}`),
  body("tags").optional().customSanitizer(parseTags),
];

const updateJobValidator = [
  param("id").isMongoId().withMessage("Invalid job id"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company cannot be empty"),
  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),
  body("posting_date")
    .optional()
    .isISO8601()
    .withMessage("Posting date must be a valid date")
    .toDate(),
  body("job_type")
    .optional()
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(", ")}`),
  body("tags").optional().customSanitizer(parseTags),
];

const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid job id"),
];

const listQueryValidator = [
  query("job_type")
    .optional({ values: "falsy" })
    .isIn(JOB_TYPES)
    .withMessage("Invalid job_type"),
  query("location").optional({ values: "falsy" }).isString(),
  query("tag").optional({ values: "falsy" }).isString(),
  query("tags").optional({ values: "falsy" }).isString(),
  query("q").optional({ values: "falsy" }).isString(),
  query("sort").optional({ values: "falsy" }).isString(),
  query("page")
    .optional({ values: "falsy" })
    .toInt()
    .isInt({ min: 1 })
    .withMessage("page must be >= 1"),
  query("limit")
    .optional({ values: "falsy" })
    .toInt()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be 1-100"),
];

module.exports = {
  createJobValidator,
  updateJobValidator,
  idParamValidator,
  listQueryValidator,
};
