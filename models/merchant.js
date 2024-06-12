const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantSchema = new Schema(
  {
    step: {
      type: Number,
      default: 0,
    },
    restaurantId: String,
    userId: Schema.Types.ObjectId,
    logo: String,
    images: {
      type: Array,
    },
    foodImages: {
      type: Array,
    },
    menuImages: {
      type: Array,
    },
    restaurantImages: {
      type: Array,
    },
    foodImages: {
      type: Array,
    },
    name: String,
    restAndDeliveryTimeSame: String,
    gstName: String,
    gstNumber: String,
    acNumber: String,
    reAcNumber: String,
    acName: String,
    acType: String,
    ifscCode: String,
    fssaiNumber: String,
    fssaiExpireDate: Date,
    fssaiImage: Array,
    gstImage: Array,
    restaurantType: Array,
    categories: Array,
    acNumber: String,
    openingHours: Array,
    daysOpen: Array,
    openingHours: Array,
    openingHours: Array,
    panCardName: String,
    panCardNumber: String,
    panCardImage: Array,
    address: String,
    lat: String,
    long: String,
    country: String,
    countryCode: String,
    state: String,
    stateCode: String,
    city: String,
    cityCode: String,
    pincode: String,
    restaurantMobileNo: String,
    restaurantMobileNoVerified: {
      type: Boolean,
      default: false,
    },
    restaurantLandline: String,
    restaurantOwnder: String,
    restaurantOwnderMobileNo: String,
    restaurantOwnderMobileNoVerified: {
      type: Boolean,
      default: false,
    },
    restaurantOwnderEmail: String,
    establishmentType: {
      type: String,
      default: "Delivery",
    },
    describeOutlets: {
      type: Array,
      default: [],
    },
    cuisines: {
      type: Array,
      default: [],
    },
    slots: {
      type: Array,
      default: [],
    },
    openDays: {
      type: Array,
      default: [],
    },
    isReferRepresentation: {
      type: Boolean,
      default: false,
    },
    bankNotificationInformation: {
      type: Object,
      default: {},
    },
    merchantDocumentsId: String,
    rating: Number,
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
    collection: "merchants",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

merchantSchema.virtual("role", {
  ref: "role",
  localField: "roleId",
  foreignField: "_id",
  justOne: true,
});

const Merchants = model("merchants", merchantSchema);
module.exports = Merchants;
