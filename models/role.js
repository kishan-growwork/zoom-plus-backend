const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const roleSchema = new Schema(
  {
    name: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "role",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const Role = model("role", roleSchema);
module.exports = Role;
