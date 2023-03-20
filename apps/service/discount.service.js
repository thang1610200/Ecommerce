const discountModel = require('../models/discount.js');

module.exports = {
    createDiscount: async (name, code, active, discount, quantity) => {
        return await discountModel.create({name,code,active,discount,quantity});
    },
    findAll: async () => {
        return await discountModel.find();
    },
    findByCode: async (code) => {
        return await discountModel.findOne({code});
    }
}