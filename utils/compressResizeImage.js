const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");
const catchAsync = require("../utils/catchAsync");

const compressResizeImage = (options) => {
  return catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const { width, height, quality } = options;

    const fileBuffer = await fs.readFile(req.file.path);
    const originalFileName = path.basename(req.file.path);
    const compressedFilename = `compressed-${originalFileName}`;
    const outputPath = path.join(
      __dirname,
      `../public/images/${compressedFilename}`
    );
    req.body.image = `/images/${compressedFilename}`;

    await sharp(fileBuffer)
      .resize({ width, height })
      .jpeg({ quality })
      .toFile(outputPath);

    // Delete the original file
    await fs.unlink(req.file.path);

    req.file.path = outputPath;
    req.file.filename = compressedFilename;
    next();
  });
};

module.exports = compressResizeImage;
