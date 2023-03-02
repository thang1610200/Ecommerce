const express = require("express");
const router = express.Router();
const AuthorUser = require('../../middleware/AuthorUser.js');
const UserModel = require('../../models/User.js');
const SendMail = require('../../utils/mail.js');
const CheckParam = require('../../middleware/CheckParam.js');

router.use(AuthorUser); /// middleware check login

router.get('/shop',(req,res) => {
    res.render("shop");
})

router.get('/profile',async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    res.render("profile",{data: user});
})

// gửi email xác nhận tới Customer
router.get('/email',async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    SendMail(user.email,user.email_code);
    res.render("checkmail",{data: user});
})

//Verify Email
router.get('/email/verify/:token',CheckParam,async (req,res) => {
    await UserModel.findOneAndUpdate({email_code: req.params.token},{email_active: new Date()});
    res.redirect("/customer/profile");
})

router.get('/forgotpassword',(req,res) => {
    res.render("forgot_password");
})

module.exports = router;