const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const duplicateFields = Object.keys(err.keyValue).map(
    (key) => err.keyValue[key]
  );
  const message = `Duplicate fields: ${duplicateFields.join(", ")}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.keys(err.errors)
    .map((key) => err.errors[key].message)
    .join(", ");
  return new AppError(`${message}.`, 400);
};

// Handle cast error
// ---

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  // console.log(err);
  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    let error = err;
    if (err.code == 11000) {
      error = handleDuplicateFieldsDB(err);
    } else if (err.name == "ValidationError") {
      error = handleValidationErrorDB(err);
    }
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
