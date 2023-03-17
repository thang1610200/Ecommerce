const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    code: String,
    brand: String,
    price: Number,
    quantity: Number,
    details: String,
    release_date: Date,
    img: {type: String, default:"1odKfJD_nCOyYHJjiPi4p0697aZSAdxEG"},
    specs: {type: Array, default: []}
},
{
    timestamps: true              // tự tạo 2 trường create_time và update_time
})

module.exports = mongoose.model("product",ProductSchema);