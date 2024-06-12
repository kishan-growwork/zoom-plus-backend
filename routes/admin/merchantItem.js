const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const {
  VerifyMerchantItem,
  getMerchantsItem,
} = require("../../controllers/admin/merchantItems");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.get("/merchantItem/get", verifyAuth, getMerchantsItem);

router.post(
  "/verifymerchant/item/:merchantitemid",
  validate([param("merchantitemid").exists(), body("value").exists()]),
  verifyAuth,
  VerifyMerchantItem
);

// router.delete("/merchantItem/get/:merchantid", dele);

module.exports = router;
