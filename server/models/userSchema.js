require("dotenv").config;
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name:{
        
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    token:{
        type:String,
    },
    role:{
        type:String,
        default: "user",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
})

userSchema.pre('save',async function(next) {
    if(!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password,10)
  });


userSchema.method.validateUser = async function(email){
    await userSchema.findOne({email}) != {}?(true):(false)
}



userSchema.methods.passwordCompare = async function(password){
    return (await bcrypt.compare(password,this.password) === true?(true):(false))

}

userSchema.methods.tokenGenerat= function(){
    
const token = jwt.sign({email:this.email, id:this._id},process.env.SECRET_KEY,{expiresIn:"2day"})
const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    };
return {token,options}
}

userSchema.methods.getForgotPasswordToken = function () {
    // generate a long and randomg string
    const forgotToken = crypto.randomBytes(20).toString("hex");
  
    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
  
    //time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  
    return forgotToken;
  };



module.exports = mongoose.model("User",userSchema)
