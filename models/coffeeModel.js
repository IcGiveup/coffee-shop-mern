// FIYAZ AHMED
const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variants: [{ type: String, required: true }], // e.g., ["small", "medium", "large"]
  prices: [{ type: Number, required: true }],   // e.g., [100, 150, 200]
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Coffee = mongoose.model('Coffee', coffeeSchema);
module.exports = Coffee;
