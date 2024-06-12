const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryByMerchantId,
  getCategory,
  getSubCategoryById,
} = require("../../controllers/merchant/category");

const router = require("express").Router();

router.post(
  "/category/create",
  validate([
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  createCategory
);

router.delete(
  "/category/delete/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  deleteCategory
);

router.put(
  "/category/update/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  updateCategory
);

router.get(
  "/category/getsubcategory/:categoryId",
  validate([param("categoryId").isLength({ min: 2 })]),
  verifyAuth,
  getSubCategoryById
);

router.get("/category/getbymerchantid", verifyAuth, getCategoryByMerchantId);
router.get("/category/get", verifyAuth, getCategory);

module.exports = router;
