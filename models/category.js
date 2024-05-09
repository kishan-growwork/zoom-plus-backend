const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: String,
    createdBy: String,
    s3Key: String,
    s3Bucket: String,
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
    collection: "category",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const Category = model("category", categorySchema);
module.exports = Category;
