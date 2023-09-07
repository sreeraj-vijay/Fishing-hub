
const mongoose = require('mongoose');
const user=require('../models/userModel')
const product = require('../models/productmodel');
const wishlist = require('../models/wishlist');
const brand=require('../models/brandmodels');
const coupon=require('../models/coupon')
const cart = require('../models/cart');
const order=require('../models/ordermodel')

const paymentsuccess=async(req,res)=>{
    try{
        const userid=req.session.user_id
        const orderderails = new order({
            name: req.body.name,
            useraddress: req.body.address,
            'products.product': 4 ,
            'products.quantity': 4,
            'products.price':50,
            total:4,
            paymentmethod:4,
            orderedAt:444,
          });
        res.render("ordersuccess")
    }catch(error){
        console.log(error.message)

    }
}
module.exports={
    paymentsuccess
}