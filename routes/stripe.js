const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

router.post('/payment-intent', async (req, res) => {
  const { info } = req.body;
  const { idAndQuantity, email, shippingMethod  } = info;
  const response = await axios.get(
    'https://asmn-shopping-cart.herokuapp.com/api/shopping-carts?populate=*'
  );
 
  const products = response.data.data;
  console.log(products.map(product => product.attributes.name));
  let subTotal = 0;
  let totalAmount = 0;
  if (idAndQuantity.length > 1) {
    products.filter(product => {
      idAndQuantity.map(idAndQuantityItem => {
        if (product.id.toString() === idAndQuantityItem.id) {
          const price = product.attributes.price;
          const quantity = idAndQuantityItem.quantity;
          //total price of each product
          totalPrice = price * quantity;
          //total price of all products
          subTotal += totalPrice;
          // tax of products
          const tax = subTotal * 0.03;
         // total amount of products with tax
          const totalAmountWithTax = subTotal + tax;

         //add  shipping fee to the total amount
          let deliveryFee = 0;
          if (shippingMethod === 'Standard') {
            deliveryFee = 'FREE';
            totalAmount = totalAmountWithTax;
          } else if (shippingMethod === 'Express') {
            deliveryFee = 15;
            totalAmount = totalAmountWithTax + deliveryFee;
          } else {
            deliveryFee = 25;
            totalAmount = totalAmountWithTax + deliveryFee;
          }
         // console.log( 'totalAmount', totalAmount);
        }
      });
    })
  } else {
    products.filter(product => {
      if (product.id.toString() === idAndQuantity[0].id) {
        console.log(product.attributes.name);
      }
    })
  }

  try {
   const paymentIntent = await stripe.paymentIntents.create({
     amount: totalAmount * 100,
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
 //  console.log(orderNumber);
  } catch (error) {
   res.status(500).json({ error });
  }
});

module.exports = router;