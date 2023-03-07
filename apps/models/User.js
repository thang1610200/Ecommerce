const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const random = require("randomstring");
const ResetPassModel = require('../models/ResetPassword.js');
const sendMail = require("../utils/mail.js");

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    isEmailActive: Boolean,
    isPhoneActive: Boolean,
    salt: Number,
    password: String,
    role: {type: String, default: 'User'},
    address: String,
    avatar: {type: String, default: "https://lh6.googleusercontent.com/WvujLBiEobB26B8n9bUM8RvbV2sHjqSm2TgaSof-ByzDEEwSSZxoY2PL8H868Pz7R3ffqgF10LEzkxQ=s220"},
    cover: String,
    point: {type: Number, default: 0},
    e_wallet: {type: Number, default: 0},
    email_code: String,
    email_active: Date,
    createAt: Date,
    updateAt: Date
})

UserSchema.pre('save',function() {
    if(typeof this.password !== 'undefined'){ 
        const rand = Math.floor(Math.random() * 101);
        this.salt =  rand;
        const salts = bcrypt.genSaltSync(rand);
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

module.exports = mongoose.model('User',UserSchema);