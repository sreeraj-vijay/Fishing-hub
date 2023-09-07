const mongoose=require("mongoose")
const brand = require('../models/brandmodels');
const productSchema=new mongoose.Schema({
   
    name: {
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
    price:{
      type:Number,
      required:true
    },
    offerpercentage:{
      type:String,
      required:false
    },
    off_price:{
      type:Number,
      required:false,

    },

    brand: {
      type: String,
      ref: 'brand', 
      required: true
   },
    image:[{
      type:String,
      required:false
    }],
    type:{
      type:String,
      required:true
    },
    weight:{
      type:String,
      required:true
    },
    is_listed:{
      type:Boolean,
      default:false
    },
    stock:{
      type:Number,
      default:false
    },
    
  });
  
  module.exports=mongoose.model('product',productSchema)
  