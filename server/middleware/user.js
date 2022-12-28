const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")
//model is optional

exports.auth = async(req, res, next) => {

  const token =
    req.cookies.token ||
    req.body.token 
    // req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(403).send("token is missing, Please login");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decode);

    //this req.user is custom req that we are injecting now we can use whereEver token is present
    req.user = await User.findById(decode.id)

    // bring in info from DB
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
     return next();
    }
    res.status(401).send("You are not allowed on this route")
  };
}


