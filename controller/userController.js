const user= require('../models/userModel')
const mongoose = require('mongoose');
require('dotenv').config();
const product = require('../models/productmodel');
const wishlist = require('../models/wishlist');
const brand=require('../models/brandmodels');
const complaint=require('../models/complaints')
const coupon=require('../models/coupon')
const cart = require('../models/cart');
const wallet= require("../models/walletmodel")
const banner=require("../models/banner")
const bcrypt=require('bcrypt');
const order=require('../models/ordermodel')
const bodyParser = require('body-parser')
const Razorpay=require("razorpay")
// const { userInfo } = require('os');
const otpGenerator = require('otp-generator');
const easyinvoice = require("easyinvoice");
const fs=require('fs')
const { Readable } = require('stream');
const { ConversationContextImpl } = require('twilio/lib/rest/conversations/v1/conversation');
// Your AccountSID and Auth Token from console.twilio.com

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = require("twilio")(accountSid, authToken);

// const { search } = require('../routes/userRoute');
var instance = new Razorpay({ key_id: 'rzp_test_N5uAMuy4cH3gb4', 
key_secret: 'I1RjqFWHvGvypFDY7lCy2DVd' })


const securepassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash

    }catch(error){
        console.log(error.message)
    }
}
const guestloadhome=async(req,res)=>{
  const bannerdata = await banner.find()
  const productdata = await product.find()
  res.render('home',{ products:productdata,banner:bannerdata})
}
const loadRegister=async(req,res)=>{
    try{
        res.render('login')

    }catch(error){
        console.log(error.message)

    }

}
const insertuser = async (req, res) => {
  try {
    const email = req.body.email;
    const mobileNumber = req.body.mobile;

    const existingUser = await user.findOne({ email: email });

    if (existingUser) {
      return res.render("login", { message: "Email already exists" });
    }
  
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91${mobileNumber}`, channel: "sms" })
      .then((verification) => {
        console.log(verification.status);
        req.session.userData = req.body;
      

        res.render("otp", { mobileNumber });
      });
  } catch (error) {
    console.error(error.message);
    res.render("login", { message: "An error occurred" });
  }
};

const createUser = async (req, res) => {
  try {
    const mobileNumber = req.session.userData.mobile;
    const newotp = req.body.otp;
    console.log(req.body)

    // Verify OTP
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: `+91${mobileNumber}`, code: newotp })
      .then(async (verification_check) => {
        if (verification_check.status === 'approved') {
          console.log(verification_check.status);

          const spassword = await securepassword(req.session.userData.password);
          const newUser = new user({
            fname: req.session.userData.fname,
            lname: req.session.userData.email, // This seems incorrect. You probably want 'lname' to be the last name, not the email.
            mobile: req.session.userData.mobile,
            email: req.session.userData.email,
            password: spassword,
          });

          const userdata = await newUser.save();
          const userfields = await user.find({ mobile: userdata.mobile });
          console.log(userfields);

          const newwallet = new wallet({
            user_id: userfields[0]._id,
            balance: 200,
            reffcode: userfields[0].lname + userfields[0].fname,
            history: [
              {
                from: "Reference",
                price: 200,
                Date: new Date(),
              },
            ],
          });

          const walletdata = await newwallet.save();

          if (userdata) {
            res.render("login", { message: "Your registration has been successful. Please verify." });
          } else {
            res.render("login", { message: "Registration failed" });
          }
        } else {
          // Handle case where OTP verification fails
          res.render("login", { message: "OTP verification failed" });
        }
      });
  } catch (error) {
    console.error(error.message);
    res.render("login", { message: "An error occurred" });
  }
};
        
const loginload=async(req,res)=>{
    try{
        res.render('login')

    }catch(error){
        console.log(error.message)
    }
}
// verify user login
const verifylogin = async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const userdata = await user.findOne({email:email})
        if(userdata){
            const passwordmatch= await bcrypt.compare(password,userdata.password)
            if(passwordmatch){
                if(userdata.is_blocked){
                res.render('login',{message:"blocked user"})
                }else{
                    req.session.user_id=userdata._id
                    res.redirect('/home')
                }


            }else{
                res.render('login',{message:"user not found"})

            }

        }else{
            res.render('login',{message:"user not found"})
        }

    }catch(error){
        console.log(error.message)

    }
    
}

 const loadhome= async(req,res)=>{
   
    try{
      const bannerdata=await banner.find({})
      const productdata = await product.find()
        res.render('home',{products:productdata,banner:bannerdata})

    }catch(error){
        console.log(error.message)
    }

}
const userlogout=async(req,res)=>{
  try{
      req.session.destroy();
      res.redirect('/login')
      
  }catch(error){
      console.log(error.message)

  }
}
const forgotpassword=(req,res)=>{
  res.render("forgotpassword")
}

const forgotpasswordotp = async (req, res) => {
  try {
    const mobileNumber = req.body.mobile;
    const password=await securepassword(req.body.newpassword)
    const existing = await user.findOne({ mobile: mobileNumber });

    req.session.newpassword = password
    req.session.mobile= mobileNumber
    console.log(client)
  client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91${mobileNumber}`, channel: "sms" })
      .then((verification) => {
        console.log(verification.status);
    
        res.render("forgotpasswordotp");
         })
  }
  catch (error) {
    console.log(error.message);
  }
}

const forgotpasswordotpverify = async (req, res) => {
  try {
    const password = req.session.newpassword;
    const mobileNumber = req.session.mobile;
    console.log(mobileNumber);
    const newotp = req.body.otp;
    client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: `+91${mobileNumber}`, code: newotp })
    .then(async (verification_check) => {
        if (verification_check.status === 'approved') {
          console.log(verification_check.status);

          const existing = await user.findOne({ mobile: mobileNumber });

          if (existing) {
            // Update the password in the existing user document.
            await user.updateOne({ mobile: mobileNumber }, { $set: { password: password } });
            res.render("login",{message: "Password  has been updated successfully. Please verify."});
          } else {
            // Handle the case where the user doesn't exist.
            // You might want to show an error message or redirect to a different page.
            res.status(404).send("User not found");
          }
        }
      });
  } catch (error) {
    console.error(error.message);
    // Handle errors gracefully and send an appropriate response.
    res.status(500).send("Internal Server Error");
  }
}

const loggallery=async(req,res)=>{
  try{
    
  const id=req.query.id
  const branddetails=await brand.find({})
  const productdata=await product.findById({_id:id})
  res.render("shop",{products:productdata,brand:branddetails})
}catch(error){
  console.log(error.message)
}
}
const loadmainshop = async (req, res) => {
  try {
    const brandname = req.query.bname;
    const searchQuery = req.query.q; // Get the search query parameter
    const sortBy = req.query.sortBy; // Get the sort by parameter

    const brands = await brand.find();
    const newproductdata = await product.find({});

    // Filter by brandname if provided
    let productdata = newproductdata;
    if (brandname && brandname !== '') {
      productdata = productdata.filter(product => product.brand === brandname);
    }

    // Filter by search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      // Here, you can define your own search logic based on your data model
      productdata = productdata.filter(product => {
        const nameMatches = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatches = product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatches || descriptionMatches;
      });
    }

    // Sort products based on the selected sorting option
    if (sortBy === 'price_asc') {
      productdata.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      productdata.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'brand_asc') {
      productdata.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sortBy === 'brand_desc') {
      productdata.sort((a, b) => b.brand.localeCompare(a.brand));
    }

    const itemsperpage = 4;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(productdata.length / 6);
    const currentproduct = productdata.slice(startindex, endindex);

    res.render("shopmain", {
      products: currentproduct,
      brands,
      currentpage,
      totalpages,
      selectedBrand: brandname,
      sortBy,
      searchQuery
    });
  } catch (error) {
    console.log(error.message);
  }

};

const resendotp= async(req,res)=>{
   const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
      //  await client.messages.create({
      //     body: `Your OTP for Smart Wrist Sign Up is: ${otp}`,
      //     from: "19033548588",
      //     to: `+91${user.mobile}`,
      //   });

      console.log(`Otp is ${otp}`);

      req.session.otp = otp;

    }
  const loadwishlist=async(req,res)=>{
    try{
      const id=req.session.user_id
      const wishlistdata=await wishlist.find({userid:id})
      res.render("wishlist",{wishlist:wishlistdata})

    }catch(error){
      console.log(error.message)
    }
  }
const addtowishlist=async(req,res)=>{
  try{
const id=req.query.id
const productdata=await product.findById(id)
const newwishlist = await wishlist({
  userid: req.session.user_id,
  productId:productdata._id,
  productprice:productdata.price,
  productdescription:productdata.description,
  productimage:productdata.image[0]

});
const wishlistdata = await newwishlist.save();
    
      if (wishlistdata) {
        res.redirect("/wishlist")
      } else {
        res.redirect("/wishlist",{wishlist}, { message: " failed" });
      }
    } catch (error) {
       console.error(error.message);
       res.redirect("/wishlist", { message: "An error occurred" });
}
}
const deletewishlist=async(req,res)=>{
  try{
    const id=req.query.id
    const wishlistdata=await wishlist.deleteOne({_id:id})
    res.redirect("/wishlist")
  }catch(error){
    console.log(error.message)

  }
}
const loadcart=async(req,res)=>{
  try{
    const id=req.session.user_id
    const cartdata=await cart.find({userid:id})
    res.render("cart",{cart:cartdata})

  }catch(error){
    console.log(error.message)
  }
}
const addtocart=async(req,res)=>{
  try{
const id=req.query.id
const wishlistid=req.query.wishlistid
const productdata=await product.findById({_id:id})
const newcart = await cart({
  userid: req.session.user_id,
  productId:productdata._id,
  productprice:productdata.price,
  productdescription:productdata.description,
  productimage:productdata.image[0],
  quantity:req.body.quantity,
  productstock:productdata.stock
 

});
const cartdata = await newcart.save();
if(wishlistid){
const deletewishlist= await wishlist.findByIdAndDelete({_id:wishlistid})
}
if (cartdata) {
        res.redirect("/cart")
      } else {
        res.redirect("/cart",{cart}, { message: " failed" });
      }
  
  } catch (error) {
       console.error(error.message);
       res.redirect("/cart", { message: "An error occurred" });
}
}

const loadcheckout=async(req,res)=>{
  try{
    
    const subtotal=req.query.subtotal
    const id=req.session.user_id
    const cartdata = await cart.find({ userid: id})
    const filteredCartData = cartdata.filter(item => item.productstock > 0);
    for (const cartItem of filteredCartData) {
      const newproduct = await product.findById(cartItem.productId);
  
      if (!newproduct) {
          console.log(`Product with ID ${cartItem.productId} not found.`);
          continue; // Move to the next cart item
      }
  
      const updatedStock = newproduct.stock - cartItem.quantity;
      if (updatedStock < 0) {
          console.log(`Insufficient stock for product with ID ${cartItem.productId}.`);
          continue; // Move to the next cart item
      }
  
      newproduct.stock = updatedStock;
      await newproduct.save();
  }
  

    const userdata=await user.findOne({_id:id})
    res.render("checkout",{users:userdata,cart:filteredCartData,subtotal:subtotal})
  }catch(error){
    console.log(error.message)
  }
}
const checkoutsubmit=async(req,res)=>{
  try{
  const id=req.session.user_id
  const updateuser= await user.findByIdAndUpdate(id, { 
    fname: req.body.fname,
    lname: req.body.lname,
    'address.house_address': req.body.house_address,
    'address.locality': req.body.locality,
    'address.place': req.body.place,
    'address.state': req.body.state,
    'address.country': req.body.country,
    'address.pincode': req.body.pincode,
    'address.newmobile': req.body.newmobile,
    'address.order_name': req.body.ordername,});
    res.redirect("/checkout")
  }
  catch(error){
    console.log(error.message)
  }
}
const deletecart=async(req,res)=>{
  try{
    id =req.query.id
    
    const deletecart=await cart.deleteOne({_id:id})
    res.redirect("/cart")
    
  }catch(error){
    console.log(error)

  }
}
const viewprofile=async(req,res)=>{
  try{
   
    const id=req.session.user_id
    
    const userData=await user.findById({_id:id})
    res.render("profile",{user:userData})

  }catch(error){
    console.log(error.message)
  }
}


const editaddress = async (req, res) => {
  try {
    const addressid = req.query.addid;
    const userId = req.session.user_id;

    const userData = await user.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $unwind: '$address'
      },
      {
        $match: { 'address._id': new mongoose.Types.ObjectId(addressid) }
      }
    ]);
  

    if (!userData || userData.length === 0) {
      return res.status(404).send('User or address not found.');
    }

    const addressData = userData[0].address;



    res.render("editaddress", { address: addressData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};



const updateaddress = async (req, res) => {
  try {
    const id = req.body.id;
    const userId = req.session.user_id;

    const addressData = await user.findOneAndUpdate(
      { _id: userId, 'address._id': id },
      {
        $set: {
          'address.$.house_address': req.body.house_address,
          'address.$.order_name': req.body.order_name,
          'address.$.newmobile': req.body.newmobile,
          'address.$.pincode': req.body.pincode,
          'address.$.state': req.body.state,
          'address.$.country': req.body.country,
          'address.$.place': req.body.place,
          'address.$.locality': req.body.locality,
          // Update other address fields as needed
        }
      },
      { new: true } // This option returns the updated document
    );
   

    res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
  }
};

const editprofilelogin=async(req,res)=>{
  try{
    const id=req.session.user_id
    const userdata=await user.findById({_id:id})
    res.render("editprofile",{user:userdata})

  }catch(error){
    console.log(error.message)

  }
}
const editprofile=async(req,res)=>{
  try{
   
  const id=req.session.user_id
  console.log(id)
  
  const updateuser= await user.findByIdAndUpdate(id, { 
    fname: req.body.fname,
    lname: req.body.lname,
    mobile:req.body.mobile,
    email:req.body.email
});
    res.redirect("/profile")
  }
  catch(error){
    console.log(error.message)
  }
}
const addnewaddress=async(req,res)=>{
  try{
    const id=req.session.user_id
    const userdata=await user.findById({_id:id})
    res.render("addnewaddress",{user:userdata})
  }catch(error){
    console.log(error.message)
  }
}
const newaddress = async (req, res) => {
  try {
    const id =req.session.user_id
    const newAddress = {
      house_address: req.body.house_address,
      locality: req.body.locality,
      place: req.body.place,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
      newmobile: req.body.newmobile,
      order_name: req.body.name,
    };

    const result = await user.updateOne(
      { _id: id },
      { $push: { address: newAddress } }
    );
    res.redirect('/profile')
  }
  catch(error){
    console.log(error.message)
  }
}
const checkcoupon = async (req, res) => {
  try {
    const addcode = req.body.code;
    const subtotal = req.body.Subtotal;
    const currentDate = new Date(); // Get the current date
    const userid=req.session.user_id

    const coupondata = await coupon.findOne({ code: addcode });

    if (coupondata) {
      // Check if the coupon is expired
        if (coupondata.used.includes(userid)) {
          res.json({ valid: false, message: ' Already used.' });
        }else {
          coupondata.used.push(userid);
          coupondata.save()
      
        
      if (coupondata.expirationDate && currentDate > coupondata.expirationDate) {
        res.json({ valid: false, message: 'Coupon code has expired.' });
        return;
      }

      let discount = Math.floor((coupondata.discount / 100) * subtotal);
      if (discount >= coupondata.maximum) {
        discount = 1000;
      }
      let actualtotal = subtotal - discount;

      if (coupondata.minimum <= subtotal) {
        if (discount >= coupondata.maximum) {
          actualtotal = subtotal - 1000;
        }

        res.json({ valid: true, message: 'Coupon code is valid!', actualtotal: actualtotal, subtotal });
      } else {
        res.json({ valid: false, message: 'You must purchase above the minimum amount.', actualtotal: actualtotal });
      }
    }
    } else {
      res.json({ valid: false, message: 'Invalid coupon code.' });
  }
  
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'An error occurred while checking the coupon.' });
  }
};


  const updatequantity=async(req,res)=>{
    const productUpdates = req.body;
   

    try {
        for (const update of productUpdates) {
            const { productId, quantity } = update;

            // Update the quantity for each cart item
            await cart.findOneAndUpdate(
                {_id: productId  },
                { quantity },
                { upsert: true } 
            );
        }

        res.status(200).json({ message: 'Quantities updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};


const paymentsuccess = async (req, res) => {
  try {
    
    const addressid = req.body.selectedAddress;
    const paymentoption = req.body.option
    const id = req.session.user_id;
    console.log(req.body)

    const newcart = await cart.find({ userid: id });
    const userdata = await user.findById(id);
    const newaddress = await user.findOne(
      { "_id": id },
      { "_id": 0, "address": { $elemMatch: { "_id": addressid } } }
    );

    const productsForOrder = newcart.map((cartItem) => ({
      productid:cartItem.productId,
      product: cartItem._id,
      quantity: cartItem.quantity,
      price: cartItem.productprice,
      description:cartItem.productdescription


    }));
    

    const orderDetails = new order({
      user: userdata._id,
      userAddress: newaddress,
      products: productsForOrder,
      total: req.body.subtotal,
      paymentMethod: paymentoption,
      subtotal: req.body.subtotal,
    });

    const orderData = await orderDetails.save();
    
    if (paymentoption === "razorpay") {
      const createRazorpayOrder = async (cartItems, order) => {
        const razorpayOrder = await instance.orders.create({
          amount: orderData.subtotal * 100,
          currency: "INR",
          receipt: orderData._id.toString()
        });
        return razorpayOrder;
      };

      const razorpayOrder = await createRazorpayOrder(orderData);
   
      const deletecart=await cart.deleteOne({ userid: id})

      res.json({ orderData, razorpayOrder });
    } else if (paymentoption === "COD" ||paymentoption === "Wallet") {
      const orderid=orderData._id
      // Clear cart after successful order placement
      const deletecart=await cart.deleteOne({ userid: id})

      // Render confirmation page with order details
     res.json({neworder:orderid})
    } else {
      res.status(400).json({ error: "Invalid payment method" });
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/checkout");
  }
};
const verifypayment=async(req,res)=>{
  try{
    const data=req.body

    const crypto=require('crypto')
    const hmac= crypto.createHmac('sha256','I1RjqFWHvGvypFDY7lCy2DVd')
    hmac.update(data.order.razorpay_payment_id+ "|" + data.razorpay_order_id)
    const hashedHmac = hmac.digest('hex');
        
        if (hashedHmac === data.order.razorpay_signature) {
          
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: 'Payment verification failed' });
        }
    } catch (error) {
        console.log(error.message);
    }
}
const successpage = async (req, res) => {
  try {
    const paymentDetailsParam = JSON.parse(decodeURIComponent(req.query.payment));
   
    const orderid = paymentDetailsParam.receipt;
    
    const orderData = await order.findById(orderid );
    console.log(orderData)
   

    if (orderData) {
      res.render("ordersuccess", { order: orderData }); // Pass the orderData to the template
    } else {
      res.status(400).send('Order data not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('An error occurred');
  }
};
const orderdetails = async (req, res) => {
  try {
    const orderId = req.query.id;

    const orderdata = await order.findById(orderId); // Assuming Order is your Mongoose model for orders
  

    res.render("orderdetails", { order: orderdata});
  } catch (error) {
    console.log(error.message);
  }
};
const yourorders =async(req,res)=>{
  try{
    id=req.session.user_id
    const orderdata=await order.find({user:id})
    console.log(orderdata)
    res.render("yourorder",{order:orderdata})

  }catch(error){
    console.log(error.message)
  }
}
const Cancelorder = async (req,res)=>{
  try{
    const walletid =req.session.user_id
   
    const id=req.query.id
    const orderdata=await order.findById(id)
    if(orderdata.status==="Delivered" ){
    const updateorder = await order.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Returned" } },
      { new: true } 
    );}else{
      const updateorder = await order.findOneAndUpdate(
        { _id: id },
        { $set: { status: "Cancelled" } },
        { new: true } 
      );

    }
    if(orderdata.paymentMethod=="razorpay" || orderdata.paymentMethod=="Wallet" ){
    const walletdata = await wallet.findOneAndUpdate(
      { user_id: walletid },
      {
        $inc: { balance: orderdata.total },
        $push: {
          history: {
            from:  orderdata.status,
            price:  orderdata.total,
            Date: new Date(),
          }
        }
      },
      { new: true }
    );
  }
  
    res.redirect("/yourorders")

  }catch(error){
    console.log(error.message)
  }
}
const forcod=async(req,res)=>{
  try{
    const details=JSON.parse(decodeURIComponent(req.query.id));
    const orderdata =await order.findById(details)
    console.log(orderdata)
    if(orderdata.paymentMethod=="Wallet"){
      const userid=req.session.user_id
      const updatedWallet = await wallet.findOneAndUpdate(
        { user_id: userid },
        {
          $inc: { balance: -orderdata.total },
          $push: {
            history: {
              from: orderdata.status,
              price: -orderdata.total,
              Date:new Date(),
             }
          }
        },
        { new: true }
      );
      res.render("ordersuccess",{order:orderdata})
    }else{
    res.render("ordersuccess",{order:orderdata})
    }
  }catch(error){
    console.log(error.message)
  }
}
const coupondisplay=async(req,res)=>{
  try{
    const newcoupon=await coupon.find()
  
    res.render("availablecoupon",{coupon:newcoupon})

  }catch(error){
    console.log(error.message)

  }
}
const loaddashboard=async(req,res)=>{
  try{
    res.render("dashboard")
  }catch(error){
    console.log(error.message)
  }
}
const dispalywallet= async(req,res)=>{
  try{
    const id =req.session.user_id
    const walletdata=await wallet.findOne({user_id:id})
    console.log(walletdata)
    res.render("walletdata",{wallet:walletdata})
}catch(error){
  console.log(error.message)
}
}
const activatewallet=async(req,res)=>{
  try{
    const id=req.session.user_id
    const userdata=await user.findById(id)
    const walletdetails=new wallet({
      user_id :id,
      balance:0,
      reffcode:userdata.lname + userdata.fname

    })
    const updatedwallet= await walletdetails.save()
    res.render("walletdata",{wallet:updatedwallet})

  }catch(error){
    console.log(error.message)
  }
}
const referancecodeverify = async (req, res) => {
  try {
      const oldrefcode = req.body.referenceCode
      const valiedwallet = await wallet.findOneAndUpdate(
        { reffcode: oldrefcode },
        {
          $inc: { balance: 200 },
          $push: {
            history: {
              from: "reference",
              price: 200,
              Date: new Date()
            }
          }
        },
        { new: true } // This option returns the updated document
      );
      console.log(valiedwallet )
    res.json({valiedwallet});
  } catch (error) {
      console.log(error.message);
  }
};


const downloadInvoice = async (req, res) => {
  try {
    const id = req.query.id;

    // Find the order by its ID and populate product information
    const Order = await order.findOne({ _id: id }).populate("products.productid").exec();

    // Calculate subtotal of the order
    const subTotal = Order.products.reduce((total, item) => total + item.productid.price * item.quantity, 0);

    // Prepare product data for the invoice
    const productsWithData = Order.products.map(item => {
      return {
        quantity: item.quantity,
        description: item.productid.name, 
        price: item.productid.price,
        "tax-rate": 0,
        total: item.productid.price * item.quantity
      };
    });

    // Calculate total amount
    const totalAmount = subTotal;

    // Create data object for the invoice
    const data = {
      documentTitle: 'Invoice',
      currency: 'USD',
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      // ... sender and client information ...
      invoiceNumber: Order._id.toString(),
      invoiceDate: Order.orderedAt.toISOString(),
      information: {
        number: Order._id.toString(),
        date: Order.orderedAt.toISOString(),
        'due-date': 'Nil',
      },
      products: productsWithData,
      amount: {
        subtotal: subTotal.toFixed(2),
        total: (subTotal + totalAmount).toFixed(2)
      },
      bottomNotice: 'Thank you, Keep shopping.',
    };

    // Generate PDF invoice using the easyinvoice library
    const pdfResult = await easyinvoice.createInvoice(data);
    const pdfBuffer = Buffer.from(pdfResult.pdf, 'base64');

    // Set HTTP headers for the PDF response
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    // Create a readable stream from the PDF buffer and pipe it to the response
    const pdfStream = new Readable();
    pdfStream.push(pdfBuffer);
    pdfStream.push(null);

    pdfStream.pipe(res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating invoice.');
  }
};
const contact=async(req,res)=>{
  try {
    res.render("contact")
    
  } catch (error) {
    console.log(error.message)
    
  }
}
const usercomplaint=async(req,res)=>{
  try{
    const complaintdata=await complaint({
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      subject:req.body.subject,
      message:req.body.message
      
 })
 const data= await complaintdata.save()
 res.render('contact', { message: 'Response updated successfully' });
    
  }catch(error){
 console.log(error.message)
  }
}



module.exports={
    loadRegister,
    insertuser,
    loginload,
    verifylogin,
    loadhome,
    createUser,
    userlogout,
    forgotpassword,
    forgotpasswordotp,
    loggallery,
    forgotpasswordotpverify,
    resendotp,
    guestloadhome,
    loadmainshop,
    addtowishlist,
    loadwishlist,
    deletewishlist,
    loadcart,
    addtocart,
    loadcheckout,
    checkoutsubmit,
    deletecart,
    viewprofile,
    editaddress,
    editprofile,
    newaddress,
    addnewaddress,
    editprofilelogin,
    updateaddress,
    checkcoupon,
    paymentsuccess,
    updatequantity,
    orderdetails,
    verifypayment,  
    successpage,
    yourorders,
    Cancelorder ,
    forcod,
    coupondisplay,
    loaddashboard,
    dispalywallet,
    activatewallet,
    referancecodeverify,
    downloadInvoice,
    contact,
    usercomplaint
}
