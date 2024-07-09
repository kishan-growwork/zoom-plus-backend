const {
  errorResponse,
  successResponse,
  generateOTP,
} = require("../../helper/helper");
const Orders = require("../../models/orders");
const { ObjectId } = require("mongodb");

exports.UpdateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderid;
    const { value, timer } = req.body;
    const validStatuses = [
      // "Placed",
      "Preparing",
      "Rejected",
      "ReadyforPickup",
      "Cancelled",
      // "Completed",
    ];

    if (!validStatuses.includes(value) && timer === undefined) {
      return errorResponse(res, {}, "Invalid order status or missing timer");
    }

    const updateFields = {};

    if (value) {
      if (!validStatuses.includes(value)) {
        return errorResponse(res, {}, "Invalid order status");
      }
      updateFields.orderStatus = value;

      if (value === "Preparing") {
        let otp = await generateOTP();
        updateFields.otp = otp;
        updateFields["timing.acceptedAt"] = new Date();
      }

      if (value === "ReadyforPickup") {
        updateFields["timing.readyforpickupAt"] = new Date();
      }
    }

    if (timer !== undefined) {
      updateFields["timing.timer"] = timer;
    }

    const response = await Orders.updateOne({ _id: orderId }, { $set: updateFields });

    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No Order found or update failed");
    }

    successResponse(res, { data: response }, "Order updated successfully");
  } catch (err) {
    errorResponse(res, {}, "Order update failed. Please try again later");
  }
};

exports.CompletedOrderStatus = async (req, res) => {
  try {
    const { otp, orderid } = req.body;
    const order = await Orders.findOne({ _id: orderid, otp: otp });
    if (order) {
      order.orderStatus = "Completed";
      await order.save();
      successResponse(res, { data: order }, "Order Completed Successfully");
    } else {
      errorResponse(res, {}, "Invalid OTP. Please try again later");
    }
  } catch (err) {
    console.error("-------------------");
    console.error("err", err);
    console.error("-------------------");
    errorResponse(res, {}, "OTP not verified yet. Please try again later");
  }
};

// exports.deleteOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const response = await Orders.updateOne(
//       { _id: orderId },
//       {
//         $set: { isDeleted: true },
//       }
//     );
//     if (response.modifiedCount === 0) {
//       return errorResponse(res, {}, "No Order found or Delete failed");
//     }
//     successResponse(res, { data: response }, "Order Deleted successfully");
//   } catch (err) {
//     errorResponse(res, {}, "Order not found. Please try again later");
//   }
// };

exports.getOrdersForMerchants = async (req, res) => {
  try {
    const body = req.body;
    const orderId = req?.body?.orderId;
    // const newOrder = req?.query?.newOrder;
    const user = req?.user;
    let filter = { isDeleted: false };

    // let filter = {};
    // if (user?.merchant?.id) {
    //   filter["merchantId"] = {
    //     $elemMatch: { merchantId: new ObjectId(body.merchantId) },
    //   };
    // }

    if (user?.merchant?.id) {
      filter["items"] = {
        $elemMatch: {
          merchantId: new ObjectId(user.merchant.id),
        },
      };
    }

    if (orderId) {
      filter = {
        ...filter,
        uniqueId: { $regex: new RegExp(orderId, "i") }
      };
    }
    // filter["uniqueId"] = orderId;

    if (body?.status) {
      filter["orderStatus"] = body?.status;
    }

    let pipeline = [];

    if (body?.newOrder) {
      pipeline.push({
        $sort: { createdAt: -1 },
      });
    }
    // console.info('filter => ', filter);

    pipeline.push(
      // { $project: { otp: 0 } },
      { $match: filter },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "merchantItems",
          localField: "items.item",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "OrderedBy",
          foreignField: "_id",
          as: "OrderedBy",
        },
      },
      { $unwind: "$OrderedBy" },
      { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              $mergeObjects: ["$items", { merchantItems: "$itemDetails" }],
            },
          },
          totalPrice: { $first: "$totalPrice" },
          orderStatus: { $first: "$orderStatus" },
          isDeleted: { $first: "$isDeleted" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          OrderedBy: { $first: "$OrderedBy" },
          timing: { $first: "$timing" },
          uniqueId: { $first: "$uniqueId" },
          otp: { $first: "$otp" }, // this needs to be removed in the final code
        },
      }
    );

    let Response = await Orders.aggregate(pipeline);

    return successResponse(
      res,
      { Orders: Response },
      "Orders Fetched successfully"
    );
  } catch (err) {
    console.info("err => ", err);
    return errorResponse(
      res,
      { err },
      "Failed to Fetch Orders. Please try again later"
    );
  }
};
