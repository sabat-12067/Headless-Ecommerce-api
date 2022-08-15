const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();

router.post('/validate-token', (req, res) => {
 const bearerToken = req.body.token;

 if (typeof bearerToken !== 'undefined') {
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err) => {
   if (err) {
    res.status(StatusCodes.FORBIDDEN).json({
     message: 'Invalid token!'
    })
   }
   res.status(200).json({ msg: 'Token verified' })
  });
 } else {
  //if no token is provided
  res.status(StatusCodes.UNAUTHORIZED).json({
   message: 'You are unauthorized! You have no access to this resource!'
  });
 }
}
);

module.exports = router;