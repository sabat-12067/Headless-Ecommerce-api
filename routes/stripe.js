const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const calculateOrderAmount = async (info) => {
 // console.log(info);
  const { idAndQuantity, deliveryMethod, isAddToCartBtnClicked } = info;
  const response = await axios.get(
    'https://asmn-shopping-cart.herokuapp.com/api/shopping-carts?populate=*'
  );
  const products = await response.data.data;
  // console.log(products.map(product => product.attributes.name));
  let subTotal = 0;
  let totalAmount = 0;
  if (isAddToCartBtnClicked) {
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
          if (deliveryMethod === 'Standard') {
            deliveryFee = 'FREE';
            totalAmount = totalAmountWithTax;
          } else if (deliveryMethod === 'Express') {
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
        const price = product.attributes.price;
        const quantity = idAndQuantity[0].quantity;
        //total price of product
        totalPrice = price * quantity;
        // tax of product
        const tax = totalPrice * 0.03;
        // total amount of products with tax
        const totalAmountWithTax = totalPrice + tax;
        //add  shipping fee to the total amount
        let deliveryFee = 0;
        if (deliveryMethod === 'Standard') {
          deliveryFee = 'FREE';
          totalAmount = totalAmountWithTax;
        } else if (deliveryMethod === 'Express') {
          deliveryFee = 15;
          totalAmount = totalAmountWithTax + deliveryFee;
        } else {
          deliveryFee = 25;
          totalAmount = totalAmountWithTax + deliveryFee;
        }
      }
    })
  }
  return totalAmount;
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

router.post('/payment-intent', async (req, res) => {
  console.log('payment intent called');
  const info = req.body;
  const { email } = info;
  let totalAmount = await calculateOrderAmount(info);
  totalAmount = roundToTwo(totalAmount);
  //Math.round((totalAmount * 100) / 100).toFixed(2);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      //.toFixed(2).replace(/(\.0+|0+)$/, '') removes excess trailing zeros like 2.00000 to 2.00
      amount: (totalAmount * 100).toFixed(2).replace(/(\.0+|0+)$/, ''),
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: email,
      description: 'Thanks for supporting Asuman Sounds',
    });
    const orderNumber = Math.floor(Math.random() * 1000000);
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderNumber,
    });
  //  console.log(orderNumber);
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

module.exports = router;