const express = require("express")
const {home} =  require("../controllers/home")
const {deleteallUsers,
      signup,
      login,
      logout,
      forgotPassword} = require("../controllers/user")
const router = express.Router();


router.get("/", home);
router.get("/logout",logout);
router.post("/signup",signup)
router.post("/login",login)
router.post("/forgotPassword",forgotPassword)
router.delete("/delete",deleteallUsers)

module.exports = router;