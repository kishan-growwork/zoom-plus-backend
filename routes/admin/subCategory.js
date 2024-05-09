const { body, param } = require("express-validator");
const {
  createSubCategory,
  getAllSubCategories,
} = require("../../controllers/admin/subCategory");
const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

router.post(
  "/subCategory",
  validate([
    body("name").isLength({ min: 2 }),
    body("categoryId").isLength({ min: 2 }),
  ]),
  verifyAuth,
  createSubCategory
);

router.get("/subCategory", verifyAuth, getAllSubCategories);

module.exports = router;
