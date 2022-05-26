const User = require('../models/user');
const { StatusCodes } = require('http-status-codes')

const signup = async (req, res, next) => {
 try {
  const { name, email, password } = req.body
  //console.log(name, email, password);

  const customer = await User.create({ ...req.body })
  const token = customer.createJWT()

  res.status(StatusCodes.CREATED).json({ user: { name: customer.name, email: customer.email }, token })
 } catch (error) {
  next(error)
 }
}

/*========================================================
                       Set Up Login
===========================================================*/
const login = async (req, res) => {

 const { email, password } = req.body

 //check for empty values 
 if (!email || !password) {
  return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide Email and Password' })
 }

 //Grab user's email
 const customer = await User.findOne({ email })

 //check if email exists
 if (!customer) {
  return res.status(StatusCodes.UNAUTHORIZED).json({
   msg: "Email doesn't exist! Please, provide a valid email"
  })
 }

 //Matching user's password with the hashed password (in User Modal)
 const isPasswordCorrect = await customer.comparePassword(password)

 //check if user's password exists
 if (!isPasswordCorrect) {
  return res.status(StatusCodes.UNAUTHORIZED).json({
   msg: "Password entered is incorrect. Please, provide a valid password!"
  })
 }
 //create token if email and password exist
 const token = customer.createJWT();

 //then send back username and token if user exists
 res.status(StatusCodes.OK).json({ user: { name: customer.name, email: customer.email }, token })

}

module.exports = {
 signup,
 login
}