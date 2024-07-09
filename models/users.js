const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const usersSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    // email: { type: String, unique: true },
    email: {
      type: String,
      unique: [true, "Email should be uniuqe"],
      required: [true, "Email is required"],
    },
    password: { type: String },
    roleId: String,
    provider: String,
    provider_uid: String,
    mobileNumber: String,
    picture: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId }],
    merchantlist: [{ type: mongoose.Schema.Types.ObjectId }],
    cartId: { type: mongoose.Schema.Types.ObjectId },
    isRegistered: {
      type: Boolean,
      default: false,
    },
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
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

usersSchema.virtual("role", {
  ref: "role",
  localField: "roleId",
  foreignField: "_id",
  justOne: true,
});

const Users = model("users", usersSchema);
module.exports = Users;
