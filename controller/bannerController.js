const admin=require('../models/adminmodel')
const user=require('../models/userModel')
const coupon=require('../models/coupon')
const product = require('../models/productmodel');
const brand = require('../models/brandmodels');
const order = require('../models/ordermodel');
const banner=require('../models/banner')
const path=require("path")
const multer=require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/product-images'); // Specify the destination folder
    }, 
    filename: (req,file,callback)=>{
        callback(null,Date.now()+file.originalname)
    }
});

// Set up the multer middleware with size limit (in bytes)

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB (adjust the size limit as needed)

    },
}).array('image', 5); // 'image' should match the name attribute of your file input

const banneraddform = async(req,res)=>{
    try{
        res.render("addbanner")

    }catch(error){
        console.log(error.message)

    }

}
const postbanner = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred during upload
                console.log("Multer error:", err);
            } else if (err) {
                // An unknown error occurred during upload
                console.log("Unknown error:", err);
            }


            const { title, link,description} = req.body;

            // req.files contains the array of uploaded image details
            
            const imageNames = req.files.map((file) => path.basename(file.path));
           

            const newBanner = new banner({
                title:title,
                link:link,
                image: imageNames,
                description:description
            });

            try {
                // Save the banner to the database
                await newBanner.save();
                res.redirect('/addbanner')
            } catch (error) {
                console.log(error.message);
                res.status(500).send('An error occurred while adding the banner.');
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('An error occurred while uploading files.');
    }
};
const bannerlist= async(req,res)=>{
    try{
 const bannerdetails=await banner.find({})
 res.render("listbanner",{banner:bannerdetails})
    }catch(error){
        console.log(error.message)
    }
}
const deleteBanner=async(req,res)=>{
    try{
        const id=req.query.id
        const deleteBanner = await banner.findByIdAndDelete({_id:id})
        res.redirect("/bannerlist")

    }catch(error){
        console.log(error.message)
    }
}
const editBanner= async(req,res)=>{
    try{
        const id=req.query.id
        const bannerdata=await banner.findById({_id:id})
        res.render("editbanner",{banner:bannerdata})


    }catch(error){
        console.log(error.message)

    }
}
const updateBanner = async (req, res) => {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred during upload
                    console.log("Multer error:", err);
                } else if (err) {
                    // An unknown error occurred during upload
                    console.log("Unknown error:", err);
                }
    
    
                const {id, title, link,description} = req.body;
    
                // req.files contains the array of uploaded image details
                const imageNames = req.files.map((file) => path.basename(file.path));
               const newid=req.body.id
    
                const updatedBanner = await banner.findOneAndUpdate(
                    { _id:newid },
                    {
                      $set: {
                        title: title,
                        link: link,
                        image: imageNames,
                        description: description
                      }
                    },
                    { new: true } // This option returns the updated document
                  );
                  
                res.redirect('/bannerlist')
                
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('An error occurred while uploading files.');
        }
    };
  
    

module.exports={
    banneraddform,
    postbanner,
    bannerlist,
    deleteBanner,
    editBanner,
    updateBanner,
    upload


}