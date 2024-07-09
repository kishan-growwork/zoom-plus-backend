const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const discountSchema = new Schema(
  {
    createdBy: Schema.Types.ObjectId,
    merchantId: Schema.Types.ObjectId,
    totalPercentage: Number,
    flatDiscountRs: Number,
    flatDiscount: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "discount",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const Discount = model("discount", discountSchema);
module.exports = Discount;
