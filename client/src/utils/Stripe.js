// FIYAZ AHMED
import { loadStripe } from '@stripe/stripe-js';
console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Stripe publishable key is not defined in .env');
}
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
export default stripePromise;