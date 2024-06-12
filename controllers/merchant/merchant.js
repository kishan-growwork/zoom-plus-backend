const { default: mongoose } = require("mongoose");
const {
  successResponse,
  UploadS3,
  errorResponse,
} = require("../../helper/helper");
const Merchants = require("../../models/merchant");
const { ObjectId } = require("mongodb");

exports.createMerchant = async (req, res) => {
  const data = req.body;
  const step = Number(req.query.step);
  let logoURL = null;
  let menuImages = null;
  let images = [];

  if (step && ![1, 2, 3, 4, 5].includes(step)) {
    return errorResponse(
      res,
      {},
      "Invalid step value. Must be one of [1, 2, 3, 4, 5]"
    );
  }

  if (
    step == 1 &&
    (!data.name ||
      !data.address ||
      !data.latitude ||
      !data.longitude ||
      !data.mobile)
  ) {
    return errorResponse(res, {}, "Not valid input");
  } else if (
    step == 2 &&
    (data.restaurantType.length == 0 ||
      data.categories.length == 0 ||
      data.openingHours.length == 0 ||
      data.daysOpen.length == 0)
  ) {
    return errorResponse(res, {}, "Not valid input");
  } else if (
    step == 3 &&
    (data.menuImages.length == 0 ||
      data.restaurantImages.length == 0 ||
      data.foodImages.length == 0)
  ) {
    return errorResponse(res, {}, "Not valid input");
  } else if (step == 4) {
    if (!data.restAndDeliveryTimeSame || !data.openingHours || !data.daysOpen) {
      return errorResponse(res, {}, "Not valid input");
    }
  } else if (
    step == 5 &&
    (!data.panCardName ||
      !data.panCardNumber ||
      data.panCardImage.length == 0 ||
      !data.gstName ||
      !data.gstNumber ||
      data.gstImage.length == 0 ||
      !data.acNumber ||
      !data.reAcNumber ||
      !data.acName ||
      !data.ifscCode ||
      !data.fssaiNumber ||
      !data.fssaiExpireDate ||
      data.fssaiImage.length == 0)
  ) {
    return errorResponse(res, {}, "Not valid input");
  }

  if (req?.files?.logo) {
    let uploadImage = await UploadS3(
      req.files.logo,
      `merchants/${req?.body?.restaurantId}`
    );
    if (uploadImage.success) {
      logoURL = uploadImage?.url;
    }
  }
  if (req?.files?.images?.length) {
    for (let index = 0; index < req?.files?.images.length; index++) {
      const item = req?.files?.images[index];
      let uploadImage = await UploadS3(
        item,
        `merchants/${req?.body?.restaurantId}`
      );
      if (uploadImage.success) {
        images.push(uploadImage?.url);
      }
    }
  }
  if (req?.files?.menuImages) {
    let uploadImage = await UploadS3(
      req.files.menuImages,
      `merchants/${req?.body?.restaurantId}`
    );
    if (uploadImage.success) {
      menuImages = uploadImage?.url;
    }
  }

  const objectId = new mongoose.Types.ObjectId();
  await Merchants.findOneAndUpdate(
    { _id: data?.id ?? objectId },
    {
      ...data,
      step: step,
      images: images,
      menuImages,
      logo: logoURL,
      userId: req?.user?.uid,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .then((response) => {
      successResponse(res, { data: response }, "Merchant create successfully");
    })
    .catch((err) => {
      console.info("err => ", err);
      errorResponse(
        res,
        {},
        "Merchant not created yet. Please try again later"
      );
    });
};

exports.getMerchantById = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await Merchants.aggregate([
      { $match: { isDeleted: false, _id: new ObjectId(id) } },
      // {
      //   $lookup: {
      //     from: "category",
      //     let: { categoryString: "$category" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: [{ $toString: "$_id" }, "$$categoryString"],
      //           },
      //         },
      //       },
      //     ],
      //     as: "merchantCategory",
      //   },
      // },
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "merchantCategory",
          pipeline: [
            {
              $lookup: {
                from: "subCategory",
                localField: "subs",
                foreignField: "_id",
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
                  {
                    $addFields: {
                      merchantItems: { $arrayElemAt: ["$merchantItems", 0] },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                subCategory: { $arrayElemAt: ["$subCategory", 0] },
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
            {
              $addFields: {
                merchantItems: { $arrayElemAt: ["$merchantItems", 0] },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          subCategory: { $arrayElemAt: ["$subCategory", 0] },
        },
      },
    ]);
    successResponse(res, { data: resp }, "Merchant Fetch successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

exports.updateMerchant = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const resp = await Merchants.updateOne(
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

exports.deleteMerchant = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await Merchants.updateOne(
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

exports.getAllMerchant = async (req, res) => {
  try {
    const resp = await Merchants.aggregate([
      {
        // this should be the final one
        $match: { isDeleted: false, isVerified: false },
      },
      // {
      //   $match: { isDeleted: false },
      // },
      {
        $project: {
          name: 1,
          _id: 1,
          menuImages: 1,
          rating: 1,
          city: 1,
          cityCode: 1,
          state: 1,
          stateCode: 1,
          restaurantImages: 1,
          restaurantType: 1,
          establishmentType: 1,
          logo: 1,
        },
      },
    ]);
    successResponse(res, { data: resp }, "All Merchant Fetch successfully");
  } catch (error) {
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

exports.getAllmerchantsForOutlets = async (req, res) => {
  try {
    const user = req.user;
    const resp = await Merchants.find({ userId: user.uid }).select("_id name");
    successResponse(res, { data: resp }, "Merchant Fetch successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};
