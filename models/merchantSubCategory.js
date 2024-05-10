const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantSubCategorySchema = new Schema(
  {
    name: String,
    merchantId: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "merchantSubCategory",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const MerchantSubCategory = model(
  "merchantSubCategory",
  merchantSubCategorySchema
);
module.exports = MerchantSubCategory;
