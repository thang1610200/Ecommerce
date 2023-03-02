const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { validationResult } = require('express-validator');
const UserModel = require('../../models/User.js');
const LoginValidator = require("../../validator/loginValidator.js");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

  passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "https://25ab-2402-800-630f-6701-f98d-702a-2bcf-dfa9.ap.ngrok.io/guest/google/callback"
 },
 function(accessToken, refreshToken, profile, cb) {
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
));

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/guest/login' }),
  async function(req, res) {
    // Successful authentication, redirect home.
    const User = await UserModel.findOne({email: req.user.email});
    res.cookie("token",User.GenerateToken(),{path:"/"});
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
            req.flash('register','Successful account registration');
            res.redirect("/guest/login");
         }
      });


router.get('/login',(req,res) => {
   req.flash('login','Successful login');
   res.render('login',{message: req.flash('register')});
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

router.get('/logout',(req,res) => {
   res.clearCookie("token");
   res.redirect("/");
})
module.exports = router;