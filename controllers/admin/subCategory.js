const { ObjectId } = require("mongodb");
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

exports.verifySubCategoryById = async (req, res) => {
  try {
    const value = req.body.value;
    const role = req.user.roleName;
    if (role !== "admin") {
      return errorResponse(
        res,
        {},
        "Only admin have authority to verify and unverify"
      );
    }
    const id = req.params.subcategoryid;
    const resp = await SubCategory.updateOne(
      { isDeleted: false, _id: new ObjectId(id) },
      { $set: { isVerified: value } }
    );
    if (resp.modifiedCount === 0) {
      return errorResponse(res, {}, "No SubCategory found or update failed");
    }
    successResponse(res, { data: resp }, "SubCategory verified successfully");
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    errorResponse(res, {}, "Failed to update the data. Please try again later");
  }
};
