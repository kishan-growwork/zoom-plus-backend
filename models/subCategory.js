const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: String,
    s3Key: String,
    s3Bucket: String,
    createdBy: String,
    categoryId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "subCategory",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

subCategorySchema.virtual("category", {
  ref: "category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

const SubCategory = model("subCategory", subCategorySchema);
module.exports = SubCategory;
