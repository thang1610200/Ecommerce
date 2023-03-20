const cartModel = require('../models/cart.js')
const productModel = require('../models/product.js');

module.exports = {
    addcart: async (userId,products) => {
        const cart = await cartModel.findOne({userId});
        if(!cart){ /// Nếu User chưa đặt hàng thì sẽ thêm vào database
            return await cartModel.findOneAndUpdate({userId},{$set: {"products":products}},{new:true,upsert:true});
        }
        else{ 
            const isProduct =  await cartModel.findOne({"products.name":products.name}); // Kiểm tra product có trong giỏ hay chưa, nếu có r thì tăng số lượng không thì push vào field products
            if(isProduct){
                return await cartModel.findOneAndUpdate({userId, "products.name":products.name},{$inc: {"products.$.number":1}},{new: true});
            }
            return await cartModel.findOneAndUpdate({userId},{$push: {"products":products}},{new: true});
        }
    },
    findById: async (id) => {
        return await cartModel.findById(id); 
    },
    getAll: async (userId) => {
       return await cartModel.findOne({userId});
    },
    getAllproductByCart: async(userId) => {                                  
       const cart =  await cartModel.findOne({userId});
       var array = [];
       if(cart){
            for(let i = 0; i < cart.products.length; i++){
                const products = await productModel.findOne({name: cart.products[i].name});
                array.push({products, number: cart.products[i].number});
            }
       }
       return array;
    },
    updateNumberProduct: async (userId,productName, productNumber) => {
        return await cartModel.findOneAndUpdate({userId,"products.name":productName},{$set: {"products.$.number":productNumber}});
    },
    // Xóa 1 sản phẩm khỏi cart
   removeProduct: async (userId,name) => {
        return cartModel.findOneAndUpdate({userId},{$pull: {products: {name}}},{new: true});
   } 
}