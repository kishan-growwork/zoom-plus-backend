const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const Category = require("../../models/category");
const SubCategory = require("../../models/subCategory");

exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    const category = await Category.create({
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

exports.getCategoryByMerchantId = async (req, res) => {
  try {
    const user = req.user;
    const resp = await Category.find({
      merchantId: user.merchant.id,
      isDeleted: false,
    });
    successResponse(res, { data: resp }, "Category Fetch successfully");
  } catch (error) {
    errorResponse(
      res,
      {},
      "Failed to fetch the category. Please try again later"
    );
  }
};

exports.getCategory = async (req, res) => {
  try {
    const user = req.user;
    const resp = await Category.aggregate([
      {
        $match: { merchantId: user.merchant.id },
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
        },
      },
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

exports.getSubCategoryById = async (req, res) => {
  try {
    const id = req.params.categoryId;
    const user = req.user;
    const resp = await SubCategory.aggregate([
      {
        $match: {
          categoryId: new ObjectId(id),
          isDeleted: false,
          merchantId: user?.merchant?.id,
          // Uncomment and modify the following line if you need to match the merchant ID as well
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
