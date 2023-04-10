const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const config = require("../config/zalopay.config");
const UserModel = require('../models/User.js');

module.exports = {
    createOrder: async (orders) => {
    const user = await UserModel.findById(orders.userId);
    const embed_data = {};
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.appid,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: user.phone,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: orders.amount_paid,
        description: `RAFCART - Payment for the order #${transID}`,
        bank_code: "zalopayapp"
};
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.appid + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    axios.post(config.endpoint, null, { params: order })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.error(err));
        }
}