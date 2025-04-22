const User = require("../models/userModel");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");

// Helper Functions =====
const resetEmailHTML = (resetURL) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Please click the link below to reset your password:</p>
    <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you did not request this, please ignore this email. The link will expire in 10 minutes.</p>
    <p>Thank you,<br>The Pharmcator Team</p>
  </div>
`;

// Create a token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES}d`,
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const JWT_EXPIRES_MS = process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000;
  // Initialize cookie and send it
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_EXPIRES_MS),
    // Don't let any script in the browser modify the cookie
    httpOnly: true,
  };

  // secure will make the cookie only sent to encrypted https which is something we want to do only in production
  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;
  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

// Sign Up
const signUp = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    fullName,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

// login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Provide your email and password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!(await user.isCorrectPassword(password, user.password)))
    return next(new AppError("Invalid email or password", 404));

  createSendToken(user, 200, res);
});

// User forgot his password
const forgotPassword = catchAsync(async (req, res, next) => {
  // Check user passed email if it exist
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide you email.", 400));

  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError(
        "Please make sure to use the email you are using for login.",
        404
      )
    );

  // Send to user a reset token via email that will be expired after 10min
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const URL = `${process.env.SERVER_URL}/users/resetPassword/${resetToken}`;
  try {
    await sendEmail({
      html: resetEmailHTML(URL),
      subject: "Reset Your Password",
      to: email,
    });

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending email. Try again later", 500)
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError("Session is expired try again later", 400));

  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new AppError("You are not authenticated please login"));

  const token = authorization.split(" ")[1];
  // Check token if its valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Check if user still exist
  const currentUser = User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User is no longer exist.", 404));
  // Check if user changed password after token was issued
  if (currentUser.methods.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Session expired. Please login again."));
  }

  // User is authenticated
  req.user = currentUser;
  next();
  // proceed if its correct
});

module.exports = { signUp, login, protect, forgotPassword, resetPassword };
