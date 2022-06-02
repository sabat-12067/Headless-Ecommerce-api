const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/payment-intent', async (req, res) => {
  const { cartItem } = req.body;
  const { price, email } = cartItem;

  try {
   const paymentIntent = await stripe.paymentIntents.create({
     amount: price * 100,
     currency: 'usd',
     payment_method_types: ['card'],
     receipt_email: email,
     description: 'Asuman Sounds Store',
   });
   const orderNumber = Math.floor(Math.random() * 1000000);
   res.status(200).json({
     clientSecret: paymentIntent.client_secret,
     orderNumber,
   });   
   console.log(orderNumber);
  } catch (error) {
   res.status(500).json({ error });
  }
});

module.exports = router;