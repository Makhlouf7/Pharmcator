const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const viewRouter = require("./routes/viewRouter");
const categoryRouter = require("./routes/categoryRoutes");
const productsRouter = require("./routes/productsRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cartRouter = require("./routes/cartRoutes");
const ordersRouter = require("./routes/orderRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
const userRouter = require("./routes/userRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "dist")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV == "production" ? true : false },
  })
);
if (process.env.NODE_ENV != "production") app.use(morgan("dev"));

// Test middleware
app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productsRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/", viewRouter);
app.use("/dashboard", dashboardRouter);
app.use(globalErrorHandler);
module.exports = app;
