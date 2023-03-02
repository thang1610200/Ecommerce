const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const random = require("randomstring");

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
    email_code: String,
    email_active: Date,
    createAt: Date,
    updateAt: Date
})

UserSchema.pre('save',function() {
    if(typeof this.password !== undefined){
        this.salt = this._id;
        const salts = bcrypt.genSaltSync(Number(this._id));
        this.password = bcrypt.hashSync(this.password,salts);
    }
    this.email_code = random.generate(25);
    this.createAt = new Date();
    this.updateAt = new Date();
})

UserSchema.methods.GenerateToken = function(){
    const private_key = fs.readFileSync('./apps/key/private.pem');
    return jwt.sign({id: this._id, role: this.role},private_key, { algorithm: 'RS256' });
}

UserSchema.methods.ComparePass = function(plaintext){
    return bcrypt.compareSync(plaintext, this.password);
}

module.exports = mongoose.model('User',UserSchema);