const express = require('express')
const router = express.Router()
const verifyToken = require('../routes/verifyToken')
const { addItemToCart, deleteItemFromCart, getAllCartItems } = require('../controllers/cart')

router.post('/', verifyToken, addItemToCart)
router.delete('/:id', verifyToken, deleteItemFromCart)
router.get('/:id', verifyToken, getAllCartItems)
//router.post('/login', login)

module.exports = router