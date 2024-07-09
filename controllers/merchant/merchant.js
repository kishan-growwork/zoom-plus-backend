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
  let logoURL = null;
  let images = [];
  const step = Number(req?.query?.step);

  if (step && ![1, 2, 3, 4, 5].includes(step)) {
    return errorResponse(
      res,
      {},
      "Invalid step value. Must be one of [1, 2, 3, 4, 5]"
    );
  }
  const missingFields = [];

  const checkField = (field) => {
    return (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "") ||
      (Array.isArray(data[field]) && data[field].length === 0)
    );
  };

  if (step === 1) {
    const requiredFields = [
      "name",
      "address",
      "latitude",
      "longitude",
      "mobile",
    ];
    requiredFields.forEach((field) => {
      if (checkField(field)) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      return errorResponse(
        res,
        { missingFields },
        `Missing or empty fields for step 1: ${missingFields.join(", ")}`
      );
    }
  } else if (step === 2) {
    const requiredFields = [
      "restaurantType",
      "categories",
      "openingHours",
      "daysOpen",
      // "isVeg",
    ];
    requiredFields.forEach((field) => {
      if (checkField(field)) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      return errorResponse(
        res,
        { missingFields },
        `Missing or empty fields for step 2: ${missingFields.join(", ")}`
      );
    }
  } else if (step === 3) {
    const requiredFields = ["menuImages", "restaurantImages", "foodImages"];
    requiredFields.forEach((field) => {
      if (checkField(field)) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      return errorResponse(
        res,
        { missingFields },
        `Missing or empty fields for step 3: ${missingFields.join(", ")}`
      );
    }
  } else if (step === 4) {
    const requiredFields = [
      "restAndDeliveryTimeSame",
      "restopeningHours",
      "restdaysOpen",
    ];
    requiredFields.forEach((field) => {
      if (checkField(field)) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      return errorResponse(
        res,
        { missingFields },
        `Missing or empty fields for step 4: ${missingFields.join(", ")}`
      );
    }
  } else if (step === 5) {
    const requiredFields = [
      "panCardName",
      "panCardNumber",
      "panCardImage",
      "gstName",
      "gstNumber",
      "gstImage",
      "acNumber",
      "reAcNumber",
      "acName",
      "ifscCode",
      "fssaiNumber",
      "accountType",
      "fssaiExpireDate",
      "fssaiImage",
    ];
    requiredFields.forEach((field) => {
      if (checkField(field)) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      return errorResponse(
        res,
        { missingFields },
        `Missing or empty fields for step 5: ${missingFields.join(", ")}`
      );
    }
  }

  const merchantData = {};
  let location = {};
  if (step === 1) {
    merchantData.restaurantBasicInfo = {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      mobile: data.mobile,
      // isVerified: null,
    };
    location = {
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    };
  } else if (step === 2) {
    merchantData.restaurantDetails = {
      restaurantType: data.restaurantType,
      categories: data.categories,
      openingHours: data.openingHours,
      daysOpen: data.daysOpen,
      isVerified: null,
    };
    // merchantData.isVeg = data.isVeg;
  } else if (step === 3) {
    merchantData.restaurantImages = {
      menuImages: data.menuImages,
      restaurantImages: data.restaurantImages,
      foodImages: data.foodImages,
      isVerified: null,
    };
  } else if (step === 4) {
    merchantData.restaurantDetails = {
      ...merchantData.restaurantDetails,
      restAndDeliveryTimeSame: data.restAndDeliveryTimeSame,
      restopeningHours: data.restopeningHours,
      restdaysOpen: data.restdaysOpen,
      isVerified: null,
    };
  } else if (step === 5) {
    merchantData.panDetails = {
      panCardName: data.panCardName,
      panCardNumber: data.panCardNumber,
      panCardImage: data.panCardImage,
      isVerified: null,
    };
    merchantData.gstDetails = {
      gstName: data.gstName,
      gstNumber: data.gstNumber,
      gstImage: data.gstImage,
      isVerified: null,
    };
    merchantData.bankDetails = {
      accountType: data.accountType,
      acName: data.acName,
      acNumber: data.acNumber,
      ifscCode: data.ifscCode,
      isVerified: null,
    };
    merchantData.fssaiDetails = {
      fssaiNumber: data.fssaiNumber,
      fssaiExpireDate: data.fssaiExpireDate,
      fssaiImage: data.fssaiImage,
      isVerified: null,
    };
    merchantData.reAcNumber = data.reAcNumber;
  }
  // if (req?.files?.logo) {
  //   let uploadImage = await UploadS3(
  //     req.files.logo,
  //     `merchants/${req?.body?.restaurantId}`
  //   );
  //   if (uploadImage.success) {
  //     logoURL = uploadImage?.url;
  //   }
  // }
  // if (req?.files?.images?.length) {
  //   for (let index = 0; index < req?.files?.images.length; index++) {
  //     const item = req?.files?.images[index];
  //     let uploadImage = await UploadS3(
  //       item,
  //       `merchants/${req?.body?.restaurantId}`
  //     );
  //     if (uploadImage.success) {
  //       images.push(uploadImage?.url);
  //     }
  //   }
  // }
  // if (req?.files?.menuImages) {
  //   let uploadImage = await UploadS3(
  //     req.files.menuImages,
  //     `merchants/${req?.body?.restaurantId}`
  //   );
  //   if (uploadImage.success) {
  //     menuImages = uploadImage?.url;
  //   }
  // }

  const objectId = new mongoose.Types.ObjectId();

  await Merchants.findOneAndUpdate(
    { _id: data?.id ?? objectId },
    {
      ...merchantData,
      ...location,
      step: step,
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
        { err },
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
          from: "merchantCategory",
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
    const resp = await Merchants.find({ userId: user?.uid }).select(
      "_id restaurantBasicInfo.name"
    );
    const transformedResp = resp.map((item) => ({
      _id: item?._id,
      name: item?.restaurantBasicInfo?.name,
    }));
    successResponse(
      res,
      { data: transformedResp },
      "Merchant Fetch successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

// exports.addDiscountForAllTheItems = async (req, res) => {
//   try {
//     const user = req.user;
//     const resp = await Merchants.find({ userId: user?.uid }).select("_id name");
//     successResponse(res, { data: resp }, "Merchant Fetch successfully");
//   } catch (error) {
//     console.info("-------------------------------");
//     console.info("error => ", error);
//     console.info("-------------------------------");
//     errorResponse(res, {}, "Failed to fetch the data. Please try again later");
//   }
// };
