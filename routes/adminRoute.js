
const express=require("express")
const admin_route=express()
const path=require("path")
const config=require("../config/config")
const session=require("express-session")
admin_route.use(session({secret:config.sessionsecret,resave: false,
saveUninitialized: false,}))
const bodyparser=require("body-parser")
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))
admin_route.use(express.static('public'))
admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')
const adminController=require('../controller/admincontroller.js')
const productController=require('../controller/productcontroller.js')
const bannerController=require('../controller/bannerController')
const adminmiddle=require('../middleware/adminmiddleware.js')
const imageSize = require('image-size');
const nocache=require("nocache")
admin_route.use(nocache())
admin_route.use(session({
  secret: 'your-secret-key', // Replace with a long, random string to enhance security
  resave: false,
  saveUninitialized: true,
}));
const sharp=require(("sharp"))
const multer=require("multer")

// Set up multer for file uploads
const productStorage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'./public/product-images')
    },
  
    //extention
    filename: (req,file,callback)=>{
        callback(null,Date.now()+file.originalname)
    }
  })
  
  //upload parameters for multer
  const upload = multer({
    
      storage: productStorage,
      limits: {
          fileSize: 1024 * 1024 * 10
      },
      fileFilter: function (req, file, callback) {
        if (!file.mimetype.startsWith('image/')) {
            callback(new Error('Only image files are allowed.'));
        }
        callback(null, true);
      },
  
  });
  
admin_route.get('/adminlogin',adminController.loadRegister)
admin_route.post('/adminlogin',adminController.verifylogin)
admin_route.get('/adminhome',adminController.loadhome)
admin_route.get('/productdetails',adminmiddle.islogin,productController.loadproduct)
admin_route.post('/addnewproduct',adminmiddle.islogin,adminmiddle.imagecrop,upload.array('image',5),adminmiddle.imagevalidation,productController.addproduct)
admin_route.get('/addproduct',adminmiddle.islogin,productController.addproductform)
admin_route.post('/addnewproduct',adminmiddle.islogin,productController.addproduct)
admin_route.get('/userlist',adminmiddle.islogin,adminController.showuserlist)
admin_route.get('/admin/blockuser',adminmiddle.islogin,adminController.blockuser)
admin_route.get('/admin/unblockuser',adminmiddle.islogin,adminController.unblockuser)
admin_route.get('/admin/editproduct',adminmiddle.islogin,productController.editproduct)
admin_route.post('/editproduct',adminmiddle.islogin,adminmiddle.imagecrop,upload.array('image',5),productController.updateproduct)
admin_route.get('/admin/listproduct',adminmiddle.islogin,productController.listed)
admin_route.get('/admin/unlistproduct',adminmiddle.islogin,productController.unlisted)
admin_route.get('/addbrand',adminmiddle.islogin,adminController.loadaddbrand)
admin_route.post('/addbrands',adminmiddle.islogin,adminController.addbrand)
admin_route.get('/brandList',adminmiddle.islogin,adminController.brandList)
admin_route.get('/admin/editbrand',adminmiddle.islogin,adminController.editbrand)
admin_route.post('/updatebrand',adminmiddle.islogin,adminController.updatebrand)
admin_route.get('/admin/listbrand',adminmiddle.islogin,adminController.listdbrand)
admin_route.get('/admin/unlistbrand',adminmiddle.islogin,adminController.unlistdbrand)
admin_route.get('/adminlogout',adminmiddle.islogin,adminmiddle.islogout,adminController.adminlogout)
admin_route.get('/admin/deleteimage',productController.deleteimage)
admin_route.get('/coupon',adminmiddle.islogin,adminController.logcoupon)
admin_route.post('/addnewcoupon',adminmiddle.islogin,adminController.addnewcoupon)
admin_route.get('/coupondetails',adminmiddle.islogin,adminController.coupondetails)
admin_route.get('/deletecoupon',adminmiddle.islogin,adminController.deletecoupon)
admin_route.get('/adminorderdetails',adminmiddle.islogin,adminController.orderdetails)
admin_route.get("/editorder",adminmiddle.islogin,adminController.editorder)
admin_route.post("/updatedorder",adminmiddle.islogin,adminController.updateorder)
admin_route.get("/applyoffer",adminmiddle.islogin,adminController.applyoffer)
admin_route.post("/updateofferforbrand",adminmiddle.islogin,adminController.updateofferforbrand)
admin_route.get("/monthly-report",adminmiddle.islogin,adminController.monthlyreport)
admin_route.get("/addbanner",adminmiddle.islogin,bannerController.banneraddform)
admin_route.post("/admin/postBanner",adminmiddle.islogin,bannerController.postbanner)
admin_route.get("/bannerlist",adminmiddle.islogin,bannerController.bannerlist)
admin_route.get("/deleteBanner",adminmiddle.islogin,bannerController.deleteBanner)
admin_route.get("/editBanner",adminmiddle.islogin,bannerController.editBanner)
admin_route.post("/updatebanner",adminmiddle.islogin,bannerController.updateBanner)
admin_route.get("/salesreport",adminmiddle.islogin,adminController.salesreport)
admin_route.get("/reportpage",adminmiddle.islogin,adminController.reportpage)
admin_route.post("/yearwisereport",adminmiddle.islogin,adminController.yearwisereport)
admin_route.get("/specificRange",adminmiddle.islogin,adminController.reportspecificrange)
admin_route.post("/weeklyordaily",adminmiddle.islogin,adminController.weeklyordaily)
admin_route.get("/reviews",adminmiddle.islogin,adminController.reviews)



module.exports=admin_route