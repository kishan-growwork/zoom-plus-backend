const { errorResponse, successResponse } = require("../../helper/helper");
const Orders = require("../../models/orders");
const { ObjectId } = require("mongodb");

function generateUniqueNumber() {
  const timestamp = Date.now().toString();
  const randomPart = Math.floor(Math.random() * 1000);
  const uniqueNumber = (timestamp + randomPart.toString()).slice(-6);
  return uniqueNumber;
}

exports.createOrders = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;

    const uniqueId = await generateUniqueNumber();

    const order = await Orders.create({
      OrderedBy: user?.uid,
      uniqueId: uniqueId,
      timing: { placedAt: new Date() },
      ...data,
    });
    successResponse(res, { data: order }, "Order created successfully");
  } catch (error) {
    console.info('error => ', error);
    errorResponse(
      res,
      { error },
      "Order failed to create. Please try again later"
    );
  }
};

exports.UpdateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { value, ...rest } = req.body;
    const validStatuses = ["Cancelled"];
    if (value && !validStatuses.includes(value)) {
      return errorResponse(res, {}, "Invalid order status");
    }
    const response = await Orders.updateOne(
      { _id: orderId },
      {
        $set: { orderStatus: value, rest },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No Order found or update failed");
    }
    successResponse(res, { data: response }, "Order updated successfully");
  } catch (err) {
    errorResponse(res, {}, "Order not found. Please try again later");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await Orders.updateOne(
      { _id: orderId },
      {
        $set: { isDeleted: true },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No Order found or Delete failed");
    }
    successResponse(res, { data: response }, "Order Deleted successfully");
  } catch (err) {
    errorResponse(res, {}, "Order not found. Please try again later");
  }
};

exports.getOrders = async (req, res) => {
  try {
    const body = req.body;
    const user = req?.user;

    let filter = { isDeleted: false };

    if (body.merchantId) {
      filter["items"] = {
        $elemMatch: { merchantId: new ObjectId(body.merchantId) },
      };
    }

    if (body.item) {
      filter["items"] = {
        ...filter["items"],
        $elemMatch: {
          ...filter["items"]?.$elemMatch,
          item: new ObjectId(body.item),
        },
      };
    }

    let Response = await Orders.aggregate([
      {
        $match: { ...filter },
      },
      {
        $match: { OrderedBy: user?.uid },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "merchantItems",
          localField: "items.item",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
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
          timing: { $first: "$timing" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ]);

    successResponse(res, { Orders: Response }, "Orders Fetched successfully");

  } catch (err) {

    errorResponse(res, {}, "Failed to Fetch Orders. Please try again later");

  }
};
