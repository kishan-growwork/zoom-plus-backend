const { body, param } = require("express-validator");
const {
  verifyMerchantById,
  getAllMerchantForAdmin,
  getMerchantByIdForAdmin,
} = require("../../controllers/admin/merchant");
const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.post(
  "/verifymerchant/:merchantid",
  validate([param("merchantid").exists(), body("value").exists()]),
  verifyAuth,
  verifyMerchantById
);

router.get(
  "/getMerchantbyid/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  getMerchantByIdForAdmin
);

router.get("/merchant/get", verifyAuth, getAllMerchantForAdmin);

// router.get("/roles/:id", validate([param("id").exists()]), getRoleById);
// router.post("/role", validate([body("name").isLength({ min: 2 })]), createRole);

module.exports = router;
