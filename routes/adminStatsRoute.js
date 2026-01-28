const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const Coffee = require("../models/coffeeModel");

router.get("/", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 10))); // default 10

    const orders = await Order.find({});
    const coffees = await Coffee.find({});

    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);

    const itemSales = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = String(item?.name || "").trim();
        if (!key) return;
        itemSales[key] = (itemSales[key] || 0) + Number(item?.quantity || 0);
      });
    });

    const topItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, quantity]) => ({ name, quantity }));

    res.json({
      totalOrders,
      totalSales,
      totalProducts: coffees.length,
      topItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
});

module.exports = router;

