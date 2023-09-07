const mongoose=require("mongoose")
require('dotenv').config();
mongoose.connect(process.env.mongo)
const express=require("express")
const app=express()
const http=require("http")
const bodyParser = require('body-parser')
//for user route
app.use(bodyParser.json());
const userRoute=require('./routes/userRoute')
app.use('/',userRoute)
//for admin route
const adminRoute=require('./routes/adminRoute')
app.use('/',adminRoute)

app.listen(process.env.port,
    console.log("http://localhost:7000/"))