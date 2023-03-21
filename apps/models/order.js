const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    cartId: String,
    userId: String,
    shipping: String,
    payments: Object,
    address: String,
    status: {type: String, default: "Not precessed"}, // Trạng thái đơn hàng
    amount_paid: {type: Number, default: 0},
    isAmount: {type: Boolean, default: false},
    isPayBefore: {type: Boolean, default: false}
},{
    timestamps: true
})

module.exports = mongoose.model("Order",OrderSchema);