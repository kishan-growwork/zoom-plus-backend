const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    s3Key: String,
    s3Bucket: String,
    merchantId: Schema.Types.ObjectId,
    categoryId: Schema.Types.ObjectId,
    comments: { type: String, default: null },
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
