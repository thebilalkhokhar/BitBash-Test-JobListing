function notFoundHandler(err, req, res, next) {
  // This middleware is used as a placeholder to keep API consistent; actual 404 created earlier
  next(err);
}

function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let details = undefined;

  // Handle Mongoose invalid ObjectId
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error";
    details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  // Handle express-validator errors relayed via custom property
  if (err.type === "validation" && Array.isArray(err.errors)) {
    status = 400;
    message = "Validation error";
    details = err.errors.map((e) => ({ path: e.path, message: e.msg }));
  }

  const payload = { message };
  if (details) payload.details = details;
  if (!isProd && err.stack) payload.stack = err.stack;

  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
