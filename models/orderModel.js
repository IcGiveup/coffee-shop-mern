const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    variant: { type: String, required: true },
    quantity: { type: Number, required: true },

    price: { type: Number, required: true },

    lineTotal: { type: Number, default: 0 },

    offer: { type: Number, default: 0 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: false },

    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    address: { type: addressSchema, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
