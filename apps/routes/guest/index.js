const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { body } = require('express-validator');

const checkvalidator = [body('email','Format is incorrect').isEmail(), 
                        body('name','Empty field').isLength({max: 1}),
                        body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm').custom((value,{req}) => {
                           if(value !== req.body.password){
                              throw new Error('dsdsssd');
                           }
                           return true;
                        })];

router.get("/register",(req,res) => {
   res.render("register");
})
      .post("/register",checkvalidator,RegisterValidator,(req,res) => {
         res.json({test: "OK"});
      });

module.exports = router;