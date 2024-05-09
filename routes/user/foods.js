const express = require("express");

const router = express.Router();

//controllers

const { validate } = require("../../helper/helper");
const { body } = require("express-validator");
const { verifyAuth } = require("../../middleware/auth");
const { getFoodCategories } = require("../../controllers/user/foods");
// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.get("/foods/categories", getFoodCategories);

module.exports = router;
