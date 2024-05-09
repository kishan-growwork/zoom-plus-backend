const { body, param } = require("express-validator");
const {
  createCategory,
  getAllCategories,
} = require("../../controllers/admin/category");
const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.post(
  "/category",
  validate([body("name").isLength({ min: 2 })]),
  verifyAuth,
  createCategory
);

router.get("/category", verifyAuth, getAllCategories);

module.exports = router;
