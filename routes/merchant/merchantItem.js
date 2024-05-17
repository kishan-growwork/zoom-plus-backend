const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const { createMerchant } = require("../../controllers/merchant/merchant");
const {
  createMerchantItems,
} = require("../../controllers/merchant/merchantItems");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.post(
  "/merchantItem/create",
  validate([
    body("name").isLength({ min: 2 }),
    body("isVeg").exists(),
    body("isEligibleCoupon").exists(),
    body("price").exists(),
    body("merchantId").exists(),
  ]),
  verifyAuth,
  createMerchantItems
);

module.exports = router;
