const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const otp = new Schema(
  {
    mobileNumber: String,
    otp: String,
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
    collection: "otp",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const OTP = model("otp", otp);
module.exports = OTP;
