// FIYAZ AHMED
const express = require('express');
const Coffee = require('../models/coffeeModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const coffees = await Coffee.find();
    res.json(coffees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, variants, prices, category, image, description } = req.body;
  const coffee = new Coffee({ name, variants, prices, category, image, description });

  try {
    const newCoffee = await coffee.save();
    res.status(201).json(newCoffee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;