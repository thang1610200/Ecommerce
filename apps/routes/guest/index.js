const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { validationResult } = require('express-validator');
const UserModel = require('../../models/User.js');

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
      .post('/login',async (req,res) => {
            const User = await UserModel.findOne({email: req.body.email});
            if(!User){
               res.sendStatus(400);
            }
            const token = User.GenerateToken();
            res.redirect("/customer/shop");
      })
module.exports = router;