const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantItemsSchema = new Schema(
  {
    name: { type: String, required: true },
    merchantId: Schema.Types.ObjectId,
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    subs: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
    },
    images: {
      type: Array,
    },
    isVeg: {
      type: Array,
      required: true,
      //0:vegeterian 1:Non-vegeterian 2:Both
    },
    comments: { type: String, default: null },
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
    timeSlots: [], //[{from:date to:farw},{}]
    availableDays: [], // 0:Monday,1:TuesDay,2:wednesday,3:thursday,4:friday,5:saturday,6:sunday
    isSpicy: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    isVerified: {
      type: Boolean,
      default: null,
    },
    userId: String,
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
