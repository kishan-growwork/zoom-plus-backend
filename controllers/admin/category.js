const {
  successResponse,
  errorResponse,
  UploadS3,
} = require("../../helper/helper");
const Category = require("../../models/category");

exports.createCategory = async (req, res) => {
  const data = req.body;

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

  await Category.create({
    ...data,
    image,
    s3Key,
    s3Bucket,
    createdBy: req?.user?.id,
  })
    .then((response) => {
      const { s3Bucket, s3Key, ...rest } = response._doc;
      successResponse(res, { data: rest }, "Category create successfully");
    })
    .catch((err) => {
      errorResponse(
        res,
        {},
        "Category not created yet. Please try again later"
      );
    });
};

exports.getAllCategories = async (req, res) => {
  try {
    let results = await Category.find({});
    console.log("-------------------");
    console.log("result", results);
    console.log("-------------------");
    successResponse(
      res,
      {
        categories: results.map((item) => {
          const { s3Bucket, s3Key, ...rest } = item._doc;
          return { ...rest };
        }),
      },
      "Category fetch successfully"
    );
  } catch (err) {
    errorResponse(
      res,
      err?.message || {},
      "Category not created yet. Please try again later"
    );
  }
};

exports.editCategory = async (req, res) => {
  try {
    let updateCategory = await Category.findByIdAndUpdate(
      req?.body?.categoryId,
      { ...req.body }
    );
    if (updateCategory) {
      successResponse(res, { data: null }, "Category update successfully");
    } else {
      errorResponse(res, {}, "Category not updated. Please try again later");
    }
  } catch (error) {
    errorResponse(res, {}, "Category not updated. Please try again later");
  }
};

exports.changeImage = async (req, res) => {
  try {
    const data = req.body;

    let image = null;
    let s3Key = null;
    let s3Bucket = null;
    if (req.files.image) {
      let findOldImage = await Category.findById(req?.body?.categoryId);

      if (findOldImage) {
        let oldS3Key = findOldImage?.s3Key;
        let oldS3Bucket = findOldImage?.s3Bucket;
      }

      let uploadImage = await UploadS3(req.files.image, "categories/");

      if (uploadImage.success) {
        image = uploadImage?.url;
        s3Key = uploadImage?.s3Key;
        s3Bucket = uploadImage?.s3Bucket;
      }
    }
  } catch (err) {
    errorResponse(
      res,
      {},
      "Category image not updated. Please try again later"
    );
  }
};
