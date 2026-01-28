const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to DB:", mongoose.connection.name);

  const email = 'admin@coffee.com';
  const plain = 'AdminPass123';

  await User.deleteOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

  const admin = new User({
    email,
    password: plain,
    isAdmin: true,
  });

  await admin.save();

  console.log('✅ Admin user created successfully!');
  console.log('Email:', email);
  console.log('Password:', plain);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
