const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const duplicateFields = Object.keys(err.keyValue).map(
    (key) => err.keyValue[key]
  );
  const message = `Already Exist: ${duplicateFields.join(", ")}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.keys(err.errors)
    .map((key) => err.errors[key].message)
    .join(", ");
  console.log("wrong anser");
  return new AppError(`${message}.`, 400);
};

// Handle cast error
// ---

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      stack: err.stack,
      message: err.message,
    });
  }

  res.render("error", {
    title: "Uh Oh Something Went Wrong!",
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.render("error", {
    title: "Uh Oh Something Went Wrong!",
    message: err.isOperational ? err.message : "Please Try Again Later!",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  // console.log(err);
  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV == "production") {
    // console.log("Entered global 💥💥");
    let error = err;
    if (err.code == 11000) {
      error = handleDuplicateFieldsDB(err);
    } else if (err.name == "ValidationError") {
      error = handleValidationErrorDB(err);
    }
    sendErrorProd(error, req, res);
  }
};

module.exports = globalErrorHandler;
