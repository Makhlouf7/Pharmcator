const mongoose = require("mongoose");
const reportsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  reportedEntity: {
    type: mongoose.Schema.ObjectId,
    refPath: "entityType",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide the report title"],
  },
  description: {
    type: String,
    minLength: [40, "At least 40 characters are required"],
    required: [true, "Please provide detailed description"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "resolved", "closed"],
      message: "Status must be pending, resolved, or closed.",
    },
    required: [true, "Please provide the status of the complain."],
  },
});

const Report = mongoose.model("Report", reportsSchema);
module.exports = Report;
