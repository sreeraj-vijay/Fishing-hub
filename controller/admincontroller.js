const admin=require('../models/adminmodel')
const user=require('../models/userModel')
const coupon=require('../models/coupon')
const randomstring=require("randomstring")
const product = require('../models/productmodel');
const brand = require('../models/brandmodels');
const order = require('../models/ordermodel');
const complaint=require('../models/complaints')
const bcrypt=require('bcrypt');
const moment=require("moment")
const easyinvoice = require("easyinvoice");
const fs=require('fs')
const { Readable } = require('stream');
const complaints = require('../models/complaints');
const securepassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash

    }catch(error){
        console.log(error.message)
    }
}
const loadRegister=async(req,res)=>{
    try{
        res.render('adminlogin')

    }catch(error){
        console.log(error.message)

    }

}
const verifylogin = async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const admindata = await admin.findOne({email:email})
        if(admindata){
            const passwordmatch= await bcrypt.compare(password,admindata.password)
            if(passwordmatch){
                if(admindata.is_admin===1){
                res.render('adminlogin',{message:"please verify your mail"})
                }else{
                    req.session.admin_id=admindata._id
                    
                    res.redirect('/adminhome')
                }


            }else{
                res.render('adminlogin',{message:"admin  ynot found"})

            }

        }else{
            res.render('adminlogin',{message:"admin xnot found"})
        }

    }catch(error){
        console.log(error.message)

    }
    
}
const loadhome= async(req,res)=>{
    const admindata = await admin.findById({_id:req.session.admin_id})
    try{
  
        res.render('adminhome',{ admin:admindata})

    }catch(error){
        console.log(error.message)
    }

}

const showuserlist= async(req,res)=>{
  
    try{
      const userdata = await user.find({});
      res.render('userlist',{users:userdata })
  
    }catch(error){
        console.log(error.message)
    }
  
  }
  const blockuser=async(req,res)=>{
    try{
      const id=req.query.id
      await user.updateOne({_id:id},{$set:{is_blocked:true}})
      res.redirect("/userlist")

    }
    catch (error){
      console.log(error.message)

    }
  }
  const unblockuser=async (req,res)=>{
    try{
    const id=req.query.id
    await user.updateOne({_id:id},{$set:{is_blocked:false}})
    res.redirect("/userlist")
    }catch(error){
      console.log(error.message)
    }
  }
  const loadaddbrand= async(req,res)=>{
   try{
        res.render('addbrand')

    }catch(error){
        console.log(error.message)
    }

  }
 const addbrand = async (req, res) => {
  try {
    const brandname= await brand.findOne({},"bname")
    if(brandname){
      res.render("addbrand",{message:"Brand already Exist"})

    }else{
    const addbrand = new brand({
      bname: req.body.bname,
      description: req.body.description,
    });

    const addnew = await addbrand.save();

    if (addnew) {
      console.log("brand added successfully");
      res.render("addbrand", { message: "brand added successfully" });
    } else {
      res.render("addbrand", { message: "Failed to add brand" });
    }
  }
  } catch (error) {
    console.log(error.message);
    res.render("addbrand", { message: "Error adding product" });
  }
};
const brandList = async (req,res)=>{
try{
      const branddata = await brand.find({});
      res.render('branddetails',{brands:branddata})
  }
  catch(error){
    console.log(error.message)

  }
}
const editbrand= async (req,res)=>{
  try{
    const id=req.query.id
    const branddata =await brand.findById({_id:id})
  if(branddata){
    res.render("editbrand",{brands:branddata})

  }else{
    res.redirect("/branddetails")

  }

}catch(error){
  console.log(error.message)
}
}
const updatebrand= async (req, res) => {
  try {
  const branddata = await brand.findByIdAndUpdate(req.body.id, { 
    bname: req.body.name,
    description: req.body.description,
    offer:req.body.offer,
    offerupto:req.body.expirationDate});
    res.redirect("/brandlist");
  
  } catch (error) {
    console.log(error.message);
  }
}
const listdbrand=async(req,res)=>{
  try{
    const id=req.query.id
    await brand.updateOne({_id:id},{$set:{is_listed:true}})
    res.redirect("/brandlist")

  }
  catch (error){
    console.log(error.message)

  }
}
const unlistdbrand=async (req,res)=>{
  try{
  const id=req.query.id
  await brand.updateOne({_id:id},{$set:{is_listed:false}})
  res.redirect("/brandlist")
  }catch(error){
    console.log(error.message)
  }
}
const adminlogout=async(req,res)=>{
  try{
    console.log("hello")
      req.session.destroy();
      res.redirect('/adminlogin')
      
  }catch(error){
      console.log(error.message)

  }
}
const logcoupon=async(req,res)=>{
  try{
    const code=generateCouponCode()
    function generateCouponCode(length = 8) {
      return randomstring.generate({
        length,
        charset: 'alphanumeric', // Customize the character set if needed
      });
    }
    res.render("coupon",{code})

  }catch(error){
    console.log(error.message)

  }
}
const addnewcoupon=async(req,res)=>{
  try{
    const newcoupon= new coupon({
      code:req.body.code,
      discount:req.body.discount,
      expirationDate:req.body.expirationDate,
      minimum:req.body.minimum,
      maximum:req.body.maximum

    })
    const addcoupon = await newcoupon.save();
    res.render("adminhome")
    
  }catch(error){
    console.log(error.message)
  }
}
const coupondetails=async(req,res)=>{
  try{
    const coupons=await coupon.find()
    
    res.render("coupondetails",{coupons:coupons})
  }catch(error){
    console.log(error.message)
  }
}
const deletecoupon= async(req,res)=>{
  try{
    const id=req.query.id
    const deletecoupon= await coupon.findByIdAndDelete({_id:id})
    res.redirect("coupondetails")

  }catch(error){
    console.log(error.message)
  }
}
const orderdetails=async(req,res)=>{
  try{
    const orderdata=await order.find()
    res.render("orderdetails",{order:orderdata})

  }catch(error){
    console.log(error.message)
  }
}
const editorder=async(req,res)=>{
  try{
    const id=req.query.id
    const editorder = await order.findById(id)
    console.log(editorder)
    res.render("updateorder",{order:editorder})

  }catch(error){
    console.log(error.message)
  }
}
const updateorder=async (req,res)=>{
  try{
    const id=req.body.id
    const newstatus=req.body.status
    const updatedOrder = await order.findByIdAndUpdate(id, { status: newstatus }, { new: true });
    res.redirect("/adminorderdetails")

  }catch(error){
    console.log(error.message)
  }
}
const applyoffer=async (req,res)=>{
  try{
    const brands=await brand.find({})
    res.render("offerapply",{brand:brands})
  }catch(error){
    console.log(error.message)
  }
}
const updateofferforbrand=async(req,res)=>{
  try{
    const brandname=req.body.bname
    const offer=req.body.offer
    const expir=req.body.expirationDate
    const productsToUpdate = await product.find({ brand: brandname });

    for (const productToUpdate of productsToUpdate) {
     
      const newPrice = (productToUpdate.off_price * offer) / 100;
    
      await product.updateOne(
        { _id: productToUpdate._id },
        {
          $set: {
            price: productToUpdate.off_price - newPrice,
            offerpercentage:offer
          }
        }
      );
    }
  
   res.render("adminhome")
      
  }catch(error){
    console.log(error.message)
  }
}
const monthlyreport=async(req,res)=>{
  try {
    const start = moment().subtract(30, 'days').startOf('day'); // Data for the last 30 days
    const end = moment().endOf('day');

    const orderSuccessDetails = await order.find({
      orderedAt: { $gte: start, $lte: end },
      status: 'Delivered' 
    });

    const monthlySales = {};

    orderSuccessDetails.forEach(order => {
      const monthName = moment(order.orderedAt).format('MMMM');
      if (!monthlySales[monthName]) {
        monthlySales[monthName] = {
          revenue: 0,
          productCount: 0,
          orderCount: 0,
          codCount: 0,
          razorpayCount: 0,
        };
      }
      monthlySales[monthName].revenue += order.total;
      monthlySales[monthName].productCount += order.products.length;
      monthlySales[monthName].orderCount++;

      if (order.paymentMethod=== 'COD') {
        monthlySales[monthName].codCount++;
      } else if (order.paymentMethod === 'razorpay') {
        monthlySales[monthName].razorpayCount++;
      } 
    });

    const monthlyData = {
      labels: [],
      revenueData: [],
      productCountData: [],
      orderCountData: [],
      codCountData: [],
      razorpayCountData: [],
    };

    for (const monthName in monthlySales) {
      if (monthlySales.hasOwnProperty(monthName)) {
        monthlyData.labels.push(monthName);
        monthlyData.revenueData.push(monthlySales[monthName].revenue);
        monthlyData.productCountData.push(monthlySales[monthName].productCount);
        monthlyData.orderCountData.push(monthlySales[monthName].orderCount);
        monthlyData.codCountData.push(monthlySales[monthName].codCount);
        monthlyData.razorpayCountData.push(monthlySales[monthName].razorpayCount);
      }
    }

    console.log(monthlyData);
    return res.json(monthlyData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while generating the monthly report.' });
  }
}
const salesreport=async(req,res)=>{
  try{
    res.render("salesreport")
  }catch(error){
    console.log(error.message)
  }
}
const reportpage=async(req,res)=>{
  try{
    const id =req.query.id
    if(id=="yearly"){
      const orderdetails=await order.find({status:"Delivered"})
    res.render("salesfullreportpage",{order:orderdetails})
    }
  }catch(error){
    console.log(error.message)
  }
}
const yearwisereport=async(req,res)=>{
  try{
    const selectedYear = req.body.year; // Change this to the desired year

    // Assuming you're using a library like mongoose for MongoDB
    const salesdetails = await order.find({
      orderedAt: {
        $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
        $lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
      },
      status:"Delivered"
    })
    res.json(salesdetails)
  }catch(error){
    console.log(error.message)
  }
}
const reportspecificrange=async(req,res)=>{
  try{

    res.render("reportwithinrandge")

  }catch(error){

    console.log(error.message)
  }
}
const weeklyordaily = async (req, res) => {
  try {
    const startDateString = req.body.date.start;
    const endDateString = req.body.date.end;

    // Ensure that the date strings are in a format MongoDB can parse (ISO 8601)
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    
    const salesdetails = await order.find({
      orderedAt: {
        $gte: start,
        $lte: end,
      },
      status: "Delivered",
    });

    console.log(salesdetails);
    res.json(salesdetails);
  } catch (error) {
    console.log(error.message);
  }
};
const reviews=async(req,res)=>{
  try{
    const complintdata=await complaint.find({})
    res.render("review",{complaint:complintdata})

  }catch(error){
    console.log(error.message)

  }
}



module.exports={
    verifylogin,
    loadRegister,
    loadhome,
    showuserlist,
    blockuser,
    brandList,
    unblockuser,
    loadaddbrand,
    addbrand,
    editbrand,
    updatebrand,
    unlistdbrand,
    listdbrand,
    adminlogout,
    logcoupon,
    addnewcoupon,
    coupondetails,
    deletecoupon,
    orderdetails,
    editorder,
    updateorder,
    applyoffer,
    updateofferforbrand,
    monthlyreport,
    salesreport,
    reportpage,
    yearwisereport,
    reportspecificrange,
    weeklyordaily,
    reviews,

}