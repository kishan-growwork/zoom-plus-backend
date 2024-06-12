const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const {
  createMerchantItems,
  getMerchantsItem,
  deleteMerchantItem,
  updateMerchantItem,
  updateMerchantItemStock,
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
    body("category").exists(),
  ]),
  verifyAuth,
  createMerchantItems
);

router.get(
  "/merchantItem/get/:id",
  validate([param("id").exists()]),
  verifyAuth,
  getMerchantsItem
);

router.delete(
  "/merchantItem/delete/:id",
  validate([param("id").exists()]),
  verifyAuth,
  deleteMerchantItem
);

router.put(
  "/merchantItem/update/:id",
  validate([param("id").exists()]),
  verifyAuth,
  updateMerchantItem
);

router.post(
  "/merchantItem/updateStock/:id",
  validate([param("id").exists(), body("isStock").exists()]),
  verifyAuth,
  updateMerchantItemStock
);

// router.delete("/merchantItem/get/:merchantid", dele);

module.exports = router;
