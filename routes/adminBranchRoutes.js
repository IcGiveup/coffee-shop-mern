const express = require("express");
const router = express.Router();
const Branch = require("../models/BranchModel");

router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find({}).sort({ createdAt: -1 });
    res.json(branches);
  } catch (e) {
    res.status(500).json({ message: "Failed to load branches", error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Branch name is required" });
    }

    const created = await Branch.create({
      name: String(name).trim(),
      address: String(address || "").trim(),
      isActive: true,
    });

    res.status(201).json(created);
  } catch (e) {
    if (String(e.message || "").includes("duplicate key")) {
      return res.status(400).json({ message: "Branch name already exists" });
    }
    res.status(500).json({ message: "Failed to create branch", error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, address, isActive } = req.body;

    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    if (name !== undefined) branch.name = String(name).trim();
    if (address !== undefined) branch.address = String(address).trim();
    if (isActive !== undefined) branch.isActive = Boolean(isActive);

    await branch.save();
    res.json(branch);
  } catch (e) {
    res.status(500).json({ message: "Failed to update branch", error: e.message });
  }
});

module.exports = router;
