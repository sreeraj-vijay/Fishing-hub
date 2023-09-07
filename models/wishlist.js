const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', 
  },
  productprice: {
    type: String,
    ref: 'product', 
  },
  productdescription: {
    type: String,
    ref: 'product', 
  },
  productimage: {
    type: String,
    ref: 'product', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('wishlist', wishlistSchema);
