const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
 userId : { 
  type: String,
  required: true
 },
 cartItemInfo: { type: [], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
