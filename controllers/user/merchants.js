const { errorResponse, successResponse } = require("../../helper/helper");
const Merchants = require("../../models/merchant");
const MerchantItems = require("../../models/merchantItems");
const { ObjectId } = require("mongodb");

exports.getAllMerchants = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.body;
    const {
      ratingSort,
      distanceSort,
      ratingFourPlus,
      pureveg,
      cuisines,
      category,
    } = req.query;

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDist = parseFloat(maxDistance);

    const pipeline = [];

    if (lat && lon && maxDist) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lon, lat],
          },
          distanceField: "distance",
          maxDistance: maxDist,
          spherical: true,
        },
      });
    }

    if (ratingSort) {
      pipeline.push({
        $sort: { rating: -1 },
      });
    }

    if (ratingFourPlus) {
      pipeline.push({
        $match: { rating: { $gte: 4 } },
      });
    }

    if (pureveg) {
      pipeline.push({
        $match: { isVeg: 0 },
      });
    }

    pipeline.push({
      $match: { isDeleted: false, isVerified: true },
    });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "users",
      },
    });

    pipeline.push({
      $lookup: {
        from: "merchantCategory",
        localField: "_id",
        foreignField: "merchantId",
        as: "merchantCategory",
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
              foreignField: "merchantCategory",
              as: "merchantItems",
            },
          },
        ],
      },
    });

    if (category) {
      pipeline.push({
        $match: {
          merchantCategory: { ...category },
        },
      });
    }
    await Merchants.collection.createIndex({ location: "2dsphere" });

    let merchants = await Merchants.aggregate(pipeline).exec();

    if (distanceSort) {
      merchants = merchants.sort((a, b) => a.distance - b.distance);
    }

    successResponse(
      res,
      { merchants: merchants },
      "Merchants fetched successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Merchants not found. Please try again later");
  }
};

exports.searchTerm = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, searchTerm } = req.body;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDist = parseFloat(maxDistance);

    const pipeline = [];

    if (lat && lon && maxDist) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lon, lat],
          },
          distanceField: "distance",
          maxDistance: maxDist,
          spherical: true,
        },
      });
    }

    if (searchTerm) {
      pipeline.push({
        $match: {
          "restaurantBasicInfo.name": { $regex: searchTerm, $options: "i" },
        },
      });
    }

    const Restaurant = await Merchants.aggregate([
      ...pipeline,
      {
        $sample: { size: 100 },
      },
    ]);

    // Query for items with random order
    const itemsResp = await MerchantItems.aggregate([
      { $match: { name: { $regex: searchTerm, $options: "i" } } },
      { $sample: { size: 100 } },
    ]);

    successResponse(
      res,
      { Items: itemsResp, Restaurant: Restaurant },
      "Merchants fetched successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Merchants not found. Please try again later");
  }
};

exports.getMerchantById = async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await Merchants.findOne({
      // isDeleted: false,
      _id: new ObjectId(id),
    });

    const items = await MerchantItems.aggregate([
      { $match: { merchantId: new ObjectId(id) } },
    ]);

    successResponse(
      res,
      { Restaurant: resp, Items: items },
      "Merchant Fetch successfully"
    );
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to fetch the data. Please try again later");
  }
};

// exports.getAllMerchants = async (req, res) => {
//   try {
//     const { latitude, longitude, maxDistance } = req.body;

//     console.info("-------------------------------");
//     console.info("latitude => ", latitude);
//     console.info("-------------------------------");
//     console.info("longitude => ", longitude);
//     console.info("-------------------------------");
//     console.info("maxDistance => ", maxDistance);
//     console.info("-------------------------------");

//     const merchants = await Merchants.aggregate([
//       // {
//       // $match: { isDeleted: false, isVerified: false },
//       // },
//       // {
//       //   $lookup: {
//       //     from: "users",
//       //     localField: "userId",
//       //     foreignField: "_id",
//       //     as: "users",
//       //   },
//       // },
//       // {
//       //   $addFields: {
//       //     users: { $arrayElemAt: ["$users", 0] },
//       //   },
//       // },
//       {
//         $lookup: {
//           from: "category",
//           localField: "_id",
//           foreignField: "merchantId",
//           as: "category",
//           pipeline: [
//             // {
//             // $match: { isDeleted: false, isVerified: false },
//             // },
//             {
//               $lookup: {
//                 from: "subCategory",
//                 localField: "_id",
//                 foreignField: "categoryId",
//                 as: "subCategory",
//                 pipeline: [
//                   // {
//                   // $match: { isDeleted: false, isVerified: false },
//                   // },
//                   {
//                     $lookup: {
//                       from: "merchantItems",
//                       localField: "_id",
//                       foreignField: "subs",
//                       as: "merchantItems",
//                       pipeline: [
//                         // {
//                         // $match: { isDeleted: false, isVerified: false },
//                         // },
//                       ],
//                     },
//                   },
//                 ],
//               },
//             },
//             {
//               $lookup: {
//                 from: "merchantItems",
//                 localField: "_id",
//                 foreignField: "category",
//                 as: "merchantItems",
//                 pipeline: [
//                   // {
//                   // $match: { isDeleted: false, isVerified: false },
//                   // },
//                 ],
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     successResponse(
//       res,
//       { merchants: merchants },
//       "Merchants fetch successfully"
//     );
//   } catch (error) {
//     console.info("-------------------------------");
//     console.info("error => ", error);
//     console.info("-------------------------------");
//     errorResponse(res, {}, "Merchants not found. Please try again later");
//   }
// };
