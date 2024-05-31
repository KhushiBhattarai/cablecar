const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  triptype: {
    type: String,
    required: true
  },
  numpeople: {
    type: Number,
    required: true
  },
  tripdate: {
    type:String,
    required: true
  },
  totalprice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
