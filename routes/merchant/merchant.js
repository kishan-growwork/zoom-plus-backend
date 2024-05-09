const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const { createMerchant } = require("../../controllers/merchant/merchant");

const router = require("express").Router();

router.post(
  "/create",
  //   validate([body("name").isLength({ min: 2 })]),
  createMerchant
);

module.exports = router;
