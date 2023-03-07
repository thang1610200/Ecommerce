const mongoose = require('mongoose');

const ResetPassSchema = new mongoose.Schema({
    email: String,
    token: String,
    create_at : {
        type: Date,
        expires: 300 
    }
})

module.exports = mongoose.model("ResetPass",ResetPassSchema);