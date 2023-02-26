const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { validationResult } = require('express-validator');
const UserModel = require('../../models/User.js');
const LoginValidator = require("../../validator/loginValidator.js");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

passport.serializeUser(function(user, done) {   // B3: lưu vào session
   done(null, user);
 });
 
 passport.deserializeUser(function(user, done) {    //B4: lấy dữ liệu từ session ra
     done(null, user);
 });

passport.use(new FacebookStrategy({
   clientID: process.env.FACEBOOK_APP_ID,
   clientSecret: process.env.FACEBOOK_APP_SECRET,
   callbackURL: "https://4821-2402-800-630f-6701-e1d8-da52-15c5-f2b6.ap.ngrok.io/guest/facebook/callback"
 },
 function(accessToken, refreshToken, profile, cb) {        // B2: trả dữ liệu về
      UserModel.findOne({email : profile.id},async function(err,user){
         if(err){
            return cb(err);
         }

         if(!user){
            await UserModel.create({email: profile.id, fullname: profile.displayName});
         }
         return cb(null,user);
      });
 }                                                          
))

router.get('/facebook',                   //B1: vô đường dẫn
  passport.authenticate('facebook')); 

router.get('/facebook/callback',                         // B5: trả về kết quả
  passport.authenticate('facebook', { failureRedirect: '/guest/login' }),
  async function(req, res) {
      const User = await UserModel.findOne({email: req.user.email});
      res.cookie("token",User.GenerateToken(),{path:"/",httpOnly: true, sameSite: "strict",maxAge:1000 * 3600 * 24})
      res.redirect('/customer/shop');
  });

router.get("/register",(req,res) => {
   res.render("register");
})
      .post("/register",RegisterValidator, async (req,res) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()){
             res.render("register",errors);
         }
         else{
            const {fullname, email, password} = req.body;
            const User = await UserModel.create({fullname, email, password});
            res.redirect("/guest/login");
         }
      });


router.get('/login',(req,res) => {
   res.render('login');
})
      .post('/login',LoginValidator, (req,res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
               res.json({errors});
            } 
            else{
               res.json({accessToken: req.token});
            }
      })

module.exports = router;