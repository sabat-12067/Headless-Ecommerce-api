const express = require('express')
const router = express.Router()
const verifyToken = require('./verifyToken')

const { login, signup, update } = require('../controllers/auth');

router.post('/signup', signup)
router.post('/login', login)
router.put('/update/:id', verifyToken, update)

module.exports = router
