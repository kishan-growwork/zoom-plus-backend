const express = require("express");

const router = express.Router();

//controllers
const {
  signInOtp,
  verifyOtp,
  registerUser,
  me,
  registerUserGoogle,
  checkIsRegisterGoogleUser,
} = require("../../controllers/user/auth");
const { validate } = require("../../helper/helper");
const { body } = require("express-validator");
const { verifyAuth, verifyGoogleUser } = require("../../middleware/auth");
// const { verifyAuth, forgotPasswordVerifyToken } = require("../middleware/auth");

router.post(
  "/auth/signInOtp",
  validate([body("mobileNumber").isLength({ min: 10 })]),
  signInOtp
);
router.post(
  "/auth/verifyOtp",
  validate([body("id").exists(), body("otp").isLength({ min: 4, max: 4 })]),
  verifyOtp
);
router.post(
  "/auth/registerUser",
  validate([
    body("id").exists(),
    body("firstName").isLength({ min: 2 }),
    body("lastName").isLength({ min: 2 }),
    body("email").isEmail(),
    body("mobileNumber").exists(),
  ]),
  verifyAuth,
  registerUser
);
router.post(
  "/auth/registerUserGoogle",
  validate([body("mobileNumber").exists()]),
  verifyGoogleUser,
  registerUserGoogle
);
router.get(
  "/auth/checkIsRegisterGoogleUser",
  verifyGoogleUser,
  checkIsRegisterGoogleUser
);

router.put("/auth/me", me);
// router.post("/user/forgot/password", forgotPasswordEmailLink);
// router.post("/user/password/reset", forgotPasswordVerifyToken, resetPassword);

// router.get("/user/:id", detailsUser);
// router.post("/user/create", createUser);
// router.put("/user/update/:id", userUpdate);
// router.delete("/user/delete/:id", userDelete);
// router.get("/user/with/role", getUsersRoleWise);
// router.get("/getUserData/:id", getUserData);

// router.post("/users", getUsers);
// router.post("/freeSubscription/:id", createFreeSubscription);
// // router.post('/users/filter', filterUsers);

module.exports = router;
