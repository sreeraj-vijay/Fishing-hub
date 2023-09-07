const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    balance : {
        type : Number,
        required : true,
        default:0
    },
    reffcode:{
        type:String,
        required:false,
    },
    history : [{
        from : {
            type : String,
            required : true
        },
        price : {
            type : String,
            required : true
        },
        Date: {
            type: Date,
            required:true
          },
    }]
})

module.exports = mongoose.model('wallet',walletSchema)