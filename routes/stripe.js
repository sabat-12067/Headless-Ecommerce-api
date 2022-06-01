const router = require('express').Router();

const collectStripePayment = require('../controllers/stripe');

router.post('/payment', collectStripePayment);

module.exports = router;