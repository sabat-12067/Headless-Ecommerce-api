const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
  type: String,
  required: [true, 'Please Provide Your Name'],
  minlength: [3, 'Name Must be at least 3 characters long'],
  maxlength: [ 50, 'Name Must be at most 50 characters long'],
 },
 email: {
  type: String,
  required: [true, 'Please Provide Email'],
  match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/, 'Please Provide A Valid Email'],
  unique: [true, 'The email already exists. Please provide another email']
 },
 password: {
  type: String,
  required: [true, 'Please Provide Password'],
  minlength: [6, 'Password Must be atleast 6 characters long'],
  match: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/, 'Password Must contain letters with atleast one digit and a special character']
 }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)