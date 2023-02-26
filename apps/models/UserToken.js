const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: String,
    createAt: Date
})

TokenSchema.pre('save',function(){
    this.createAt = new Date();
})

module.exports = mongoose.model('Token',TokenSchema);