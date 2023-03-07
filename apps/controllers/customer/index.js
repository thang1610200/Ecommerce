const express = require("express");
const router = express.Router();
const AuthorUser = require('../../middleware/AuthorUser.js');
const UserModel = require('../../models/User.js');
const SendMail = require('../../utils/mail.js');
const CheckParam = require('../../middleware/CheckParam.js');
const multer = require('multer');
const Drive = require('../../utils/drive.js');

// Set up multer
const upload = multer();

router.use(AuthorUser); /// middleware check login

router.get('/shop',(req,res) => {
    res.render("shop");
})

router.get('/profile',async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    res.render("profile",{data: user});
})
    .post('/profile',upload.any(),async (req,res) => {       // đổi qua sử dụng ajax
        const {first} = req.body;
        if(req.files.length != 0){
            const drive = await Drive.uploadFile(req.files[0]);
            await UserModel.updateOne({_id: req.user.id},{fullname: first, avatar: drive.thumbnailLink});
        }
        else{
            await UserModel.updateOne({_id: req.user.id},{fullname: first});
        }
        res.redirect("/customer/profile");
    })

// gửi email xác nhận tới Customer
router.get('/email',async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user.email_active){
        const url = `http://localhost:3001/customer/email/verify/${user.email_code}`;
         SendMail(user.email,url);
         res.render("checkmail",{data: user});
    }
    else{
        res.redirect("/customer/profile");
    }
})

//Verify Email
router.get('/email/verify/:token',CheckParam,async (req,res) => {
    await UserModel.findOneAndUpdate({email_code: req.params.token},{email_active: new Date()});
    res.redirect("/customer/profile");
})


module.exports = router;