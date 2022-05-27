const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
 userId: {
  type: String,
  required: true
 },
 cartItemsList: { type: Array, default: [] },
 amount: { type: Number, required: true },
 address: { type: Object, required: true },
 status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
