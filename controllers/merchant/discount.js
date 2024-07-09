const { errorResponse, successResponse } = require("../../helper/helper");
const Discount = require("../../models/discount");
const { ObjectId } = require("mongodb");

exports.createDiscountCoupons = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    const order = await Discount.create({
      createdBy: user?.uid,
      ...data,
    });
    return successResponse(
      res,
      { data: order },
      "Discounted created successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      { error },
      "Order failed to create. Please try again later"
    );
  }
};

// exports.CompletedOrderStatus = async (req, res) => {
//   try {
//     const { otpid, otp, orderid } = req?.body;
//     let findOtp = await Discount.findOne({ _id: otpid, otp: otp });
//     if (findOtp) {
//       await OTP.updateOne({ _id: otpid }, { $set: { isVerified: true } });
//       const order = await Discount.findOneAndUpdate(
//         { _id: orderid },
//         {
//           $set: { orderStatus: "Completed" },
//         },
//         { new: true }
//       );
//       successResponse(res, { data: order }, "Order Completed Successfully");
//     } else {
//       errorResponse(res, {}, "Invalid OTP. Please try again later");
//     }
//   } catch (err) {
//     console.log("-------------------");
//     console.log("err", err);
//     console.log("-------------------");
//     errorResponse(res, {}, "OTP not verified yet. Please try again later");
//   }
// };

exports.deleteDiscount = async (req, res) => {
  try {
    const DiscountId = req.params.discountid;
    const response = await Discount.updateOne(
      { _id: DiscountId },
      {
        $set: { isDeleted: true },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No Discount found or Delete failed");
    }
    return successResponse(
      res,
      { data: response },
      "Discount Deleted successfully"
    );
  } catch (err) {
    return errorResponse(res, {}, "Discount not found. Please try again later");
  }
};

exports.verifyDiscount = async (req, res) => {
  try {
    const user = req?.user;
    let filter = { isDeleted: false };
    if (user?.merchant?.id) {
      filter["merchantId"] = new ObjectId(user.merchant.id);
    }
    let Response = await Discount.aggregate([
      {
        $match: { ...filter },
      },
    ]);
    successResponse(
      res,
      { Discounts: Response },
      "Orders Fetched successfully"
    );
  } catch (err) {
    console.info("err => ", err);
    errorResponse(
      res,
      { err },
      "Failed to Fetch Orders. Please try again later"
    );
  }
};

exports.getDiscount = async (req, res) => {
  try {
    const user = req?.user;
    let filter = { isDeleted: false };
    if (user?.merchant?.id) {
      filter["merchantId"] = new ObjectId(user.merchant.id);
    }
    let Response = await Discount.aggregate([
      {
        $match: { ...filter },
      },
    ]);
    return successResponse(
      res,
      { Discounts: Response },
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
