const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);

    if (!deletedDoc) {
      return next(new AppError("No document found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

module.exports = { createOne, deleteOne };
