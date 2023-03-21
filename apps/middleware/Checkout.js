const cartModel = require("../models/cart.js");

module.exports = async (req,res,next) => {
    const cart = await cartModel.findOne({userId: req.user.id,status: "Active"});
    if(cart){
        return next();
    }
    return res.redirect("/customer/shop");
}