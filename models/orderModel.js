// FIYAZ AHMED
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      variant: String,
    },
  ],
  address: {
    street: String,
    city: String,
  },
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;