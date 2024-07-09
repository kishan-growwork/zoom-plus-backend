const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const merchantCategory = require("../../models/merchantCategory");
const SubCategory = require("../../models/subCategory");

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await merchantCategory.updateOne(
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
    const resp = await merchantCategory.updateOne(
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

exports.createCategoryForMerchant = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    const category = await merchantCategory.create({
      merchantId: user?.merchant.id,
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

exports.getCategoryByMerchantId = async (req, res) => {
  try {
    const user = req.user;
    const resp = await merchantCategory.aggregate([
      {
        $match: { merchantId: new ObjectId(user?.merchant?.id) },
      },
      {
        $lookup: {
          from: "subCategory",
          localField: "_id",
          foreignField: "categoryId",
          as: "subCategory",
          pipeline: [
            {
              $lookup: {
                from: "merchantItems",
                localField: "_id",
                foreignField: "subs",
                as: "merchantItems",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "merchantItems",
          localField: "_id",
          foreignField: "category",
          as: "merchantItems",
          pipeline: [
            {
              $match: { subs: { $exists: false } },
            },
          ],
        },
      },
    ]);
    successResponse(res, { data: resp }, "Category Fetch successfully");
  } catch (error) {
    console.info("error => ", error);
    errorResponse(
      res,
      {},
      "Failed to fetch the category. Please try again later"
    );
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const id = req.params.categoryId;
    const user = req.user;
    const resp = await SubCategory.aggregate([
      {
        $match: {
          categoryId: new ObjectId(id),
          isDeleted: false,
          merchantId: new ObjectId(user?.merchant?.id),
        },
      },
      {
        $lookup: {
          from: "merchantItems",
          localField: "_id",
          foreignField: "subs",
          as: "merchantItems",
        },
      },
    ]);
    successResponse(res, { data: resp }, "SubCategory fetched Successfully");
  } catch (error) {
    errorResponse(
      res,
      {},
      "Failed to fetch the SubCategory. Please try again later"
    );
  }
};
