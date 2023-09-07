const session = require('express-session')
const user=require('../models/userModel')
const islogin=async (req,res,next)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect('/login')
        }
        next();


    }catch(error){
        console.log(error.message)
    }
}
const islogout=async (req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect("/login")
        }
        next()

    }catch(error){
        console.log(error.message)
    }
}
const isblocked = async (req, res, next) => {
    try {
        const id=req.session.user_id
        const userdata = await user.findById({_id:id})
        if (userdata.is_blocked) {
              res.redirect("/userlogout" );
        } else {
            // If the user is not blocked, proceed to the next middleware.
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};



module.exports={
    islogin,
    islogout,
    isblocked,


}