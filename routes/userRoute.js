
const express=require("express")
const user_route=express()
const path=require("path")
const config=require("../config/config")
const session=require("express-session")
user_route.use(session({secret:config.sessionsecret,
resave: false,
saveUninitialized: false,
cookie:{
    maxAge:24*60*60*1000 
}
}))
const bodyparser=require("body-parser")
user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))
user_route.use(express.static('public'))
user_route.set('view engine','ejs')
user_route.set('views','./views/users')
const userController=require('../controller/userController.js')
const orderController=require('../controller/orderController.js')
const usermiddle=require('../middleware/usermiddleware.js')
const nocache=require("nocache")
user_route.use(nocache())

user_route.get('/',userController.guestloadhome)
user_route.get('/register',userController.loadRegister)
user_route.post('/register',userController.insertuser)
user_route.get('/login',userController.loginload)
user_route.post('/login',userController.verifylogin)
user_route.get('/home',userController.loadhome)
user_route.post('/otp',userController.createUser)
user_route.get('/forgotpassword',userController.forgotpassword)
user_route.post('/forgotpasswordotp',userController.forgotpasswordotp)
user_route.post("/forgotpasswordotpconfirm",userController.forgotpasswordotpverify)
user_route.get('/users/gallery',userController.loggallery)
user_route.get('/userlogout',usermiddle.islogin,userController.userlogout)
user_route.get('/resendotp',userController.resendotp)
user_route.get('/users/shopmain',userController.loadmainshop)
user_route.get('/addtowishlist',usermiddle.islogin,usermiddle.isblocked,userController.addtowishlist)
user_route.get('/wishlist',usermiddle.islogin,usermiddle.isblocked,userController.loadwishlist)
user_route.get('/deletewishlist',usermiddle.islogin,usermiddle.isblocked,userController.deletewishlist)
user_route.get('/cart',usermiddle.islogin,usermiddle.isblocked,userController.loadcart)
user_route.get('/addtocart',usermiddle.islogin,usermiddle.isblocked,userController.addtocart)
user_route.get('/checkout',usermiddle.islogin,usermiddle.isblocked,userController.loadcheckout)
user_route.post('/chechoutsubmit',usermiddle.islogin,usermiddle.isblocked,userController.checkoutsubmit)
user_route.get('/deletecart',usermiddle.islogin,usermiddle.isblocked,userController.deletecart)
user_route.get('/profile',usermiddle.islogin,usermiddle.isblocked,userController.viewprofile)
user_route.get('/logeditprofile',usermiddle.islogin,usermiddle.isblocked,userController.editaddress)
user_route.post('/editprofileuser',usermiddle.islogin,usermiddle.isblocked,userController.editprofile)
user_route.get('/editprofile',usermiddle.islogin,usermiddle.isblocked,userController.editprofilelogin)
user_route.get("/addnewaddress",usermiddle.islogin,userController.addnewaddress)
user_route.post("/newaddress",usermiddle.islogin,userController.newaddress)
user_route.post("/updateaddress",usermiddle.islogin,userController.updateaddress)
user_route.post("/checkcoupon",usermiddle.islogin,userController.checkcoupon)
user_route.post("/paymentsuccess",usermiddle.islogin,userController.paymentsuccess)
user_route.post('/updatequantities',usermiddle.islogin,userController.updatequantity),
user_route.get("/successpage",usermiddle.islogin,userController.successpage)
user_route.get('/orderdetails',usermiddle.islogin,userController.orderdetails)
user_route.post('/verify-payment',usermiddle.islogin,userController.verifypayment)
user_route.get("/yourorders",usermiddle.islogin,userController.yourorders)
user_route.get("/Cancelorder",usermiddle.islogin,userController.Cancelorder)
user_route.get("/forcod",usermiddle.islogin,userController.forcod)
user_route.get("/coupondisplay",usermiddle.islogin,userController.coupondisplay)
user_route.get("/dashboard",usermiddle.islogin,userController.loaddashboard)
user_route.get("/logwalletdata",usermiddle.islogin,userController.dispalywallet)
user_route.get("/activatewallet",usermiddle.islogin,userController.activatewallet)
user_route.post('/referancecodeverify',userController.referancecodeverify)
user_route.get("/invoice",usermiddle.islogin,userController.downloadInvoice)
user_route.get("/contact",userController.contact)
user_route.post("/usercomplaint",usermiddle.islogin,userController.usercomplaint)
user_route.get("/errorpage",userController.errorpage)

module.exports=user_route