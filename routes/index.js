const express = require('express');
const router = express.Router()
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');


//User's Routes
router.use('/user', userRoutes)

//Auth Routes
router.use('/auth', authRoutes)



module.exports = router;
