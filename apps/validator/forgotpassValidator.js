const {body} = require('express-validator');
const UserModel = require('../models/User.js');


const checkvalidator = [body('email').custom(async (value,{req}) => {
        const user = await UserModel.findOne({email: value});
        if(!user){
            throw new Error("Email is Invalid");
        }
        else{
            req.reset = user;
            return true;
        }
})]

module.exports = checkvalidator;