const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const cartItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, required: true },
    qty: { type: Number, default: 1, required: true },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    cartList: [cartItemSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    collection: "cart",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const Cart = model("cart", cartSchema);
module.exports = Cart;
