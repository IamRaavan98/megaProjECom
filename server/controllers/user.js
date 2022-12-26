require("dotenv").config;
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mailHelper = require("../utils/mailHelper");
const crypto = require("crypto");

exports.deleteallUsers = async (req,res)=>{
  try {
     await User.deleteMany();
    res.send("deleted all Users")
  } catch (error) {
    res.send(error.message)
  }
}

exports.login = async(req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
      throw new Error("User not found")
    } 
  else{
   if((await user.passwordCompare(password)) === false){throw new Error("password is not Correct")}
    else{
      const {token,options} = await user.tokenGenerat()
      res.status(200).cookie("token",token,options).json({
        success:true,
        token,
       email       
    })
    }
   }
 }catch (error) {
   res.status(400).send(error.message)
}
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     
    // we are not covering if fields are empty we cover it in frontend itself
   // we are considering that as user is not signup yet he is not having any todo or task
    const UserExists = await User.findOne({email});
      
    if (UserExists) {
      throw new Error("Email already exists");
    } 
    else {
      const myEncPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          email:email,
          password: myEncPassword,
            name:name,
        });
     

      const {token,options} = await user.tokenGenerat()
      res.status(200).cookie("token",token,options).json({
        success:true,
        token,
       email       
    })
    }
  }catch (error) {
    res.status(400).send(error.message)
  }
};

exports.logout = async(req,res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  //send JSON response for success
  res.status(200).json({
    succes: true,
    message: "Logout success",
  });
}

exports.forgotPassword = async(req,res)=>{
try {
  const {email} = req.body
  const user = await User.findOne({ email });
  if(!user){
  res.status(400).send("EMail not found")
}
  const forgotTOKEN = await user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const myURL = `${req.protocol}://${req.get("host")}/password/reset/${forgotTOKEN}`


  const message = `You know what to do ${myURL}`
  try {
 
    await mailHelper({
      email:user.email,
      subject:"LCO store-Password reser Email",
      message
    })
  
    
  } catch (error) {
    console.log("iamworking");
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
  
    await user.save({ validateBeforeSave: false });
    res.send(error.message)
  }
res.status(200).json({
    status:true,
    message:"message Send succesfully"
  })
}catch (error) {
  res.send(error.message)
}
}