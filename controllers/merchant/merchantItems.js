const {
  successResponse,
  errorResponse,
  UploadS3,
} = require("../../helper/helper");
const MerchantItems = require("../../models/merchantItems");

exports.createMerchantItems = async (req, res) => {
  const data = req.body;

  let images = [];
  if (req?.files?.images?.length > 0) {
    for (let i = 0; i < req?.files?.images?.length; i++) {
      const file = req.files?.images[i];
      let uploadImage = await UploadS3(file, "merchantItems/");
      if (uploadImage.success) {
        images.push({
          url: uploadImage?.url,
          s3Key: uploadImage?.s3Key,
          s3Bucket: uploadImage?.s3Bucket,
        });
      }
    }
  }

  await MerchantItems.create({
    ...data,
    images,
  })
    .then((response) => {
      successResponse(res, { data: response }, "Merchant create successfully");
    })
    .catch((err) => {
      errorResponse(
        res,
        {},
        "Merchant not created yet. Please try again later"
      );
    });
};
