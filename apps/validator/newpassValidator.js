const {body} = require('express-validator');
const UserModel = require('../models/User.js');

const checkValidator = [body('password').custom(async (value,{req}) =>{
                            const user = await UserModel.findOne({_id: req.user.id});
                            if(!user.ComparePass(value)){
                                throw new Error('Incorrect Password');
                            }
                            else{
                                return true;
                            }
                        }),
                        body('newpass','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm_pass').custom((value,{req}) => {
                            if(req.body.newpass !== value){
                                throw new Error("Password confirmation doesn't match password");
                            }
                            else{
                                return true;
                            }
                        })]

module.exports = checkValidator;