const { successResponse, errorResponse } = require("../../helper/helper");
const Category = require("../../models/category");

exports.getCategory = async (req, res) => {
  await Category.find({})
    .then((response) => {
      successResponse(res, { data: response });
    })
    .catch((err) => {
      errorResponse(res, {}, "Category is not get yet. Please try again later");
    });
};
