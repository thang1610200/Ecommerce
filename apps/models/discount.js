const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
    name: String,
    code: {type:String},
    active: {type: Boolean, default: false},
    discount: {type: Number, default: 0},
    quantity: {type: Number, default: 0},
    user: {type: Array, default: []}
},{
    timestamps: true
});


module.exports = mongoose.model("discount",DiscountSchema);