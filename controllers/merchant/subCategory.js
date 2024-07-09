const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const subCategory = require("../../models/subCategory");
const merchantCategory = require("../../models/merchantCategory");

exports.createSubCategory = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    let checkCategory = await merchantCategory.findById(req?.body?.categoryId);
    if (!checkCategory && req?.body?.categoryId) {
      return errorResponse(
        res,
        {},
        "SubCategory not found. Please try again later"
      );
    }
    const response = await subCategory.create({
      merchantId: user.merchant.id,
      ...data,
    });
    successResponse(
      res,
      { data: response },
      "Merchant SubCategory create successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Fail to create Category. Please try again later");
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
    successResponse(res, { data: resp }, "SubCategory Fetch successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      {},
      "Failed to fetch the SubCategory. Please try again later"
    );
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
    successResponse(res, { data: resp }, "SubCategory Deleted successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      {},
      "Failed to delete the SubCategory. Please try again later"
    );
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const user = req.user;
    const resp = await subCategory.find(
      { merchantId: new ObjectId(user?.merchant?.id) },
      {
        isDeleted: false,
      }
    );
    successResponse(res, { data: resp }, "Subcategory Fetch successfully");
  } catch (error) {
    errorResponse(
      res,
      {},
      "Failed to fetch the Subcategory. Please try again later"
    );
  }
};
