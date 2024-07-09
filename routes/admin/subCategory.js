const { body, param } = require("express-validator");
const {
  createSubCategory,
  getAllSubCategories,
  verifySubCategoryById,
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

router.post(
  "/subcategory/verify/:subcategoryid",
  validate([param("subcategoryid").exists(), body("value").exists()]),
  verifyAuth,
  verifySubCategoryById
);

router.get("/subCategory", verifyAuth, getAllSubCategories);

module.exports = router;
