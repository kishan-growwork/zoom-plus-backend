const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const Category = require("../../models/category");

exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await Category.create({
      ...data,
    });
    successResponse(res, { data: category }, "Category create successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      { error },
      "Category failed to create. Please try again later"
    );
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await Category.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    successResponse(
      res,
      { data: resp },
      "Merchant category deleted successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      {},
      "Merchant Category failed to delete. Please try again later"
    );
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const resp = await Category.updateOne(
      { _id: id },
      {
        $set: {
          data,
        },
      }
    );
    successResponse(res, { data: resp }, "Merchant Fetch successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

exports.getCategory = async (req, res) => {
  try {
    const resp = await Category.aggregate([
      {
        $facet: {
          data: [],
          count: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);
    successResponse(
      res,
      {
        data: resp[0],
        count: resp[0].count[0] ? resp[0].count[0].count : 0,
      },
      "All Category Fetch successfully"
    );
  } catch (error) {
    errorResponse(
      res,
      {},
      "Failed to fetch the Category. Please try again later"
    );
  }
};
