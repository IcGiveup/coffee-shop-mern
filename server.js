const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const adminCoffeeRoutes = require("./routes/adminCoffeeRoute");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminStatsRoute = require("./routes/adminStatsRoute");

const branchRoutes = require("./routes/branchRoutes");
const adminBranchRoutes = require("./routes/adminBranchRoutes");
const adminInventoryRoutes = require("./routes/adminInventoryRoutes");

const Order = require("./models/orderModel");
const Coffee = require("./models/coffeeModel");
const CoffeeBranch = require("./models/CoffeeBranchModel");

const app = express();

app.use(cors());
app.use(express.json());

console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Undefined");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Undefined");
console.log("PORT:", process.env.PORT || 8000);

let stripe;
try {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} catch (e) {
  console.error("Stripe init failed:", e.message);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use("/api/admin/coffees", adminCoffeeRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/stats", adminStatsRoute);


app.use("/api/branches", branchRoutes);
app.use("/api/admin/branches", adminBranchRoutes);
app.use("/api/admin/inventory", adminInventoryRoutes);

app.use("/api/users", userRoutes);

app.get("/api/coffees", async (req, res) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      const coffees = await Coffee.find().sort({ name: 1 });
      return res.status(200).json(coffees);
    }

    const mappings = await CoffeeBranch.find({
      branchId,
      isAvailable: true,
      stock: { $gt: 0 },
    });

    const coffeeIds = mappings.map((m) => m.coffeeId);
    const coffees = await Coffee.find({ _id: { $in: coffeeIds } }).sort({ name: 1 });

    const mapByCoffee = new Map(mappings.map((m) => [String(m.coffeeId), m]));

    const merged = coffees.map((c) => {
      const m = mapByCoffee.get(String(c._id));
      return {
        ...c.toObject(),
        stock: m ? m.stock : 0,
        offer: m ? m.offer : (c.offer || 0),
        branchId,
      };
    });

    return res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coffees", error: error.message });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, address, totalAmount, branchId } = req.body;

    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items" });
    }
    if (!address?.street || !address?.city) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const line_items = items.map((item) => {
      const variants = Array.isArray(item.variants) ? item.variants : [];
      const prices = Array.isArray(item.prices) ? item.prices : [];

      const variantIndex = variants.indexOf(item.variant);
      const base = variantIndex >= 0 ? Number(prices?.[variantIndex] || 0) : 0;

      const offer = Number(item.offer || 0);
      const discounted = offer > 0 ? base - (base * offer) / 100 : base;

      return {
        price_data: {
          currency: "bdt",
          product_data: { name: item.name },
          unit_amount: Math.round(Number(discounted || 0) * 100),
        },
        quantity: Number(item.quantity || 1),
      };
    });

    const successUrl = `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&totalAmount=${encodeURIComponent(
      String(totalAmount)
    )}&address=${encodeURIComponent(JSON.stringify(address))}&branchId=${encodeURIComponent(
      String(branchId || "")
    )}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: successUrl,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Checkout session error:", error);
    res.status(500).json({ error: "Failed to create session", message: error.message });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  req.url = "/create-checkout-session";
  app._router.handle(req, res);
});

app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData.userId) {
      return res.status(401).json({ message: "Login required to place order" });
    }

    const required = ["userId", "totalAmount", "paymentId", "items", "address"];
    for (const k of required) {
      if (!orderData[k]) {
        return res.status(400).json({ message: `Missing required field: ${k}` });
      }
    }

    const order = new Order(orderData);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
