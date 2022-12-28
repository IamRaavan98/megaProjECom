const express = require("express")

const {home} =  require("../controllers/home")
const {deleteallUsers,
      signup,
      login,
      logout,
      forgotPassword,
      resetPassword,
      logginInUserDashboard,
      updateTheOldPassword,
      adminAllUser,
      managerAccess} = require("../controllers/userControllers");
const { auth ,customRole} = require("../middleware/user");

const router = express.Router();


router.get("/", home);
router.get("/logout",logout);
router.post("/signup",signup)
router.post("/login",login)
router.post("/forgotPassword",forgotPassword)
router.put("/password/reset/:token",resetPassword)
router.delete("/delete",deleteallUsers)
router.get("/userDashboard",auth, logginInUserDashboard);
router.post("/changePassword",auth, updateTheOldPassword);
router.get("/Admin/users",auth,customRole("Admin"), adminAllUser);
router.get("/manager/users",auth,customRole("manager"), managerAccess);
module.exports = router;