const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email") 
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("ADMIN GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "Accepted", "Rejected", "Processing", "Delivered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("ADMIN UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
});

module.exports = router;
