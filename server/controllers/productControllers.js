require("dotenv").config;
const User = require("../models/userSchema");

exports.ProductRouteHome = (req,res)=>{
    res.send("Welcome to the products")
}