const express = require("express")
const router = express.Router();
const RegisterValidator = require("../../validator/registerValidator.js")
const { validationResult } = require('express-validator');

router.get("/register",(req,res) => {
   res.render("register");
})
      .post("/register",RegisterValidator,(req,res) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()){
             res.render("register",errors);
         }
      });

module.exports = router;