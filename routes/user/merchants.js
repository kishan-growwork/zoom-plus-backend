const express = require("express");

const router = express.Router();

//controllers

const { validate } = require("../../helper/helper");
const { body, param } = require("express-validator");
const { verifyAuth } = require("../../middleware/auth");
const { getFoodCategories } = require("../../controllers/user/foods");
const {
  getAllMerchants,
  searchTerm,
} = require("../../controllers/user/merchants");
const { getMerchantById } = require("../../controllers/user/merchants");
// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.get("/merchants", verifyAuth, getAllMerchants);
router.get("/searchterm", verifyAuth, searchTerm);
router.post(
  "/getMerchantById/:id",
  validate([param("id").isLength({ min: 2 })]),
  getMerchantById
);

module.exports = router;
