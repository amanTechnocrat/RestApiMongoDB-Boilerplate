const express = require('express');
const router = express.Router()
const authcont = require('../controller/authcont')
const config = require("../config")

//AuthRoutes
router.post("/login", authcont.loginapi)
router.post('/sendmail', authcont.forgetpassword)
router.post("/setforgetpassword", config.verifyToken, authcont.setforgetpassword)
router.post("/changepassword", authcont.changepassword)
router.post("/userregister", authcont.userregister)


module.exports = router;
