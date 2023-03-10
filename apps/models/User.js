const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const random = require("randomstring");
const ResetPassModel = require('../models/ResetPassword.js');
const sendMail = require("../utils/mail.js");
const OtpModel = require('./SendOtp.js');
const generateOtp = require('otp-generator');
const sms = require('../utils/sms.js');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    isEmailActive: {type: Boolean, default: false},
    isPhoneActive: {type: Boolean, default: false},
    salt: Number,
    password: String,
    role: {type: String, default: 'User'},
    address: String,
    avatar: {type: String, default: "1odDXJgjRfaKMdnPY84OyOu4DU-UJ49j3"},
    cover: String,
    point: {type: Number, default: 0},
    e_wallet: {type: Number, default: 0},
    email_code: String,
    phone_code: String,
    createAt: Date,
    updateAt: Date
})

UserSchema.pre('save',function() {
    if(typeof this.password !== 'undefined'){ 
        const rand = Math.floor(Math.random() * 11);
        this.salt =  rand;
        const salts = bcrypt.genSaltSync(rand);
        this.password = bcrypt.hashSync(this.password,salts);
    }
    this.email_code = random.generate(25);
    this.phone_code = random.generate(25);
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

UserSchema.methods.TokenResetPass = async function(){
    const generalToken = random.generate(50);
    await ResetPassModel.create({
        email: this.email,
        token: generalToken,
        create_at: new Date()
    })
    const url = `http://localhost:3001/guest/password/mail/reset/${generalToken}`;
    sendMail(this.email,url);
}

UserSchema.methods.SendOtp = async function(){
    const Otp = generateOtp.generate(4,{digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    const number = "84" + this.phone.slice(1);
    const text = "Code: " + Otp;
    await OtpModel.create({
        phone: this.phone,
        otp: Otp
    })
    sms.sendSMS(number,text);
}

module.exports = mongoose.model('User',UserSchema);