require("dotenv").config();
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../helper/helper");
const { StatusCodes } = require("http-status-codes");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const client1 = process.env.GOOGLE_CLIENT_ID_ANDROID;
const client2 = process.env.GOOGLE_CLIENT_ID_WEB;
const client3 = process.env.GOOGLE_CLIENT_ID_IOS;

exports.verifyAuth = async (req, res, next) => {
  const token = req.headers["authorization"] || "";

  if (token) {
    let checkToken = token?.split("Bearer ");

    if (token?.startsWith("Bearer ")) {
      if (checkToken[1]) {
        jwt.verify(checkToken[1], process.env.SECRET, (err, authdata) => {
          if (err) {
            errorResponse(
              res,
              null,
              "invalid token or expired token",
              { err_code: "TOKEN_EXPIRED" },
              StatusCodes.UNAUTHORIZED
            );
          } else {
            if (authdata?.tokenType !== "refresh_token") {
              req.user = authdata;
              next();
            } else {
              errorResponse(
                res,
                null,
                "You have not access with refresh token. Please use access token",
                { err_code: "NOT_ACCESS" },
                StatusCodes.UNAUTHORIZED
              );
            }
          }
        });
      } else {
        errorResponse(
          res,
          null,
          "invalid token or expired token",
          [],
          StatusCodes.UNAUTHORIZED
        );
      }
    } else {
      errorResponse(
        res,
        null,
        "invalid token or expired token",
        [],
        StatusCodes.UNAUTHORIZED
      );
    }
  } else {
    errorResponse(res, null, "token not found", [], StatusCodes.UNAUTHORIZED);
  }
};

exports.verifyRefreshAuth = async (req, res, next) => {
  const token = req.headers["authorization"] || "";

  if (token) {
    let checkToken = token?.split("Bearer ");

    if (token?.startsWith("Bearer ")) {
      if (checkToken[1]) {
        jwt.verify(checkToken[1], process.env.SECRET, (err, authdata) => {
          if (err) {
            errorResponse(
              res,
              null,
              "invalid token or expired token",
              { err_code: "TOKEN_EXPIRED" },
              StatusCodes.UNAUTHORIZED
            );
          } else {
            if (authdata?.tokenType === "refresh_token") {
              req.user = authdata;
              next();
            } else {
              errorResponse(
                res,
                null,
                "Invalid refresh token",
                { err_code: "NOT_ACCESS" },
                StatusCodes.UNAUTHORIZED
              );
            }
          }
        });
      } else {
        errorResponse(
          res,
          null,
          "invalid refresh token or expired token",
          [],
          StatusCodes.UNAUTHORIZED
        );
      }
    } else {
      errorResponse(
        res,
        null,
        "invalid refresh token or expired token",
        [],
        StatusCodes.UNAUTHORIZED
      );
    }
  } else {
    errorResponse(
      res,
      null,
      "refresh token not found",
      [],
      StatusCodes.UNAUTHORIZED
    );
  }
};

exports.verifyGoogleUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"] || "";

    if (token) {
      let checkToken = token?.split("Bearer ");

      if (token?.startsWith("Bearer ")) {
        if (checkToken[1]) {
          const ticket = await client.verifyIdToken({
            idToken: checkToken[1],
            audience: [client1, client2, client3],
          });
          const payload = ticket.getPayload();
          console.log("-------------------");
          console.log("payload", payload);
          console.log("-------------------");
          if (payload?.email && payload?.email_verified) {
            req.user = payload;
            next();
          } else {
            errorResponse(
              res,
              null,
              "Your google account not verified",
              [],
              StatusCodes.UNAUTHORIZED
            );
          }
        } else {
          errorResponse(
            res,
            null,
            "invalid token or expired token",
            [],
            StatusCodes.UNAUTHORIZED
          );
        }
      } else {
        errorResponse(
          res,
          null,
          "invalid token or expired token",
          [],
          StatusCodes.UNAUTHORIZED
        );
      }
    } else {
      errorResponse(res, null, "token not found", [], StatusCodes.UNAUTHORIZED);
    }
  } catch (err) {
    errorResponse(
      res,
      null,
      "invalid token or expired token",
      [],
      StatusCodes.UNAUTHORIZED
    );
  }
};
