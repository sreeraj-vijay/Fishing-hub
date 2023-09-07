const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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
  quantity:{
    type:Number,
    require:true,
    default:1
    
  },
  productstock:{
    type:Number,
    ref:"product"
  }
});

module.exports = mongoose.model('cart', cartSchema);
