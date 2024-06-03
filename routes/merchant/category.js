const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const { createMerchant } = require("../../controllers/merchant/merchant");
const {
  createMerchantItems,
} = require("../../controllers/merchant/merchantItems");
const { verifyAuth } = require("../../middleware/auth");
const { getCategory } = require("../../controllers/merchant/category");

const router = require("express").Router();

router.post(
  "/categories",
  //   verifyAuth,
  getCategory
);

module.exports = router;
