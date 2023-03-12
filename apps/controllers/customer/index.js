const express = require("express");
const router = express.Router();
const AuthorUser = require('../../middleware/AuthorUser.js');
const UserModel = require('../../models/User.js');
const SendMail = require('../../utils/mail.js');
const CheckParam = require('../../middleware/CheckParam.js');
const multer = require('multer');
const Drive = require('../../utils/drive.js');
const NewpassValidator = require('../../validator/newpassValidator.js');
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const SetPassMiddleware = require('../../middleware/SetPass.js');
const ChangePassMiddleware = require('../../middleware/ChangePass.js');
const SetPassValidator = require('../../validator/setpassValidator.js');
const OtpModel = require('../../models/SendOtp.js');
const isPhone = require('../../middleware/IsPhone.js');
const BlockRequest = require('../../middleware/BlockRequest.js');

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
    .post('/profile',upload.any(),async (req,res) => {       // đổi qua sử dụng ajax  // viết thêm 1 hàm validator 
        const {first, phone} = req.body;
        if(req.files.length != 0){
            const drive = await Drive.uploadFile(req.files[0]);
            await UserModel.updateOne({_id: req.user.id},{fullname: first, avatar: drive.id, phone});
        }
        else{
            await UserModel.updateOne({_id: req.user.id},{fullname: first, phone});
        }
        res.redirect("/customer/profile");
    })

// gửi email xác nhận tới Customer
router.get('/email',async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user.isEmailActive){
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
    await UserModel.findOneAndUpdate({email_code: req.params.token},{isEmailActive: true});
    res.redirect("/customer/profile");
})

//Change Password
router.get('/newpass',ChangePassMiddleware,async (req,res) =>{
    const user = await UserModel.findById(req.user.id);
    res.render('change_password',{data: user});
})
    .post('/newpass',NewpassValidator, async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({errors});
        } 
        else{
            const salt = Math.floor(Math.random() * 11);
            await UserModel.updateOne({_id: req.user.id},{password: bcrypt.hashSync(req.body.newpass,salt),salt,updateAt: new Date()});
            res.clearCookie("token");
            res.json({test:"200"});             // đổi lại thành res.json(error) / bên client sửa thành if(error.isEmpty())
        }
    })

// set password if user login by FB, GG
router.get('/setpass',SetPassMiddleware,async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    res.render("set_password",{data: user});
})
    .post('/setpass',SetPassValidator,async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json(errors);
        }
        else{
            const salt = Math.floor(Math.random() * 11);
            await UserModel.updateOne({_id: req.user.id},{password: bcrypt.hashSync(req.body.password,salt),salt,updateAt: new Date()});
            res.json({test: "200"});
        }
    })

router.get('/otp/:token', isPhone ,async (req,res) => {
    const user = await UserModel.findById(req.user.id);
    if(user.phone_code != req.params.token){
        res.sendStatus(403);
    }
    else{
        const otp = await OtpModel.findOne({phone: user.phone});
        if(!otp){
            const test = await user.SendOtp();
            console.log(test);
            res.render('send_otp');
        }
        else{
            res.render('send_otp',{message:"OTP has been sent"});
        }
    }
})
        .post('/otp',BlockRequest,async (req,res) => {
            const {otp} = req.body;
           const user = await UserModel.findById(req.user.id);
           const otpmodel = await OtpModel.findOne({phone: user.phone});
            if(otpmodel.CompareOtp(otp)){
                await UserModel.updateOne({_id:req.user.id},{isPhoneActive: true});
                await OtpModel.deleteOne({phone: user.phone});
                res.json({statusCode: 200});
            }
            else{
                res.json({statusCode: 403}); ////// in ra lỗi nếu sai mã otp
            }
        })
        .post("/otp/resend",async (req,res) => {
            const user = await UserModel.findById(req.user.id);
            const test = await user.SendOtp();
            console.log(test);
            res.json({statusCode: 200});
        })

module.exports = router;