const UserModel = require("../models/User.js");

// Kiểm tra xe User có pass hay chưa, nếu có r thì không vào được form này
module.exports = async (req,res,next) => {
    const user = await UserModel.findById(req.user.id);
    if(typeof user.password !== 'undefined'){
        return res.sendStatus(403);
    }
    return next();
}