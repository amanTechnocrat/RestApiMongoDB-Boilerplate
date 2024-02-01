const express = require('express');
const router = express.Router()
const usercont = require('../controller/usercont')
const config = require("../config")

//ProtectedRoutes with the JWT Token
router.get("/getuser", usercont.getuserdetails)
router.get("/getuserbyid/:id", config.verifyToken, usercont.getuserdetailsbyid)
router.delete("/deleteuser/:id", config.verifyToken, usercont.deleteuserbyid)
router.put("/updateuser/:id", config.verifyToken, usercont.updateuserdetails)
router.get("/profileimg/:id", config.verifyToken, usercont.viewimage)


module.exports = router;
