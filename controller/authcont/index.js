const mongoose = require('mongoose');
const userdetails = mongoose.model('user_details')
const config = require('../../config');
const genhash = require('../../helper/bcrypt').genhash;
const verifyhash =  require('../../helper/bcrypt').verify;

//Login API
exports.loginapi = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            let user = await userdetails.findOne({ "email": req.body.email })
            if (user) {
                //Comaparing the user password to Hashcode
                user.comparePassword(req.body.password, async (err, isMatch) => {
                    if (err) {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": err.message
                        });
                        return;
                    };
                    if (isMatch === true) {
                        let token = config.genToken(user.email)
                        let refreshtoken = config.genToken(user.email, "7d")
                        res.json({
                            "code": config.successCode,
                            "accesstoken": token,
                            "refreshtoken": refreshtoken,
                            "status": "success"
                        });
                        return;
                    } else {
                        res.json({
                            "code": 200,
                            "status": config.errorStatus,
                            "message": config.wrongPassMessage
                        });
                        return;
                    }
                });
            } else {
                res.json({
                    "code": 200,
                    "status": config.errorStatus,
                    "message": config.accountNotExistsMessage
                });
                return;
            }
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Sending Mail for Forgetpassword
exports.forgetpassword = async (req, res) => {
    try {
        if (req.body.email) {
            let check = await userdetails.find({ "email": req.body.email })
            if (check.length !== 0) {
                let token = config.genToken(req.body.email, "10m")
                config.mail(req.body.email, token)
                res.json({
                    "code": config.successCode,
                    "message": "Mail is sended to your account follow that link to change your Password",
                    "status": config.successStatus
                });
                return;
            } else {
                res.json({
                    "code": config.errCode,
                    "status": config.errorStatus,
                    "message": config.notRegEmailMessage
                });
                return;
            }
        } else {
            res.json({
                "code": config.errCode,
                "status": config.errorStatus,
                "message": config.errMessage
            });
            return;
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//API for Setting Forget Password
exports.setforgetpassword = async (req, res) => {
    try {
        if (req.body.password) {
            let hashcode = await genhash(10, req.body.password) //function for Generating the hashtoken
            await userdetails.updateOne({ email: res.valid.data }, { password: hashcode }, (err) => {
                if (!err) {
                    res.json({
                        "code": config.successCode,
                        "message": "Password is Changed Now Login Again with New Password",
                        "status": config.successStatus
                    });
                    return;
                } else {
                    res.json({
                        "code": config.errCode,
                        "status": config.errorStatus,
                        "message": config.errMessage
                    });
                    return;
                }
            });
        } else {
            res.json({
                "code": config.errCode,
                "status": config.errorStatus,
                "message": config.reqPasswordMessage
            });
            return;
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Change Password API
exports.changepassword = async (req, res) => {
    try {
        var receivedValues = req.body;
        if (
            JSON.stringify(receivedValues) === '{}' ||
            receivedValues === undefined ||
            receivedValues === null ||
            receivedValues === '' || receivedValues.oldpassword === undefined || receivedValues.newpassword === undefined) {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.reqPasswordMessage
            });
            return;
        } else {
              userdetails.findOne({ "_id": req.body.id },async (err, result) => {
                if (err) throw err;
                else {
                    const checkpassword = await verifyhash(req.body.oldpassword, result.password)
                    console.log(checkpassword)
                    if (checkpassword) {
                        let hashcode = await genhash(10, req.body.newpassword)
                        userdetails.findOneAndUpdate({"_id": req.body.id }, {password:hashcode}, { returnDocument: 'after' }, (err)=> {
                            if (err) throw err;
                            else {
                                res.json({
                                    "code": config.successCode,
                                    "message": "Password is Changed",
                                    "status": config.successMessage
                                });
                                return;
                            }
                        })
                    } else {
                        res.json({
                            "code": config.errCode,
                            "message": "Old Password didn't Match ! You can't Change Password with this",
                            "status": config.errorStatus
                        });
                        return;
                    }
                }
            })
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//User Register API
exports.userregister = async (req, res) => {
    try {
        //Function for Image Upload
        config.upload.single("profileimg")(req, res, (err) => {
            if (err) {
                res.json({
                    "code": config.errCode,
                    "status": config.errorStatus,
                    "message": err.message
                });
                return
            } else {
                var receivedValues = req.body;
                if (
                    JSON.stringify(receivedValues) === '{}' ||
                    receivedValues === undefined ||
                    receivedValues === null ||
                    receivedValues === '') {
                    res.json({
                        "code": config.errCode,
                        "status": config.errorStatus,
                        "message": config.allFieldsReqMessage
                    });
                    return;
                } else {
                    let fileds = {
                        firstName: receivedValues.firstName,
                        lastName: receivedValues.lastName,
                        email: receivedValues.email,
                        password: receivedValues.password,
                        mobileNo: receivedValues.mobileNo,
                        userImage: req.file.filename
                    }
                    let data = new userdetails(fileds)
                    //Saving New User to MongoDB
                    data.save((err, data) => {
                        if (!err) {
                            res.json({
                                "code": config.successCode,
                                "data": data,
                                "status": config.successStatus
                            });
                            return;
                        } else {
                            if (err.message.includes("E11000 duplicate key error collection")) {
                                res.json({
                                    "code": config.errCode,
                                    "status": config.errorStatus,
                                    "message": config.alExEmailMessage
                                });
                                return;
                            } else {
                                res.json({
                                    "code": config.errCode,
                                    "status": config.errorStatus,
                                    "message": err.message
                                });
                                return;
                            }
                        }
                    });
                }
            }
        })
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}