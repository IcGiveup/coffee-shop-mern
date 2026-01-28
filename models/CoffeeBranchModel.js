const mongoose = require("mongoose");

const coffeeBranchSchema = new mongoose.Schema(
  {
    coffeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Coffee", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

    stock: { type: Number, default: 0 },
    offer: { type: Number, default: 0 }, // offer override per branch
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

coffeeBranchSchema.index({ coffeeId: 1, branchId: 1 }, { unique: true });

module.exports = mongoose.model("CoffeeBranch", coffeeBranchSchema);
