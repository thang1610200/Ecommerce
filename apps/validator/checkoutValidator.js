const {body} = require("express-validator");

const checkValidator = [body("address").custom((value,{req}) => {
    if(value.length === 0){
        throw new Error("Empty Field");
    }
    return true;
})]

module.exports = checkValidator;