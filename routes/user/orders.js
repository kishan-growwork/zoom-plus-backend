const express = require("express");

const router = express.Router();

//controllers

const { validate } = require("../../helper/helper");
const { body, param } = require("express-validator");
const { verifyAuth } = require("../../middleware/auth");
const {
  createOrders,
  deleteOrder,
  getOrders,
  UpdateOrder,
} = require("../../controllers/user/orders");

// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.post(
  "/create/order",
  validate([body("items").exists(), body("totalPrice").exists()]),
  verifyAuth,
  createOrders
);

router.post(
  "/update/order/:id",
  validate([
    param("id").isLength({ min: 2 }),
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  UpdateOrder
);

router.post(
  "/delete/order/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  deleteOrder
);

router.post("/get/order", verifyAuth, getOrders);

module.exports = router;
