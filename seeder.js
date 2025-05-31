// FIYAZ AHMED
const mongoose = require('mongoose');
const Coffee = require('./models/coffeeModel');
const dotenv = require('dotenv');
const coffees = require('./coffeesdata');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Coffee.deleteMany(); 
    await Coffee.insertMany(coffees);
    console.log("Coffee data seeded!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
