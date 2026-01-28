const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

router.post('/', async (req, res) => {
  try {
    const { userId, items, address, totalAmount, paymentId } = req.body;

    if (!userId || !items || !address || !totalAmount || !paymentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      userId,
      items,
      address,
      totalAmount,
      paymentId,
      status: 'Pending', 
      createdAt: new Date(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

module.exports = router;