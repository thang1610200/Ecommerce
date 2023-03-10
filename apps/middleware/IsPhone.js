const UserModel = require('../models/User.js')

// Kiểm tra user có sô điện thoại hay chưa, nếu chưa có thì in ra lỗi nếu có r thì gửi mã xác nhận
module.exports = async (req,res,next) => {
    const user = await UserModel.findById(req.user.id);

    if(typeof user.phone === 'undefined'){
        return res.sendStatus(403);
    }
    next();
}