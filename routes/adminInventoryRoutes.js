const express = require("express");
const router = express.Router();
const CoffeeBranch = require("../models/CoffeeBranchModel");
const Coffee = require("../models/coffeeModel");

router.get("/:branchId", async (req, res) => {
  try {
    const { branchId } = req.params;

    const coffees = await Coffee.find({}).sort({ name: 1 });
    const maps = await CoffeeBranch.find({ branchId });

    const mapByCoffee = new Map(maps.map((m) => [String(m.coffeeId), m]));

    const rows = coffees.map((c) => {
      const m = mapByCoffee.get(String(c._id));
      return {
        coffee: c,
        inventory: m
          ? {
              _id: m._id,
              stock: m.stock,
              offer: m.offer,
              isAvailable: m.isAvailable,
            }
          : {
              _id: null,
              stock: 0,
              offer: 0,
              isAvailable: false,
            },
      };
    });

    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Failed to load inventory", error: e.message });
  }
});

router.post("/set", async (req, res) => {
  try {
    const { coffeeId, branchId, stock, offer, isAvailable } = req.body;

    if (!coffeeId || !branchId) {
      return res.status(400).json({ message: "coffeeId and branchId are required" });
    }

    const payload = {
      stock: Number(stock || 0),
      offer: Number(offer || 0),
      isAvailable: Boolean(isAvailable),
    };

    const updated = await CoffeeBranch.findOneAndUpdate(
      { coffeeId, branchId },
      { $set: payload },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to set inventory", error: e.message });
  }
});

module.exports = router;
