const User = require('../models/user');
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
 try {
  const { name, email, password } = req.body
  
  //password must be atleast 6 characters long
  if(password.length < 6) {
   return res.status(400).json({ msg: 'Password must be atleast 6 characters long' })
  }

 //password must contain a letters, a number and a special character
  if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)) {
   return res.status(400).json({ msg: 'Password must contain letters with atleast one digit and a special character' })
  }

  //generate number of values in harshed password
  const salt = await bcrypt.genSalt(10)

  //hash the password
  const hashedPassword = await bcrypt.hash(password, salt)

  const customer = await User.create({ ...req.body, password: hashedPassword })
  
  // Generate web token
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });

  res.status(StatusCodes.CREATED).json({ user: { userId: customer._id, name: customer.name, email: customer.email, password: customer.password  }, token })
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
 const isPasswordCorrect = await bcrypt.compare(password, customer.password)

 //check if user's password exists
 if (!isPasswordCorrect) {
  return res.status(StatusCodes.UNAUTHORIZED).json({
   msg: "Password entered is incorrect. Please, provide a valid password!"
  })
 }

 //create token if email and password exist
 const token = jwt.sign({ userId: customer._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });

 //then send back name, email and token if user exists
 res.status(StatusCodes.OK).json({ user: { userId: customer._id, name: customer.name, email: customer.email }, token })

}

/*========================================================
                       Set Up update userInformation
===========================================================*/

const update = async (req, res, next) => {
 try {
  const { name, email, password } = req.body

  if (password.length < 6) {
   return res.status(400).json({ msg: 'Password must be atleast 6 characters long' })
  }

  //password must contain a letters, a number and a special character
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)) {
   return res.status(400).json({ msg: 'Password must contain letters with atleast one digit and a special character' })
  }

  //harsh the new password if user updates their old one
  if(password) {
   const salt = await bcrypt.genSalt(10)
   hashedPassword = await bcrypt.hash(password, salt)
  }
  
  const upDatedCustomer = await User.findByIdAndUpdate(req.params.id, { ...req.body, password: hashedPassword }, { new: true });

  res.status(StatusCodes.OK).json({ user: { name: upDatedCustomer.name, email: upDatedCustomer.email } })
 } catch (error) {
  next(error)
 }
}

module.exports = {
 signup,
 login,
 update
}


