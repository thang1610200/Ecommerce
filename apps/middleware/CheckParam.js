const UserModel = require("../models/User.js");

module.exports = async (req,res,next) => {
    const token = req.params.token;
    const user = await UserModel.findOne({email_code: token});
    if(user && !user.isEmailActive){
        return next();
    }
  return res.sendStatus(403);
}