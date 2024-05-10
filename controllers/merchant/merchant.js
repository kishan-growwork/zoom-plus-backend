const { successResponse, UploadS3 } = require("../../helper/helper");
const Merchants = require("../../models/merchant");

exports.createMerchant = async (req, res) => {
  const data = req.body;

  let logoURL = null;
  let menuImages = null;
  let images = [];

  if (req.files.logo) {
    let uploadImage = await UploadS3(
      req.files.logo,
      `merchants/${req?.body?.restaurantId}`
    );
    if (uploadImage.success) {
      logoURL = uploadImage?.url;
    }
  }
  if (req?.files?.images?.length) {
    for (let index = 0; index < req?.files?.images.length; index++) {
      const item = req?.files?.images[index];
      let uploadImage = await UploadS3(
        item,
        `merchants/${req?.body?.restaurantId}`
      );
      if (uploadImage.success) {
        images.push(uploadImage?.url);
      }
    }
  }
  if (req?.files?.menuImages) {
    let uploadImage = await UploadS3(
      req.files.menuImages,
      `merchants/${req?.body?.restaurantId}`
    );
    if (uploadImage.success) {
      menuImages = uploadImage?.url;
    }
  }

  //   successResponse(res, { data: data }, "Merchant create successfully");

  await Merchants.create({ ...data, images: images, menuImages, logo: logoURL })
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
