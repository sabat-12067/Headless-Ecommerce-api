const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const router = require("./auth");

router.get('/validate-token', (req, res) => {
 const authHeader = req.headers["authorization"];
 const token = authHeader && authHeader.split(" ")[1];

 if (token == null) return res.sendStatus(401).json({ msg: 'Invalid token' });

 jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
  if (err) return res.sendStatus(403);
  req.tokenData = decoded;
  res.status(StatusCodes.OK).json({ msg: 'Token verified' })
 }); 
});


module.exports = router;