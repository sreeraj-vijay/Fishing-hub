const mongoose = require('mongoose');

const referanceSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true },
 used:{
      type:[String],
      required:false,
     }
});

module.exports=mongoose.model('referance',referanceSchema)
