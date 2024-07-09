const express = require("express");

const router = express.Router();

//controllers

const { validate } = require("../../helper/helper");
const { body, param } = require("express-validator");
const { verifyAuth } = require("../../middleware/auth");
const {
  getFoodCategories,
  AddwishlistItem,
  AddFavMerchants,
  RemovewishlistItem,
  RemoveFavMerchants,
  AddCartItem,
  RemoveCartItem,
  EmptyCartItem,
} = require("../../controllers/user/foods");

// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.get("/foods/categories", getFoodCategories);

router.post(
  "/wishlist/items/add/:id",
  validate([param("id").isLength({ min: 2 }), body("itemId").exists()]),
  verifyAuth,
  AddwishlistItem
);

router.post(
  "/wishlist/items/remove/:id",
  validate([param("id").isLength({ min: 2 }), body("itemId").exists()]),
  verifyAuth,
  RemovewishlistItem
);

router.post(
  "/favorite/merchants/add/:id",
  validate([param("id").isLength({ min: 2 }), body("merchantsId").exists()]),
  verifyAuth,
  AddFavMerchants
);

router.post(
  "/addtocart/:id",
  validate([
    param("id").isLength({ min: 2 }),
    body("itemId").exists(),
    body("qty").exists(),
  ]),
  verifyAuth,
  AddCartItem
);

router.post(
  "/removetocart/:id",
  validate([param("id").isLength({ min: 2 }), body("itemId").exists()]),
  verifyAuth,
  RemoveCartItem
);

router.post(
  "/emptycart/:userid",
  validate([param("userid").isLength({ min: 2 })]),
  verifyAuth,
  EmptyCartItem
);

router.post(
  "/favorite/merchants/remove/:id",
  validate([param("id").isLength({ min: 2 }), body("merchantsId").exists()]),
  verifyAuth,
  RemoveFavMerchants
);

module.exports = router;
