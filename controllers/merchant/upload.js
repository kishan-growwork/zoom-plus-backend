require("dotenv").config();
const { S3 } = require("aws-sdk");
const { successResponse, errorResponse } = require("../../helper/helper");

const awsBUCKET_NAME = "zoomplus";
const awsRegion = "ap-south-1";
const awsAccessKey = process.env.AWS_S3_ACCESS_KEY;
const awsSecretKey = process.env.AWS_S3_SECRET_KEY;

exports.uploadS3Api = async (req, res) => {
  const file = req?.files?.file;
  if (!file) {
    return errorResponse(res, {}, "No file provided");
  }
  try {
    const s3 = new S3({
      region: awsRegion,
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    });
    const uploadResult = await s3
      .upload({
        Bucket: awsBUCKET_NAME,
        Body: file.data,
        Key: file.name,
      })
      .promise();
    successResponse(
      res,
      {
        url: uploadResult?.Location,
      },
      "Uploaded successfully"
    );
  } catch (error) {
    console.error("-------------------------------");
    console.error("Error => ", error);
    console.error("-------------------------------");
    errorResponse(res, {}, "Failed to upload the file. Please try again later");
  }
};
