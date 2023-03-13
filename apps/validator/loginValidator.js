const {body} = require("express-validator");
const UserModel = require('../models/User.js');
const {client} = require('../models/limiter.js');

const checkvalidator = [body('email').custom(async (value,{req}) => {
                            const user = await UserModel.findOne({email: value});
                            if(user){
                                if(user.ComparePass(req.body.password)){
                                    req.token = user.GenerateToken();
                                    return true;
                                }
                                else{
                                    throw new Error("Incorrect password");
                                }
                            }
                            else{
                                throw new Error("Email is Invalid");
                             }

                        })];

module.exports = checkvalidator;