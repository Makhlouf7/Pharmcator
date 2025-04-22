const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 3000;
const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => console.log("Failed to connect to DB", err));

app.listen(port, (err) => {
  if (err) {
    console.log("Error while starting server 💥💥", err);
    return;
  }
  console.log(`Server is running on port ${port}`);
});
