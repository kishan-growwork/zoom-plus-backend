const { FOODS_CATEGORIES } = require("../../constant/constant");
const { errorResponse, successResponse } = require("../../helper/helper");
const Category = require("../../models/category");

exports.getFoodCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true });
    successResponse(
      res,
      { categories: categories },
      "Category update successfully"
    );
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};
