require("dotenv").config;
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailHelper = require("../utils/mailHelper");
const crypto = require("crypto");

exports.deleteallUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.send("deleted all Users");
  } catch (error) {
    res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    } else {
      if ((await user.passwordCompare(password)) === false) {
        throw new Error("Password is not Correct");
      } else {
        const { token, options } = await user.tokenGenerat();
        res.status(200).cookie("token", token, options).json({
          success: true,
          token,
          email,
        });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // we are not covering if fields are empty we cover it in frontend itself
    // we are considering that as user is not signup yet he is not having any todo or task
    const UserExists = await User.findOne({ email });

    if (UserExists) {
      throw new Error("Email already exists");
    } else {
      const user = await User.create({
        email: email,
        password,
        name: name,
      });

      const { token, options } = await user.tokenGenerat();
      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        email,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  //send JSON response for success
  res.status(200).json({
    succes: true,
    message: "Logout success",
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send("EMail not found");
    }
    const forgotTOKEN = await user.getForgotPasswordToken();
    // console.log(forgotTOKEN);
    await user.save({ validateBeforeSave: false });
    const myURL = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${forgotTOKEN}`;

    const message = myURL;
    try {
      await mailHelper({
        email: user.email,
        subject: "LCO store-Password reser Email",
        message,
      });
    } catch (error) {
      // console.log("iamworking");
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;

      await user.save({ validateBeforeSave: false });
      res.send(error.message);
    }
    res.status(200).json({
      status: true,
      message: "message Send succesfully",
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    // console.log(token);
    const newtoken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      newtoken,
      forgotPasswordToken: { $gt: Date.now() },
    });
    if (!user) {
      res.status(4000).send("Token is invalid");
    }
    if (password != confirmPassword) {
      res.send("password does not match");
    }
    user.password = req.body.password;

    // reset token fields
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // save the user
    await user.save();

    const { tokens, options } = await user.tokenGenerat();
    res.status(200).cookie("token", tokens, options).json({
      success: true,
      tokens,
      email,
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.logginInUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("token not found i.e Please login");
    res.status(200).json({
      succes: true,
      user,
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.updateTheOldPassword = async (req, res) => {
  try {
    const olduser = await User.findById(req.user.id);

    if (!(await olduser.passwordCompare(req.body.oldPassword)))
      throw new Error("Please enter old password correct");
    else {
      olduser.password = req.body.newPassword;
      await olduser.save();
      res.status(200).json({
        succes: true,
        olduser,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.adminAllUser = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    succes: true,
    users,
  });
};

exports.managerAccess  = async (req, res) => {
  const users = await User.find({role:'user'});

  res.status(200).json({
    succes: true,
    users,
  });
};
