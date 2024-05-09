const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const usersSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String },
    roleId: String,
    provider: String,
    provider_uid: String,
    mobileNumber: String,
    picture: String,
    isRegistered: {
      type: Boolean,
      default: false,
    },
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
