const {
  successResponse,
  errorResponse,
  UploadS3,
} = require("../../helper/helper");
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
      errorResponse(
        res,
        {},
        "Merchant not created yet. Please try again later"
      );
    });
};

exports.getMerchantsItem = async (req, res) => {
  try {
    const merchantId = req.params.merchantid;
    const resp = await MerchantItems.aggregate([
      {
        $match: { merchantId: merchantId },
      },
      {
        $lookup: {
          from: "category",
          let: { categoryString: "$category" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$categoryString"],
                },
              },
            },
          ],
          as: "merchantCategory",
        },
      },
      // {
      //   $addFields: {
      //     merchantCategory: { $arrayElemAt: ["$merchantCategory", 0] },
      //   },
      // },
      {
        $lookup: {
          from: "subCategory",
          let: { categoryString: "$subs" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$categoryString"],
                },
              },
            },
          ],
          as: "subCategory",
        },
      },
      // {
      //   $lookup: {
      //     from: "subCategory",
      //     localField: "subs",
      //     foreignField: "_id",
      //     as: "subCategory",
      //   },
      // },
      // {
      //   $addFields: {
      //     subCategory: { $arrayElemAt: ["$subCategory", 0] },
      //   },
      // },
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
    const id = req.params.id;
    if (!id) {
      errorResponse(res, {}, "No id provided. Please try again later");
    }
    const resp = await MerchantItems.updateOne(
      { _id: id },
      {
        $set: {
          data,
        },
      }
    );
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
    const resp = await MerchantItems.updateOne(
      { _id: id },
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
    const { isStock } = req.body;
    const id = req.params.id;
    const resp = await MerchantItems.updateOne(
      { _id: id },
      {
        $set: {
          inStock: isStock,
        },
      }
    );
    successResponse(res, { data: resp }, "Merchant stock updated successfully");
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
