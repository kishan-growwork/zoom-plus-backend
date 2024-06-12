const { body, param } = require("express-validator");
const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");
const {
  createSubCategory,
  updateSubCategory,
  getSubCategory,
  deleteSubCategory,
} = require("../../controllers/merchant/subCategory");

const router = require("express").Router();

router.post(
  "/subcategory/create",
  validate([
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  createSubCategory
);

router.put(
  "/subcategory/update/:id",
  validate([
    param("id").isLength({ min: 2 }),
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  updateSubCategory
);

router.delete(
  "/subcategory/delete/:id",
  validate([
    param("id").isLength({ min: 2 }),
    body()
      .custom((value) => {
        return Object.keys(value).length > 0;
      })
      .withMessage("Body cannot be empty"),
  ]),
  verifyAuth,
  deleteSubCategory
);

router.get("/subcategory/get", verifyAuth, getSubCategory);

module.exports = router;
