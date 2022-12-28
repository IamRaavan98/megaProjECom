require("dotenv").config();
const express = require("express")
const app = express();
const DBconnection = require("./config/DBs")
const cookieParser = require('cookie-parser')
const cors = require("cors");

// database Connection
DBconnection();

//import all routes here
const user  = require("./routes/userRoutes")
const product = require("./routes/productsRoutes")


// router middleware
app.use("/",user)
app.use("/",product)



//middleware
app.use(cookieParser());

//regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//connecting frontend and backend
app.use(cors());



module.exports = app;


