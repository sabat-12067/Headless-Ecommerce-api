const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (error, req, res, next) => {

 let customError = {
  // set default if nothing is provided
  statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: error.message || 'Something Went Wrong Try Again Later'
 }

// console.log('error handler middleware invoked');
 //console.log(customError.msg);
 //console.log(error.name); 
 //console.log(error.errors)


 // Handle errors for models
 if (error.name === 'ValidationError') {
  customError.msg = Object.values(error.errors)
   .map(item => item.message)
   
  customError.statusCode = 400
 }

 //handle duplicate accounts
 if (customError.msg.includes('email_1 dup key')) {
  customError.msg = 'Account already exists'
  customError.statusCode = 400
 }

 //Generic error handler  
 return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
