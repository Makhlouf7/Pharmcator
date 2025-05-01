const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const uniqueName = `${Date.now()}-${randomSuffix}${fileExt}`;
    req.body.image = `/images/${uniqueName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
