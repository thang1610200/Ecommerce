const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { validationResult } = require('express-validator');
const UserModel = require('../../models/User.js');
const LoginValidator = require("../../validator/loginValidator.js");

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
               const token = req.token;
               res.json({token});
            }
      })
module.exports = router;