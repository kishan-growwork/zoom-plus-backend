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
    restaurantBasicInfo: {
      name: String,
      address: String,
      latitude: String,
      longitude: String,
      mobile: String,
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
    restaurantImages: {
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
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
    restaurantDetails: {
      restaurantType: Array,
      openingHours: Array,
      restopeningHours: Object,
      daysOpen: Array,
      restdaysOpen: Array,
      restAndDeliveryTimeSame: String,
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
    discount: String,
    userId: Schema.Types.ObjectId,
    logo: String,
    gstDetails: {
      gstName: String,
      gstNumber: String,
      gstImage: Array,
      isVerified: { type: Boolean, default: null },
      comments: { type: String, default: null },
    },
    reAcNumber: String,
    categories: Array,
    isVeg: {
      type: Number,
      required: true,
      default: 0,
      //0:vegeterian 1:Non-vegeterian 2:Both
    },
    panDetails: {
      panCardName: String,
      panCardNumber: String,
      panCardImage: Array,
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
    userVerification: {
      comments: { type: String, default: null },
      isVerified: {
        type: Boolean,
        default: null,
      },
    },
    bankDetails: {
      accountType: String,
      acName: String,
      acType: String,
      acNumber: String,
      ifscCode: String,
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
    fssaiDetails: {
      fssaiNumber: String,
      fssaiExpireDate: Date,
      fssaiImage: Array,
      isVerified: {
        type: Boolean,
        default: null,
      },
      comments: { type: String, default: null },
    },
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
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
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
merchantSchema.index({ location: "2dsphere" });

merchantSchema.virtual("role", {
  ref: "role",
  localField: "roleId",
  foreignField: "_id",
  justOne: true,
});

const Merchants = model("merchants", merchantSchema);
module.exports = Merchants;
