const { ObjectId } = require("mongodb");
const { successResponse, errorResponse } = require("../../helper/helper");
const MerchantItems = require("../../models/merchantItems");

exports.getMerchantsItem = async (req, res) => {
  try {
    const resp = await MerchantItems.aggregate([
      {
        $match: { isDeleted: false, isVerified: false },
      },
    ]);
    successResponse(res, { data: resp }, "Fetch Merchant successfully");
  } catch (error) {
    console.info("error => ", error);
    errorResponse(res, {}, "Failed to fetch Merchant. Please try again later");
  }
};

exports.VerifyMerchantItem = async (req, res) => {
  try {
    const { comments, value } = req.body;
    const role = req.user.roleName;
    if (role !== "admin") {
      return errorResponse(
        res,
        {},
        "Only admin have authority to verify and unverify"
      );
    }
    const id = req.params.merchantitemid;
    const resp = await MerchantItems.updateOne(
      { isDeleted: false, _id: new ObjectId(id) },
      { $set: { isVerified: value, comments: comments } }
    );
    if (resp.modifiedCount === 0) {
      return errorResponse(res, {}, "No merchant found or update failed");
    }
    successResponse(res, { data: resp }, "MerchantItem verified successfully");
  } catch (error) {
    errorResponse(res, {}, "Failed to Verify the data. Please try again later");
  }
};
