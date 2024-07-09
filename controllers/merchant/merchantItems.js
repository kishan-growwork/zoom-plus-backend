const {
  successResponse,
  errorResponse,
  UploadS3,
} = require("../../helper/helper");
const { ObjectId } = require("mongodb");
const MerchantItems = require("../../models/merchantItems");

exports.createMerchantItems = async (req, res) => {
  const data = req.body;
  const user = req.user;
  await MerchantItems.create({
    userId: user.uid,
    merchantId: user.merchant.id,
    ...data,
  })
    .then((response) => {
      successResponse(res, { data: response }, "Merchant create successfully");
    })
    .catch((err) => {
      console.info("-------------------------------");
      console.info("err => ", err);
      console.info("-------------------------------");
      errorResponse(
        res,
        { err },
        "Merchant not created yet. Please try again later"
      );
    });
};

exports.getMerchantsItem = async (req, res) => {
  try {
    const merchant = req.user.merchant;
    const itemId = req.query.itemId;

    let filter = {};

    if (itemId) {
      filter["_id"] = new ObjectId(itemId);
    }

    const resp = await MerchantItems.aggregate([
      {
        $match: { ...filter },
      },
      {
        $match: { merchantId: new ObjectId(merchant?._id) },
      },
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
        },
      },
      {
        $lookup: {
          from: "subCategory",
          localField: "subs",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $addFields: {
          subCategory: { $arrayElemAt: ["$subCategory", 0] },
        },
      },
    ]);
    successResponse(res, { data: resp }, "Merchant create successfully");
  } catch (error) {
    console.info("error => ", error);
    errorResponse(res, {}, "Merchant not created yet. Please try again later");
  }
};

exports.updateMerchantItem = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.itemId;
    const merchant = req.user.merchant;
    if (!id) {
      errorResponse(res, {}, "No id provided. Please try again later");
    }
    const resp = await MerchantItems.updateOne(
      { _id: id, merchantId: merchant._id },
      {
        $set: { ...data },
      }
    );
    if (resp.modifiedCount === 0) {
      return errorResponse(
        res,
        {},
        "No Merchant Item found or update to failed"
      );
    }
    successResponse(res, { data: resp }, "Merchant updated successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

exports.deleteMerchantItem = async (req, res) => {
  try {
    const id = req.params.id;
    const merchant = req.user.merchant;
    const resp = await MerchantItems.updateOne(
      { _id: id, merchantId: merchant._id },
      {
        $set: {
          isDeleted: true,
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

exports.updateMerchantItemStock = async (req, res) => {
  try {
    const { inStock } = req.body;
    const id = req?.params?.id;
    const merchant = req.user.merchant;
    const resp = await MerchantItems.updateOne(
      { _id: id, merchantId: merchant._id },
      {
        $set: {
          inStock: inStock,
        },
      }
    );
    if (resp.modifiedCount === 0) {
      return errorResponse(
        res,
        {},
        "No Merchant Item found or update to failed"
      );
    }
    successResponse(
      res,
      { data: resp },
      "Merchant Item stock updated successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(
      res,
      {},
      "Failed to update the stock. Please try again later"
    );
  }
};

exports.getOneMerchantItem = async (req, res) => {
  try {
    const merchant = req.user.merchant;
    const itemId = req.params.itemId;

    let filter = {};

    if (itemId) {
      filter["_id"] = new ObjectId(itemId);
    }

    const resp = await MerchantItems.aggregate([
      {
        $match: { ...filter },
      },
      {
        $match: { merchantId: new ObjectId(merchant?._id) },
      },
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
        },
      },
      {
        $lookup: {
          from: "subCategory",
          localField: "subs",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $addFields: {
          subCategory: { $arrayElemAt: ["$subCategory", 0] },
        },
      },
    ]);
    successResponse(res, { data: resp[0] }, "Merchant create successfully");
  } catch (error) {
    console.info("error => ", error);
    errorResponse(res, {}, "Merchant not created yet. Please try again later");
  }
};
