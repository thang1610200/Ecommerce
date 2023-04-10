const orderModel = require("../models/order.js");

module.exports = {
    order_update: async (cartId,userId,amount_paid) => {
        return await orderModel.findOneAndUpdate({cartId,userId},{$set: {amount_paid}},{
            new: true,
            upsert: true
        });
    },
    getAll: async (cartId,userId) => {
        return await orderModel.findOne({cartId, userId});
    },
    order_update_infor: async (cartId,userId,address) => {
        return await orderModel.findOneAndUpdate({cartId,userId},{$set: {address}},{new: true});
    },
    update_status: async (cartId,userId) => {
        return await orderModel.updateOne({cartId,userId},{$set: {
            isPayBefore: true,
            status: "Processing"
        }});
    }
}