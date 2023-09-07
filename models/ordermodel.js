// order.js

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: true,
  },
  quantity: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  userAddress: {
    type: Object,
    required: false,
  },
  products: [productSchema], // Use the imported Product model schema here
  total: {
    type: Number,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  subtotal: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Cancelled','Returned'],
    default: 'Pending',
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
});

const order = mongoose.model('order', orderSchema);

module.exports = order;