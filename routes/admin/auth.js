const express = require("express");

const router = express.Router();
const {
  createAdminUser,
  signIn,
  refreshAuthToken,
} = require("../../controllers/admin/auth");
const { validate } = require("../../helper/helper");
const { body } = require("express-validator");
const { verifyRefreshAuth } = require("../../middleware/auth");

router.post(
  "/createAdminUser",
  validate([
    body("firstName")
      .isLength({ min: 2 })
      .withMessage("Please enter valid first name"),
    body("lastName")
      .isLength({ min: 2 })
      .withMessage("Please enter valid last name"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 2 }).withMessage("Password required"),
    body("roleId").isLength({ min: 2 }).withMessage("Role id required"),
  ]),
  createAdminUser
);

router.post(
  "/signIn",
  validate([
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 2 }).withMessage("Password required"),
  ]),
  signIn
);

router.get("/refreshToken", verifyRefreshAuth, refreshAuthToken);

module.exports = router;
