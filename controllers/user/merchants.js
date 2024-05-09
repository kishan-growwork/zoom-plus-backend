const { FOODS_CATEGORIES } = require("../../constant/constant");
const { errorResponse, successResponse } = require("../../helper/helper");
const Category = require("../../models/category");
const Merchants = require("../../models/merchant");

exports.getAllMerchants = async (req, res) => {
  try {
    let merchants = await Merchants.find({ isVerified: true });
    successResponse(
      res,
      { merchants: merchants },
      "Merchants fetch successfully"
    );
  } catch (err) {
    errorResponse(res, {}, "Merchants not found. Please try again later");
  }
};
