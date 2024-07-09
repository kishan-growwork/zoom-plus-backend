const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const ItemSchema = new Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId },
    qty: { type: Number, default: 1 },
    price: Number,
    merchantId: Schema.Types.ObjectId,
  },
  { _id: false }
);

const ordersSchema = new Schema(
  {
    OrderedBy: Schema.Types.ObjectId,
    items: [ItemSchema],
    totalPrice: Number,
    timing: {
      placedAt: {
        type: Date,
        default: null
      },
      acceptedAt: {
        type: Date,
        default: null
      },
      readyforpickupAt: {
        type: Date,
        default: null
      },
      completedAt: {
        type: Date,
        default: null
      },
      timer: {
        type: Number,
        default: null
      }
    },
    otp: {
      type: String,
      default: null,
    },
    uniqueId: {
      type: String,
    },
    orderStatus: {
      type: String,
      default: "Placed",
      enum: [
        "Placed",
        "Preparing",
        "Rejected",
        "ReadyforPickup",
        "Cancelled",
        "Completed",
      ],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "orders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const Orders = model("orders", ordersSchema);
module.exports = Orders;
