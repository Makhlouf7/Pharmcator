const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  licenseNumber: {
    type: String,
    require: [true, "Please provide pharmacy license number"],
  },
  workingDays: {
    type: [String],
    validate: {
      validator: function (days) {
        const validDays = [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Everyday",
        ];
        const isValid = days.every((day) => validDays.includes(day));
        const noConflict = !(days.includes("Everyday") && days.length > 1);
        return isValid && noConflict;
      },
    },
  },
  openingHours: {
    open: {
      type: String,
      required: [true, "Please provide when the pharmacy opens"],
    },
    close: {
      type: String,
      required: [true, "Please provide when the pharmacy closes"],
    },
  },
  contactNumber: {
    type: String,
    required: [true, "Please provide pharmacy contact number."],
  },
});

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
module.exports = Pharmacy;
