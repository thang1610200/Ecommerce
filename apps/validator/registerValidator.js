const { body } = require('express-validator');

const checkvalidator = [body('email','Format is incorrect').isEmail(), 
                        body('name','Empty field').isLength({max: 1}),
                        body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm').custom((value,{req}) => {
                        if(value !== req.body.password){
                            throw new Error("Password confirmation doesn't match password");
                        }
                        return true;
                        })];


module.exports = checkvalidator;

