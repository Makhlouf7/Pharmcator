const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
const userRouter = require("./routes/userRoutes");

app.use(express.json());

if (process.env.NODE_ENV != "production") app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);
module.exports = app;
