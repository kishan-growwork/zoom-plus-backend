require("dotenv").config();
const { ObjectId } = require("mongodb");
const {
  errorResponse,
  generateOTP,
  successResponse,
} = require("../../helper/helper");
const OTP = require("../../models/otp");
const Users = require("../../models/users");
const { getRoleIdByName } = require("../admin/role");
const jwt = require("jsonwebtoken");
const { phone } = require("phone");

exports.signInOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    let checkMobile = phone(mobileNumber);

    if (checkMobile.isValid) {
      let otp = await generateOTP();
      let deleteOldOtp = await this.deleteOTPs(mobileNumber);
      if (deleteOldOtp.status) {
        let otpRes = await OTP.create({ mobileNumber: mobileNumber, otp: otp });
        successResponse(res, { otp: otpRes }, "OTP sent successfully");
      }
    } else {
      errorResponse(res, {}, "Enter Valid mobile number");
    }
  } catch (error) {
    errorResponse(res, {}, "OTP not created yet. Please try again later");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { id, otp } = req?.body;

    let findOtp = await OTP.findOne({ _id: id, otp: otp });
    if (findOtp) {
      let resData = await OTP.findOneAndUpdate(
        { _id: id },
        { isVerified: true }
      );
      let findRole = await getRoleIdByName("user");
      if (findRole.status) {
        let findExistUser = await Users.findOne({
          mobileNumber: findOtp.mobileNumber,
        });
        let userData = null;
        if (findExistUser) {
          userData = findExistUser;
        } else {
          userData = await Users.create({
            mobileNumber: findOtp.mobileNumber,
            isVerified: true,
            isRegistered: false,
            roleId: findRole?.data?.id,
          });
        }
        let jwtData = {
          uid: userData?.id,
        };
        jwt.sign(
          jwtData,
          process.env.SECRET,
          { expiresIn: process.env.EXPIRES_IN },
          (err, token) => {
            if (err) {
              console.log("-------------------");
              console.log("Error token", err);
              console.log("-------------------");
            } else {
              jwt.sign(
                jwtData,
                process.env.SECRET,
                { expiresIn: process.env.RE_EXPIRES_IN },
                (err1, refresh_token) => {
                  if (err1) {
                    console.log("-------------------");
                    console.log("ref Error", err1);
                    console.log("-------------------");
                  } else {
                    successResponse(
                      res,
                      {
                        token,
                        refresh_token,
                        user: userData,
                      },
                      "OTP Verified Success"
                    );
                  }
                }
              );
            }
          }
        );
      }
    } else {
      errorResponse(res, {}, "Invalid OTP. Please try again later");
    }
  } catch (err) {
    console.log("-------------------");
    console.log("err", err);
    console.log("-------------------");
    errorResponse(res, {}, "OTP not verified yet. Please try again later");
  }
};

exports.registerUser = async (req, res) => {
  try {
    if (req?.user?.uid === req?.body?.id) {
      let updateUser = await Users.findOneAndUpdate(
        {
          _id: req.body.id,
          mobileNumber: req.body.mobileNumber,
        },
        { ...req.body, isRegistered: true }
      );
      if (updateUser) {
        let userDetail = await Users.findOne({ _id: req.body.id });
        successResponse(res, { user: userDetail }, "Registration Successfull.");
      } else {
        errorResponse(res, {}, "Registration failed. Please try again later.");
      }
    } else {
      errorResponse(
        res,
        {},
        "Your register other user detail. we not allow you to enter details."
      );
    }
  } catch (err) {
    errorResponse(
      res,
      {},
      "User register detail not updated. Please try again later"
    );
  }
};

exports.registerUserGoogle = async (req, res) => {
  try {
    let findRole = await getRoleIdByName("user");
    if (findRole.status) {
      let userData = {
        provider_uid: req?.user?.sub,
        provider: "google",
        firstName: req?.user?.name?.split(" ")?.[0] || req?.user?.name,
        lastName: req?.user?.name?.split(" ")?.[1] || "",
        roleId: findRole?.data?.id,
        mobileNumber: req?.body?.mobileNumber,
        email: req?.user?.email,
        picture: req?.user?.picture,
        isRegistered: true,
        isVerified: true,
      };
      let createUser = await Users.create(userData);

      if (createUser) {
        const jwtData = {
          uid: createUser?._doc?._id,
        };
        jwt.sign(
          jwtData,
          process.env.SECRET,
          { expiresIn: process.env.EXPIRES_IN },
          (err, token) => {
            if (err) {
              console.log("-------------------");
              console.log("err", err);
              console.log("-------------------");
            } else {
              jwt.sign(
                jwtData,
                process.env.SECRET,
                { expiresIn: process.env.RE_EXPIRES_IN },
                (err1, refresh_token) => {
                  if (err1) {
                    console.log("-------------------");
                    console.log("ref Error", err1);
                    console.log("-------------------");
                  } else {
                    successResponse(
                      res,
                      {
                        token,
                        refresh_token,
                        user: createUser,
                      },
                      "Google user Verified Success"
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        errorResponse(res, {}, "Registration failed. Please try again later.");
      }
    } else {
      errorResponse(res, {}, "Registration failed. Please try again later.");
    }
  } catch (err) {
    if (err?.errorResponse?.keyPattern?.email == 1) {
      errorResponse(res, {}, "User email alreday exists");
    } else {
      errorResponse(
        res,
        {},
        "User register detail not updated. Please try again later"
      );
    }
  }
};

exports.checkIsRegisterGoogleUser = async (req, res) => {
  try {
    let fetchUser = await Users.findOne({ provider_uid: req?.user?.sub });
    if (fetchUser) {
      const jwtData = {
        uid: fetchUser._id,
      };
      jwt.sign(
        jwtData,
        process.env.SECRET,
        { expiresIn: process.env.EXPIRES_IN },
        (err, token) => {
          if (err) {
            console.log("-------------------");
            console.log("err", err);
            console.log("-------------------");
          } else {
            jwt.sign(
              jwtData,
              process.env.SECRET,
              { expiresIn: process.env.RE_EXPIRES_IN },
              (err1, refresh_token) => {
                if (err1) {
                  console.log("-------------------");
                  console.log("ref Error", err1);
                  console.log("-------------------");
                } else {
                  successResponse(
                    res,
                    {
                      token,
                      refresh_token,
                      user: fetchUser,
                    },
                    "Google user Verified Success"
                  );
                }
              }
            );
          }
        }
      );
    } else {
      successResponse(
        res,
        {
          user: {
            isRegistered: false,
          },
        },
        "Check user successfully"
      );
    }
  } catch (err) {
    errorResponse(res, {}, "User detail not found. Please try again later");
  }
};

exports.deleteOTPs = async (mobileNumber) => {
  try {
    await OTP.deleteMany({ mobileNumber: mobileNumber });
    return { status: true, data: null };
  } catch (error) {
    return { status: false, data: null };
  }
};

exports.me = async (req, res) => {
  try {
    successResponse(
      res,
      {
        user: req?.user,
      },
      "User Fetch Success"
    );
  } catch (err) {
    errorResponse(res, {}, "User not found. Please try again later");
  }
};
