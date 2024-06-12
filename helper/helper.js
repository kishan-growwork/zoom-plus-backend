require("dotenv").config();

const { v4: uuid } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const S3 = require("aws-sdk/clients/s3");

const awsBUCKET_NAME = "zoomplus";
const awsRegion = "ap-south-1";
const awsAccessKey = process.env.AWS_S3_ACCESS_KEY;
const awsSecretKey = process.env.AWS_S3_SECRET_KEY;

exports.getENV = (name) => {
  return `${process.env.NODE_ENV}_${name}`;
};

exports.generateAccessCode = (length = 32) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let accessCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    accessCode += charset[randomIndex];
  }

  return `${uuid()}-${accessCode}`;
};

exports.successResponse = (
  response,
  data = {},
  message = "Success",
  code = StatusCodes.OK
) => {
  response.status(code).json({
    info: { code, errors: [], isSuccess: true, message },
    data: { ...data },
  });
};

exports.errorResponse = (
  response,
  data = {},
  message = "Error",
  errors = [],
  code = StatusCodes.BAD_GATEWAY
) => {
  response?.status(code).json({
    info: { code, errors: errors, isSuccess: false, message },
    data: { ...data },
  });
};

exports.errorValidationResponse = (
  response,
  data = {},
  message = "Internal Server Error",
  errors = [],
  code = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  response.status(code).json({
    info: { code, errors: errors, isSuccess: false, message },
    data: { ...data },
  });
};

exports.validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

exports.generateOTP = async () => {
  return new Promise((resolve, reject) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    resolve(otp.toString());
  });
};

exports.UploadS3 = async (file, path = "/uploads") => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: awsRegion,
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      });
      const fileName = Date.now() + file.name;
      const uploadLink = await s3
        .upload({
          Bucket: awsBUCKET_NAME,
          Body: file.data,
          Key: path + fileName,
        })
        .promise();

      resolve(
        uploadLink?.Location
          ? {
              url: uploadLink?.Location,
              s3Key: uploadLink?.key,
              s3Bucket: uploadLink?.Bucket,
              success: true,
            }
          : { url: null, success: false }
      );
    } catch (error) {}
  });
};

exports.DeleteS3Object = async (s3Key, s3Bucket) => {
  try {
  } catch (err) {}
};
