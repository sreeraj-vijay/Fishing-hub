const admin=require('../models/adminmodel')
const sharp = require('sharp');
const imageSize = require('image-size');
const path=require("path")
const islogin=async (req,res,next)=>{
    try{
        if(req.session.admin_id){}
        else{
            res.redirect('/adminlogin')
        }
        next();


    }catch(error){
        console.log(error.message)
    }
}
const islogout=async (req,res,next)=>{
    try{
        if(req.session.admin_id){
            res.redirect("/adminlogin")
        }
        next()

    }catch(error){
        console.log(error.message)
    }
}

const imagevalidation = async (req, res,next) => {
 
    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new Error('Please select at least one image file.');
    }

    const maxWidth = 1920;
    const maxHeight = 1080;

    const errors = [];

    req.files.forEach((file, index) => {
      // Get the dimensions of the image using the 'image-size' package
      const dimensions = imageSize(file.path);

      // Check if the image dimensions exceed the maximum allowed size
      if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
        errors.push(`Image ${index + 1} dimensions exceed the maximum allowed size (1920x1080).`);
      }

      // Proceed with further processing or saving each image
      // ...
    });
    next()
  }
  const imagecrop= async(req,res,next)=>{
    try{
    const semiTransparentRedPng= await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
  })

    .png()
    .toBuffer();
    next()
  }catch(error){
    console.log(error.message)
  }
}
module.exports={
    islogin,
    islogout,
    imagevalidation,
    imagecrop
    

}