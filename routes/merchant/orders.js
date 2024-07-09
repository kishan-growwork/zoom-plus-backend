const express = require("express");

const router = express.Router();

//controllers

const { validate } = require("../../helper/helper");
const { body, param } = require("express-validator");
const { verifyAuth } = require("../../middleware/auth");
const {
  getOrdersForMerchants,
  UpdateOrderStatus,
  CompletedOrderStatus,
} = require("../../controllers/merchant/orders");

// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.post(
  "/updatestatus/order/:orderid",
  validate([
    // body("value").exists().withMessage("Value is required"),
    param("orderid").exists().withMessage("Order ID is required"),
  ]),
  verifyAuth,
  UpdateOrderStatus
);

router.post(
  "/completeorder",
  validate([
    body("orderid").exists().withMessage("Order Id is required"),
    body("otp").exists().withMessage("OTP is required"),
  ]),
  verifyAuth,
  CompletedOrderStatus
);

// router.post(
//   "/update/order/:id",
//   validate([
//     param("id").isLength({ min: 2 }),
//     body()
//       .custom((value) => {
//         return Object.keys(value).length > 0;
//       })
//       .withMessage("Body cannot be empty"),
//   ]),
//   verifyAuth,
//   updateOrder
// );

router.post(
  "/get/orderformerchant",
  validate([
    body("status")
      .optional()
      .isIn([
        "Placed",
        "Preparing",
        "Rejected",
        "ReadyforPickup",
        "Cancelled",
        "Completed",
      ])
      .withMessage("Invalid status value"),
  ]),
  verifyAuth,
  getOrdersForMerchants
);

// router.post("/get/order", getOrders);

module.exports = router;
