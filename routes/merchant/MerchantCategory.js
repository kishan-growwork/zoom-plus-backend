const { body, param } = require("express-validator");

const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");
const {
  createCategoryForMerchant,
  deleteCategory,
  getCategoryByMerchantId,
  getSubCategoryById,
  updateCategory,
} = require("../../controllers/merchant/Merchantcategory");

const router = require("express").Router();

router.post(
  "/merchantcategory/create",
  validate([
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  createCategoryForMerchant
);

router.delete(
  "/merchantcategory/delete/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  deleteCategory
);

router.put(
  "/merchantcategory/update/:id",
  validate([param("id").isLength({ min: 2 })]),
  verifyAuth,
  updateCategory
);

router.get(
  "/merchantcategory/getsubcategory/:categoryId",
  validate([param("categoryId").isLength({ min: 2 })]),
  verifyAuth,
  getSubCategoryById
);

router.get(
  "/merchantcategory/getbymerchantid",
  verifyAuth,
  getCategoryByMerchantId
);

module.exports = router;
