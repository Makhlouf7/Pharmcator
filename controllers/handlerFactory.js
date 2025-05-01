const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!doc) return next(new AppError("No document found", 404));

    res.status(200).json({
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

module.exports = { createOne, deleteOne, getAll, updateOne };
