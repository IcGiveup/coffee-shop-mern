const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Coffee = require("./models/coffeeModel");

dotenv.config();

const coffees = [
  {
    name: "Espresso",
    variants: ["Small", "Large"],
    prices: [150, 200],
    category: "Hot Coffee",
    image: "https://th.bing.com/th/id/OIP.RLKFroFUQgvZTcSsRV-4KgHaD3?cb=iwc2&rs=1&pid=ImgDetMain",
    description: "Strong and rich espresso shot to energize your day.",
    stock: 50,
    offer: 0,
  },
  {
    name: "Latte",
    variants: ["Small", "Large"],
    prices: [200, 250],
    category: "Hot Coffee",
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/11/15/latte-on-white-surface.jpg.rend.hgtvcom.1280.853.suffix/1668540450323.jpeg",
    description: "Smooth milk coffee with rich flavor and creamy texture.",
    stock: 40,
    offer: 0,
  },
  {
    name: "Cappuccino",
    variants: ["Small", "Large"],
    prices: [180, 230],
    category: "Hot Coffee",
    image: "https://th.bing.com/th/id/OIP.o7dj03FWHpEELz_eH7xlqwHaEK?cb=iwc2&rs=1&pid=ImgDetMain",
    description: "A perfect blend of milk and espresso with a foamy top.",
    stock: 60,
    offer: 0,
  },
  {
    name: "Americano",
    variants: ["Small", "Large"],
    prices: [160, 210],
    category: "Hot Coffee",
    image: "https://th.bing.com/th/id/OIP.y2zgx5zvwVLQinZDF3YGbAHaFj?cb=iwc2&rs=1&pid=ImgDetMain",
    description: "Espresso diluted with hot water for a smooth taste.",
    stock: 70,
    offer: 0,
  },
  {
    name: "Mocha",
    variants: ["Small", "Large"],
    prices: [220, 270],
    category: "Hot Coffee",
    image: "https://th.bing.com/th/id/OIP.wYtcm0ninEB1tFjFqd1stgHaE8?cb=iwc2&rs=1&pid=ImgDetMain",
    description: "Chocolate-flavored coffee topped with whipped cream.",
    stock: 45,
    offer: 0,
  },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB:", mongoose.connection.name);
    await Coffee.deleteMany();
    console.log("Old coffee data removed.");

    await Coffee.insertMany(coffees);
    console.log("✅ New coffee data added successfully!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding coffee data:", error);
    process.exit(1);
  }
}

seedData();
