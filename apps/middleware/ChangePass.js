const UserModel = require("../models/User.js");

// Kiểm tra xe User có pass hay chưa, nếu có r thì vào form Change Pass ko có thì đặt pass
module.exports = async (req,res,next) => {
    const user = await UserModel.findById(req.user.id);
    if(typeof user.password === 'undefined'){
        return res.redirect("/customer/setpass");
    }
    return next();
}