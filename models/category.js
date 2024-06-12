const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    image: String,
    merchantId: String,
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
// categorySchema.path("name").validate(async function (value) {
//   try {
//     const count = await model("category").countDocuments({ name: value });
//     return !count;
//   } catch (err) {
//     console.error("Error checking name uniqueness:", err);
//     throw err; // Re-throw the error for Mongoose to handle it
//   }
// }, "Name already exists");

// // Ensuring indexes are created, especially for unique constraints
// categorySchema.index({ name: 1 }, { unique: true });

const Category = model("category", categorySchema);
module.exports = Category;
