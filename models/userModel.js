const mongoose= require("mongoose")
const addressSchema = new mongoose.Schema({
  house_address:{
    type:String,
    required:true
  },
  locality:{
    type:String,
    required:true
  },
  place:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },

  country:{
    type:String,
    required:true
  },
  pincode:{
    type:String,
    required:true
  },
  newmobile:{
    type:String,
    required:true
  },
  order_name:{
    type:String,
    required:true
  },
})
const userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },

    password:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false,
        reuired:true
    },
    referenceCode :{
      type:String,
      
     
  },
    address:[addressSchema]
  })


module.exports=mongoose.model('user',userSchema)