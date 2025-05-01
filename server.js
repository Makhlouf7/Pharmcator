const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({
  path: "./config.env",
});
const app = require("./app");

const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASSWORD);

const port = process.env.PORT;

mongoose
  .connect(DB)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Can't connect to Database"));

app.listen(port, () => {
  console.log("Server is running on port 8000");
});
