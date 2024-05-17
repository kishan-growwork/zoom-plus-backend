const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantItemsSchema = new Schema(
  {
    name: { type: String, required: true },
    merchantId: String,
    category: {
      type: String,
      ref: "merchantCategory",
      default: "none",
    },
    subs: {
      type: String,
      default: "none",
      ref: "merchantSubCategory",
    },
    images: {
      type: Array,
    },
    isVeg: {
      type: Number,
      required: true,
      default: 0,
      //0:vegeterian 1:Non-vegeterian 2:Both
    },
    extras: [],
    additionalInfo: String,
    isEligibleCoupon: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCustomizable: {
      type: Boolean,
      default: false,
    },
    timeSlots: [],
    availableDays: [], // 0:Monday,1:TuesDay,2:wednesday,3:thursday,4:friday,5:saturday,6:sunday
    isSpicy: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    isVerified: {
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
    reviews: [{ userId: String, text: String }],
    ratings: [
      {
        type: Number,
        postedBy: { type: String, ref: "users" },
      },
    ],
  },
  {
    collection: "merchantItems",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const MerchantItems = model("merchantItems", merchantItemsSchema);
module.exports = MerchantItems;
