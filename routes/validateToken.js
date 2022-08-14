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

router.get('/validate-token', (req, res) => 
{
 const bearerHeader = req.headers.token;

 if (typeof bearerHeader !== 'undefined') {
  const bearerToken = bearerHeader.split(' ')[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
   //if token is provided but invalid
   if (err) {
    res.status(StatusCodes.FORBIDDEN).json({
     message: 'Invalid token!'
    })
   }
   req.authData = authData;
   // next();
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