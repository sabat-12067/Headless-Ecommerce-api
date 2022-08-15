const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();

// router.get('/validate-token', (req, res) => {
//  const authHeader = req.headers["authorization"];
//  const token = authHeader && authHeader.split(" ")[1];

//  if (token == null) return res.sendStatus(401).json({ msg: 'Invalid token' });

//  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//   if (err) return res.sendStatus(403);
//   req.tokenData = decoded;
//   res.status(StatusCodes.OK).json({ msg: 'Token verified' })
//  }); 
// });

router.post('/validate-token', (req, res) => {
 //const bearerHeader = req.headers.token;
 const bearerToken = req.body.token;

 if (typeof bearerToken !== 'undefined') {
  // const bearerToken = bearerHeader.split(' ')[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
   //if token is provided but invalid
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
)


module.exports = router;