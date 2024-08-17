import ErrorResponse from "../utils/errorResponse.js";
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Object with ID ${err.value} was not found`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  if (
    err.name === "MongoNetworkError" ||
    err.name === "MongooseServerSelectionError"
  ) {
    const message = "Database connection failed";
    error = new ErrorResponse(message, 503);
  }
  res
    .status(error.status || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export default errorHandler;
