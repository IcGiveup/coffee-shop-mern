const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variants: [{ type: String, required: true }],
  prices: [{ type: Number, required: true }], // Array for prices
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, default: 0 }, // Available stock
  offer: { type: Number, default: 0 },  // Percentage discount
}, { timestamps: true });

const Coffee = mongoose.model('Coffee', coffeeSchema);
module.exports = Coffee;

