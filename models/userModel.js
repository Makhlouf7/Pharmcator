const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide your first and last name ex: --- ---"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    validate: [
      validator.isStrongPassword,
      "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character (e.g., !@#$%).",
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match!",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["user", "admin", "support", "pharmacist"],
      message: "Invalid role",
    },
    default: "user",
  },
});

// Middlewares =====

// Encrypt password whenever its been changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

// Methods =====

userSchema.methods.isCorrectPassword = async (
  candidatePassword,
  currentPassword
) => {
  return await bcrypt.compare(candidatePassword, currentPassword);
};

userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  const passwordChangedAtSec = Number.parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return JWTTimestamp < passwordChangedAtSec;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
