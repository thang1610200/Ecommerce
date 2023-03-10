const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OptSchema = new mongoose.Schema({
    phone: String,
    otp: String,
    create_at: {
        type: Date,
        expires: 300
    }
})

OptSchema.pre('save',function(){
    const salt = bcrypt.genSaltSync(10);
    this.otp = bcrypt.hashSync(this.otp,salt);
    this.create_at = new Date();
});

OptSchema.methods.CompareOtp = function(plaintext){
    return bcrypt.compareSync(plaintext,this.otp);
}

module.exports = mongoose.model("Otp",OptSchema);