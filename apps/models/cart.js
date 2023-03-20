const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId: String,
    status: {type: String, default: 'Active'}, // Soft delete
    modifiedOn: {type: Date, default: Date.now()},
    products: {type: Array, default: []}
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Cart",CartSchema);