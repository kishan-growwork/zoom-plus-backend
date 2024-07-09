const { successResponse, errorResponse } = require("../../helper/helper");
const Merchants = require("../../models/merchant");
const { ObjectId } = require("mongodb");

exports.verifyMerchantById = async (req, res) => {
  try {
    const data = req.body;
    const role = req.user.roleName;
    if (role !== "admin") {
      return errorResponse(
        res,
        {},
        "Only admin have authority to verify and unverify"
      );
    }
    const id = req.params.merchantid;

    const updateFields = {};
    for (const [key, value] of Object.entries(data)) {
      updateFields[key] = value;
    }

    const resp = await Merchants.updateOne(
      { isDeleted: false, _id: new ObjectId(id) },
      { $set: { ...data } }
    );
    if (resp.modifiedCount === 0) {
      return errorResponse(res, {}, "No merchant found or update failed");
    }
    successResponse(res, { data: resp }, "Merchant verified successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to update the data. Please try again later");
  }
};

exports.getAllMerchantForAdmin = async (req, res) => {
  try {
    const resp = await Merchants.aggregate([
      {
        $match: { isDeleted: false, isVerified: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $addFields: {
          users: { $arrayElemAt: ["$users", 0] },
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "_id",
          foreignField: "merchantId",
          as: "category",
          pipeline: [
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
          ],
        },
      },
    ]);
    successResponse(res, { data: resp }, "All Merchant Fetch successfully");
  } catch (error) {
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

exports.getMerchantByIdForAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await Merchants.aggregate([
      { $match: { isDeleted: false, _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $addFields: {
          users: { $arrayElemAt: ["$users", 0] },
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "_id",
          foreignField: "merchantId",
          as: "category",
          pipeline: [
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
          ],
        },
      },
    ]);
    successResponse(res, { data: resp[0] }, "Merchant Fetch successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};
