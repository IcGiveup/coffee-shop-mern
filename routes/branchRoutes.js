const express = require("express");
const router = express.Router();
const Branch = require("../models/BranchModel");

router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ name: 1 });
    res.json(branches);
  } catch (e) {
    res.status(500).json({ message: "Failed to load branches", error: e.message });
  }
});

module.exports = router;
