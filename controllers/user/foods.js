const { default: mongoose } = require("mongoose");
const { FOODS_CATEGORIES } = require("../../constant/constant");
const { errorResponse, successResponse } = require("../../helper/helper");
const Category = require("../../models/category");
const Users = require("../../models/users");
const Cart = require("../../models/cart");
const { ObjectId } = mongoose.Types;

exports.getFoodCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true });
    successResponse(
      res,
      { categories: categories },
      "Category update successfully"
    );
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};

exports.AddwishlistItem = async (req, res) => {
  try {
    const userid = req.params.id;
    const itemId = req.body.itemId;
    let response = await Users.updateOne(
      { _id: userid },
      {
        $addToSet: { wishlist: itemId },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No User found or update failed");
    }
    successResponse(res, { data: response }, "Category update successfully");
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};

exports.AddFavMerchants = async (req, res) => {
  try {
    const userid = req.params.id;
    const merchantsId = req.body.merchantsId;
    let response = await Users.updateOne(
      { _id: userid },
      {
        $addToSet: { merchantlist: merchantsId },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No User found or update failed");
    }
    successResponse(
      res,
      { data: response },
      "Added Favourit Restaurant successfully"
    );
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};

exports.RemovewishlistItem = async (req, res) => {
  try {
    const userid = req.params.id;
    const itemId = req.body.itemId;
    let response = await Users.updateOne(
      { _id: userid },
      {
        $pull: { wishlist: itemId },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No User found or update failed");
    }
    successResponse(res, { data: response }, "Wishlist updated successfully");
  } catch (err) {
    errorResponse(res, {}, "Something failed. Please try again later");
  }
};

exports.RemoveFavMerchants = async (req, res) => {
  try {
    const userid = req.params.id;
    const merchantsId = req.body.merchantsId;
    let response = await Users.updateOne(
      { _id: userid },
      {
        $pull: { merchantlist: merchantsId },
      }
    );
    if (response.modifiedCount === 0) {
      return errorResponse(res, {}, "No User found or update failed");
    }
    successResponse(
      res,
      { data: response },
      "Added Favourit Restaurant successfully"
    );
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};

exports.AddCartItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const itemId = req.body.itemId;
    const qty = req.body.qty;
    if (!ObjectId.isValid(itemId)) {
      return errorResponse(res, {}, "Invalid itemId");
    }
    // await Merchants.findOneAndUpdate(
    //   { _id: data?.id ?? objectId },
    //   {
    //     ...merchantData,
    //     ...location,
    //     step: step,
    //     userId: req?.user?.uid,
    //   },
    //   { upsert: true, new: true, setDefaultsOnInsert: true }
    // );
    let response = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $addToSet: { cartList: { item: itemId, qty: qty } },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    successResponse(res, { data: response }, "Cart updated successfully");
  } catch (err) {
    console.info("-------------------------------");
    console.info("err => ", err);
    console.info("-------------------------------");
    errorResponse(res, {}, "Cart update failed. Please try again later");
  }
};

exports.RemoveCartItem = async (req, res) => {
  try {
    const userid = req.params.id;
    const itemId = req.body.itemId;

    let response = await Cart.findOneAndUpdate(
      { userId: userid },
      {
        $pull: { cartList: { item: itemId } },
      },
      { new: true }
    );
    successResponse(res, { data: response }, "Category update successfully");
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};

exports.EmptyCartItem = async (req, res) => {
  try {
    const userid = req.params.userid;
    let response = await Cart.findOneAndUpdate(
      { userId: userid },
      {
        $set: { cartList: [] },
      },
      { new: true }
    );
    successResponse(res, { data: response }, "Category update successfully");
  } catch (err) {
    errorResponse(res, {}, "Foods Category not found. Please try again later");
  }
};
