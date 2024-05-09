const {
  successResponse,
  errorResponse,
  UploadS3,
} = require("../../helper/helper");
const Category = require("../../models/category");
const SubCategory = require("../../models/subCategory");

exports.createSubCategory = async (req, res) => {
  const data = req.body;

  let checkCategory = await Category.findById(req?.body?.categoryId);
  if (!checkCategory) {
    return errorResponse(res, {}, "Category not found. Please try again later");
  }

  let image = null;
  let s3Key = null;
  let s3Bucket = null;
  if (req.files.image) {
    let uploadImage = await UploadS3(req.files.image, "categories/");

    if (uploadImage.success) {
      image = uploadImage?.url;
      s3Key = uploadImage?.s3Key;
      s3Bucket = uploadImage?.s3Bucket;
    }
  }

  await SubCategory.create({
    ...data,
    image,
    s3Key,
    s3Bucket,
    createdBy: req?.user?.id,
  })
    .then((response) => {
      successResponse(
        res,
        { data: response },
        "SubCategory create successfully"
      );
    })
    .catch((err) => {
      errorResponse(
        res,
        {},
        "SubCategory not created yet. Please try again later"
      );
    });
};

exports.getAllSubCategories = async (req, res) => {
  try {
    let results = await SubCategory.find({});
    successResponse(
      res,
      {
        subCategories: results.map((item) => {
          const { s3Bucket, s3Key, ...rest } = item._doc;
          return { ...rest };
        }),
      },
      "SubCategory fetch successfully"
    );
  } catch (err) {
    errorResponse(
      res,
      err?.message || {},
      "SubCategory not created yet. Please try again later"
    );
  }
};
