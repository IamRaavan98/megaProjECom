const express = require("express");
const { ProductRouteHome } = require("../controllers/productControllers");
const router = express.Router();

router.route("/home").get(ProductRouteHome)

module.exports = router;