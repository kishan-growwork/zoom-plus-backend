const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const {
  createMerchant,
  getMerchantById,
  getAllmerchantsForOutlets,
  updateMerchant,
  deleteMerchant,
  getAllMerchant,
} = require("../../controllers/merchant/merchant");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.post(
  "/create",
  validate([
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  createMerchant
);

router.get(
  "/getMerchantbyid/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  getMerchantById
);

router.put(
  "/updatemerchant/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  updateMerchant
);

router.delete(
  "/deletemerchant/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  deleteMerchant
);

// router.get("/getallmerchant/:userId", getAllMerchantforUser);

router.get("/getallmerchant/list", verifyAuth, getAllMerchant);

router.get("/allmerchantItem/get", verifyAuth, getAllmerchantsForOutlets);

module.exports = router;
