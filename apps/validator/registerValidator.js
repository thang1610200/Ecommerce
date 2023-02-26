const { body } = require('express-validator');
const User = require('../models/User.js');

const checkvalidator = [body('email','Format is incorrect').isEmail().custom(async (value,{req}) =>{
                            const user = await User.findOne({email: value})
                            if(user){
                                throw new Error("Email already exists");
                            }
                            return true;
                        }), 
                        body('name','Empty field').isLength({max: 1}),
                        body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm').custom((value,{req}) => {
                        if(value !== req.body.password){
                            throw new Error("Password confirmation doesn't match password");
                        }
                        return true;
                        })];


module.exports = checkvalidator;

