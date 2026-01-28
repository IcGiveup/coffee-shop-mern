const express = require("express");
const router = express.Router();
const Coffee = require("../models/coffeeModel");

const toNum = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

router.post("/add", async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      image,
      stock,
      offer,

      variants,
      prices,

      price,
      smallPrice,
      largePrice,
    } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "name and image are required" });
    }

    let finalVariants = Array.isArray(variants) ? variants : null;
    let finalPrices = Array.isArray(prices) ? prices : null;

    if (!finalVariants || !finalPrices) {
      const sp = smallPrice ?? (Array.isArray(prices) ? prices[0] : undefined);
      const lp = largePrice ?? (Array.isArray(prices) ? prices[1] : undefined);

      if (sp !== undefined && lp !== undefined) {
        finalVariants = ["Small", "Large"];
        finalPrices = [toNum(sp), toNum(lp)];
      }
    }

    if (!finalVariants || !finalPrices) {
      if (price !== undefined) {
        finalVariants = ["Small"];
        finalPrices = [toNum(price)];
      }
    }

    if (!finalVariants || !finalPrices || finalVariants.length !== finalPrices.length) {
      return res.status(400).json({
        message: "variants[] and prices[] are required and must match in length",
      });
    }

    if (finalPrices.some((p) => toNum(p) <= 0)) {
      return res.status(400).json({
        message: "prices must be valid numbers (> 0)",
      });
    }

    if (!category || !description) {
      return res.status(400).json({ message: "category and description are required" });
    }

    const newCoffee = new Coffee({
      name: String(name).trim(),
      category: String(category).trim(),
      description: String(description).trim(),
      image: String(image).trim(),
      stock: toNum(stock, 0),
      offer: toNum(offer, 0),
      variants: finalVariants.map((v) => String(v).trim()),
      prices: finalPrices.map((p) => toNum(p)),
    });

    const saved = await newCoffee.save();
    return res.status(201).json({ message: "Coffee added", coffee: saved });
  } catch (error) {
    console.error("ADD COFFEE ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      image,
      stock,
      offer,
      variants,
      prices,
      price,
      smallPrice,
      largePrice,
    } = req.body;

    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) return res.status(404).json({ message: "Coffee not found" });

    if (name !== undefined) coffee.name = String(name).trim();
    if (category !== undefined) coffee.category = String(category).trim();
    if (description !== undefined) coffee.description = String(description).trim();
    if (image !== undefined) coffee.image = String(image).trim();
    if (stock !== undefined) coffee.stock = toNum(stock, coffee.stock);
    if (offer !== undefined) coffee.offer = toNum(offer, coffee.offer);

    let finalVariants = Array.isArray(variants) ? variants : null;
    let finalPrices = Array.isArray(prices) ? prices : null;

    if (!finalVariants || !finalPrices) {
      const sp = smallPrice ?? (Array.isArray(prices) ? prices[0] : undefined);
      const lp = largePrice ?? (Array.isArray(prices) ? prices[1] : undefined);

      if (sp !== undefined && lp !== undefined) {
        finalVariants = ["Small", "Large"];
        finalPrices = [toNum(sp), toNum(lp)];
      }
    }

    if (!finalVariants || !finalPrices) {
      if (price !== undefined) {
        finalVariants = ["Small"];
        finalPrices = [toNum(price)];
      }
    }

    if (finalVariants && finalPrices) {
      if (finalVariants.length !== finalPrices.length) {
        return res.status(400).json({
          message: "variants[] and prices[] must match in length",
        });
      }
      coffee.variants = finalVariants.map((v) => String(v).trim());
      coffee.prices = finalPrices.map((p) => toNum(p));
    }

    const updated = await coffee.save();
    return res.json({ message: "Coffee updated", coffee: updated });
  } catch (error) {
    console.error("UPDATE COFFEE ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) return res.status(404).json({ message: "Coffee not found" });

    await coffee.deleteOne();
    return res.json({ message: "Coffee deleted" });
  } catch (error) {
    console.error("DELETE COFFEE ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

