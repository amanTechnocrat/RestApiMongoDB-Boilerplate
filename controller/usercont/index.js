const mongoose = require('mongoose');
const userdetails = mongoose.model('user_details')
const config = require('../../config');
const fs = require('fs');


//User Updating API
exports.updateuserdetails = async (req, res) => {
    try {
        //Updating Profile Image Function
        config.upload.single("profileimg")(req, res, async (err) => {
            if (err) {
                res.json({
                    "code": config.errCode,
                    "status": config.errorStatus,
                    "message": err.message
                });
                return;
            } else {
                var receivedValues = req.body;
                req.file ? receivedValues.userImage = req.file.filename : null
                if (receivedValues === null || receivedValues == undefined) {
                    res.json({
                        "code": config.errCode,
                        "status": config.errorStatus,
                        "message": config.allFieldsReqMessage
                    });
                    return;
                }
                else {
                    userdetails.findOneAndUpdate({ "_id": req.params.id }, receivedValues, { returnDocument: 'after' }, (err, data) => {
                        if (!err) {
                            res.json({
                                "code": config.successCode,
                                "data": data,
                                "status": config.successStatus
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

//User Getting API
exports.getuserdetails = async (req, res) => {
    try {
        let pageSize = req.query.pageSize || 10
        let nextpage = req.query.next || 1
        let data = await userdetails.find().lean().limit(pageSize).skip(pageSize * (nextpage - 1))
        res.json({
            "code": config.successCode,
            "data": data,
            "status": config.successStatus
        });
        return;
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;

    }
}

//Getting User By ID API
exports.getuserdetailsbyid = async (req, res) => {
    try {
        let data = await userdetails.findOne({ "_id": req.params.id })
        res.json({
            "code": config.successCode,
            "data": data,
            "status": config.successStatus
        });
        return;
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//User Deleting API
exports.deleteuserbyid = async (req, res) => {
    try {
        let data = await userdetails.deleteOne({ "_id": req.params.id });
        res.json({
            "code": config.successCode,
            "data": data,
            "status": config.successStatus
        });
        return;
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Getting Profile Image API
exports.viewimage = (req, res) => {
    try {
        const path = `./images/profileimg/${req.params.id}`
        //Creating the Reading Stream for Image  
        const file = fs.createReadStream(path)
        res.setHeader('Content-Disposition', 'attachment: filename="' + req.params.url)
        file.pipe(res)
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}





