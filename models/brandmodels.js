const mongoose=require("mongoose")
const brandSchema=new mongoose.Schema({
    bname:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true

    },
    offer:{
        type:String,
        default:0

    },
    offerupto:{
        type: Date,
        default: Date.now,
    },
    description:{
        type:String,
        default:0,

    },
    is_listed:{
        type:Boolean,
        default:false
        

    },
    
})
module.exports=mongoose.model('brand',brandSchema)
   