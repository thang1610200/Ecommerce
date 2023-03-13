const ProductModel = require('../models/product.js');

module.exports = {
    paging: async (page) => {
        let pageSize = 6;
        return await ProductModel.find().skip((page - 1) * pageSize).limit(pageSize);
    },
    count: async () => {
        return await ProductModel.count();
    }
}