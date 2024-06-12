const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const subCategory = require("../../models/subCategory");

exports.createSubCategory = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    const response = await subCategory.create({
      merchantId: user.merchant.id,
      ...data,
    });
    successResponse(
      res,
      { data: response },
      "Merchant Category create successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      {},
      "Merchant Category created fail. Please try again later"
    );
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const resp = await subCategory.updateOne(
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

exports.deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await subCategory.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    successResponse(res, { data: resp }, "MerchantItem Deleted successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to delete the data. Please try again later");
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const user = req.user;
    const resp = await subCategory.find(
      { merchantId: user?.merchant?.id },
      {
        isDeleted: false,
      }
    );
    successResponse(res, { data: resp }, "Sub category Fetch successfully");
  } catch (error) {
    errorResponse(
      res,
      {},
      "Failed to fetch the Sub category. Please try again later"
    );
  }
};
