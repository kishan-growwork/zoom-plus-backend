const { errorResponse, successResponse } = require("../../helper/helper");
const Role = require("../../models/role");
const Users = require("../../models/users");
const jwt = require("jsonwebtoken");

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let getAdminRole = await Role.findOne({ name: "admin" });
    if (getAdminRole) {
      let adminUser = await Users.findOne({
        email,
        password,
        roleId: getAdminRole?.id,
        isDeleted: false,
        isVerified: true,
      });
      if (adminUser) {
        let jwtData = {
          tokenType: "token",
          uid: adminUser.id,
          roleId: adminUser.roleId,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
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
                { ...jwtData, tokenType: "refresh_token" },
                process.env.SECRET,
                { expiresIn: process.env.RE_EXPIRES_IN },
                (err1, refresh_token) => {
                  if (err1) {
                  } else {
                    let newData = {
                      ...adminUser?._doc,
                      id: adminUser?._doc?._id,
                    };
                    delete newData.password;
                    successResponse(
                      res,
                      {
                        token,
                        refresh_token,
                        user: newData,
                      },
                      "Login Success"
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        errorResponse(
          res,
          {},
          "Email or Password wrong. Please try again later"
        );
      }
    } else {
      errorResponse(res, {}, "Something went wrong. Please try again later");
    }
  } catch (err) {
    errorResponse(res, {}, "Invalid user. Please try again later");
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    let userData = await Users.create({ ...req.body });
    if (userData) {
      delete userData.password;
      successResponse(
        res,
        { user: userData },
        "Admin User create successfully"
      );
    }
  } catch (err) {
    errorResponse(res, {}, "Admin user not created. Please try again later");
  }
};

exports.refreshAuthToken = async (req, res) => {
  try {
    let adminUser = await Users.findById(req?.user?.uid);
    if (adminUser) {
      let jwtData = {
        tokenType: "token",
        uid: adminUser.id,
        roleId: adminUser.roleId,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
      };
      jwt.sign(
        jwtData,
        process.env.SECRET,
        { expiresIn: process.env.EXPIRES_IN },
        (err, token) => {
          if (err) {
          } else {
            jwt.sign(
              { ...jwtData, tokenType: "refresh_token" },
              process.env.SECRET,
              { expiresIn: process.env.RE_EXPIRES_IN },
              (err1, refresh_token) => {
                if (err1) {
                } else {
                  let newData = {
                    ...adminUser?._doc,
                    id: adminUser?._doc?._id,
                  };
                  delete newData.password;
                  successResponse(
                    res,
                    {
                      token,
                      refresh_token,
                      user: newData,
                    },
                    "Token and Refresh token generated"
                  );
                }
              }
            );
          }
        }
      );
    } else {
      errorResponse(res, {}, "Email or Password wrong. Please try again later");
    }
  } catch (err) {}
};
