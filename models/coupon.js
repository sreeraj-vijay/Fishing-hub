const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true },
  discount: { 
    type: Number, 
    required: true },
  expirationDate: { 
    type: Date, 
    required: true },
  minimum:{
    type: Number, 
    required: true },
  maximum:{
      type: Number, 
      required: true },
  used:{
      type:[String],
      required:false,
     }
});

module.exports=mongoose.model('coupon',couponSchema)

