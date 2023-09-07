const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
      },
   
      image: {
        type: Array,
        required: true,
      },
      link:{
        type:String,
        required: true,
      },
      description:{
        type:String,
        required:true
      }
      
    
})

module.exports = mongoose.model('banner',bannerSchema)