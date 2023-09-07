const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  brand: { 
    type: String, 
    ref: 'brand',
    required: true },
  Offer: { 
    type: String, 
    required: true },
    
});

module.exports=mongoose.model('offer',couponSchema)
