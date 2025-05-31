// FIYAZ AHMED
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userRoutes = require('./routes/userRoute'); 
const Order = require('./models/OrderModel'); 

console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Loaded' : 'Undefined');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Undefined');
console.log('PORT:', process.env.PORT || 8000);

let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in .env file');
  }
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Stripe initialization failed:', error.message);
  process.exit(1); 
}

const app = express(); 

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/users', userRoutes);

app.get('/api/coffees', (req, res) => {
  const coffees = [
    { _id: '1', name: 'Espresso', price: 150, image: 'https://th.bing.com/th/id/OIP.RLKFroFUQgvZTcSsRV-4KgHaD3?cb=iwc2&rs=1&pid=ImgDetMain', variants: ['Small', 'Large'], prices: [150, 200] },
    { _id: '2', name: 'Latte', price: 200, image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/11/15/latte-on-white-surface.jpg.rend.hgtvcom.1280.853.suffix/1668540450323.jpeg', variants: ['Small', 'Large'], prices: [200, 250] },
    { _id: '3', name: 'Cappuccino', price: 180, image: 'https://th.bing.com/th/id/OIP.o7dj03FWHpEELz_eH7xlqwHaEK?cb=iwc2&rs=1&pid=ImgDetMain', variants: ['Small', 'Large'], prices: [180, 230] },
    { _id: '4', name: 'Americano', price: 160, image: 'https://th.bing.com/th/id/OIP.y2zgx5zvwVLQinZDF3YGbAHaFj?cb=iwc2&rs=1&pid=ImgDetMain', variants: ['Small', 'Large'], prices: [160, 210] },
    { _id: '5', name: 'Mocha', price: 220, image: 'https://th.bing.com/th/id/OIP.wYtcm0ninEB1tFjFqd1stgHaE8?cb=iwc2&rs=1&pid=ImgDetMain', variants: ['Small', 'Large'], prices: [220, 270] },
    { _id: '6', name: 'Macchiato', price: 170, image: 'https://th.bing.com/th/id/OIP.T4pdaWL_qm6vUnkugm73pgHaHa?cb=iwc2&rs=1&pid=ImgDetMain', variants: ['Small', 'Large'], prices: [170, 220] },
    { _id: '7', name: 'Flat White', price: 190, image: 'https://th.bing.com/th/id/R.21b42dfcfda111f68b08c87a0ade9003?rik=wgH5ykTTX7SjVQ&pid=ImgRaw&r=0', variants: ['Small', 'Large'], prices: [190, 240] },
    { _id: '8', name: 'Affogato', price: 230, image: 'https://media.scoolinary.app/recipes/images/2023/12/flat-white1-1.jpg', variants: ['Small', 'Large'], prices: [230, 280] },
    { _id: '9', name: 'Cold Brew', price: 210, image: 'https://sousvide.luxe/wp-content/uploads/2023/04/cold-refreshing-iced-cold-brew-coffee-2023-04-21-23-00-22-utc-scaled.jpg', variants: ['Small', 'Large'], prices: [210, 260] },
  ];
  res.status(200).json(coffees);
});

app.post('/create-checkout-session', async (req, res) => {
  const { items, address, totalAmount } = req.body;

  console.log('Received checkout data:', { items, address, totalAmount });
  if (!items || !Array.isArray(items) || !address || !totalAmount) {
    console.error('Invalid checkout data:', { items, address, totalAmount });
    return res.status(400).json({ error: 'Invalid checkout data' });
  }

  try {
    console.log('Creating checkout session with items:', items, 'address:', address, 'totalAmount:', totalAmount);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => {
        console.log('Processing item:', item);
        if (!item.name || !item.quantity || !item.prices || !item.variants) {
          throw new Error(`Invalid item: ${JSON.stringify(item)}`);
        }
        const variantIndex = item.variants.indexOf(item.variant);
        const pricePerUnit = variantIndex >= 0 ? (item.prices[variantIndex] || 0) : 0;
        if (typeof pricePerUnit !== 'number' || pricePerUnit <= 0) {
          throw new Error(`Invalid pricePerUnit for item: ${JSON.stringify(item)}`);
        }
        return {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(pricePerUnit * 100),
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&totalAmount=${totalAmount}&address=${encodeURIComponent(JSON.stringify(address))}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    console.log('Checkout session created:', session);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create session', message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    console.log('Creating order with data:', orderData); 

    if (!orderData.userId || !orderData.totalAmount || !orderData.paymentId || !orderData.items || !orderData.address) {
      console.error('Missing required fields:', orderData);
      return res.status(400).json({ message: 'Missing required fields', error: 'userId, totalAmount, paymentId, items, and address are required' });
    }

    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('Order saved:', savedOrder); 
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message || 'Unknown error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message || 'Unknown error' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});