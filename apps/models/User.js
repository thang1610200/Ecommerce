const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    isEmailActive: Boolean,
    isPhoneActive: Boolean,
    salt: String,
    password: String,
    role: {type: String, default: 'User'},
    address: String,
    avatar: String,
    cover: String,
    point: {type: Number, default: 0},
    e_wallet: {type: Number, default: 0},
    createAt: Date,
    updateAt: Date
})

UserSchema.pre('save',function() {
    this.salt = this._id;
    const salts = bcrypt.genSaltSync(Number(this._id));
    this.password = bcrypt.hashSync(this.password,salts);
    this.createAt = new Date();
    this.updateAt = new Date();
})

UserSchema.methods.GenerateToken = function(){
    return jwt.sign({id: this._id, role: this.role},process.env.SECRET_TOKEN,{expiresIn: "30s"});
}

UserSchema.methods.ComparePass = function(plaintext){
    return bcrypt.compareSync(plaintext, this.password);
}

module.exports = mongoose.model('User',UserSchema);