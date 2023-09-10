const admin=require('../models/adminmodel')
const product = require('../models/productmodel');
const brand = require('../models/brandmodels');
const path = require("path");
const multer = require("multer");
//const { search } = require('../routes/adminRoute');
const addproductform = async (req, res) => {
  try {
    const admindata = await admin.findById({ _id: req.session.admin_id });
    // Fetch the 'brands' data from the database or any other source
    const brands = await brand.find({}, "bname");

    res.render("addnewproduct", { brands: brands });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


const addproduct = async (req, res) => {
  const images = req.files.map((file) => file.filename);
  try {
    const brandName = req.body.brand;

    // Fetch the 'brands' data from the database or any other source
    const brands = await brand.find({}, "bname");

    const addnewproduct = new product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      off_price:req.body.price,
      brand: brandName, 
      image: images,
      type: req.body.type,
      weight: req.body.weight,
      stock:req.body.stock,
    });

    const addnew = await addnewproduct.save();

    if (addnew) {
      console.log("Product added successfully");
      // Pass the 'brands' data to the EJS template
      res.render("addnewproduct", { message: "Product added successfully", brands: brands });
    } else {
      // Pass the 'brands' data to the EJS template
      res.render("addnewproduct", { message: "Failed to add product", brands: brands });
    }
  } catch (error) {
    console.log(error.message);
    // Pass the 'brands' data to the EJS template
    res.render("addnewproduct", { message: "Error adding product", brands: brands });
  }
};


const loadproduct= async(req,res)=>{
  
  try{

    const productdata = await product.find({});
    
      res.render('productdetails',{products:productdata })

  }catch(error){
      console.log(error.message)
  }

}
const editproduct=async(req,res)=>{
  try{
      const id = req.query.id
      const productdata =await product.findById({_id:id})
      const brands = await brand.find({},"bname")
    if(productdata){
      res.render("editproduct", { products: productdata, brands: brands });
  


    }else{
      res.redirect("/admin/productlist")

    }

  }catch(error){
    console.log(error.message)
  }
}


const updateproduct = async (req, res) => {
  try {

    const images = req.files.map((file) => file.filename); 
    console.log(images)
    const productId = req.body.id;
    const brandname = req.session.brand;

    const updatedProduct = await product.findByIdAndUpdate(
      productId,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        brand: brandname,
        weight: req.body.weight,
        type: req.body.type,
        stock:req.body.stock,
      },
    );
    if(images){
    const updateimage=await product.updateOne(
      { _id: productId }, 
      { $push: { image: { $each: images } } } 
    );
    }

    res.redirect('/productdetails');
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

const listed=async(req,res)=>{
  try{
    const id=req.query.id
    await product.updateOne({_id:id},{$set:{is_listed:true}})
    res.redirect("/productdetails")

  }
  catch (error){
    console.log(error.message)

  }
}
const unlisted=async (req,res)=>{
  try{
  const id=req.query.id
  await product.updateOne({_id:id},{$set:{is_listed:false}})
  res.redirect("/productdetails")
  }catch(error){
    console.log(error.message)
  }
}
const deleteimage = async (req, res) => {
  try {
    const id = req.query.id;
    const Delete = parseInt(req.query.index); // Convert index to a number

    // Find the product with the given ID
    const productdata = await product.findOne({ _id: id });
    // Remove the specific image at the given index using $unset
    const updatedImage = productdata.image;
    updatedImage[Delete] = undefined; // This will set the element to undefined, not removing it completely

    // Remove null values left by $unset using $pull
    const filteredImage = updatedImage.filter((image) => image !== undefined);

    // Update the product in the database with the modified image array
    await product.updateOne(
      { _id: id },
      {
        $set: { image: filteredImage },
      }
    );

    res.redirect('/productdetails');
  } catch (error) {
    console.log(error.message)
  }
};
 module.exports={
    addproductform,
    addproduct,
    loadproduct,
    editproduct,
    updateproduct,
    listed,
    unlisted,
    deleteimage,
  
  }