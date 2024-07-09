const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantCategorySchema = new Schema(
  {
    name: String,
    merchantId: Schema.Types.ObjectId,
    comments: { type: String, default: null },
    isVerified: {
      type: Boolean,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "merchantCategory",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const MerchantCategory = model("merchantCategory", merchantCategorySchema);
module.exports = MerchantCategory;
