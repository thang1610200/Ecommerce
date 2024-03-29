const {google} = require('googleapis');
const mail = require('nodemailer');
const config = require('../config/mail.config.js');
const ejs = require('ejs');

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const REDIRECT_URL = config.REDIRECT_URL;
const REFESH_TOKEN = config.REFESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token: REFESH_TOKEN});

const sendMail = async (receiver,url) => {
    try{
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = mail.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'nguyenhuuthangc7@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const data = await ejs.renderFile('./apps/views/verify.ejs',{data:url});

        let infor = await transport.sendMail({
            from: '"Verify" <nguyenhuuthangc7@gmail.com>',
            to: receiver,
            subject: "Verify",
            html: data
        })
    }
    catch(err){
        console.log(err);
    }
}

const sendDiscount = async (receiver, code) => {
    try{
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = mail.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'nguyenhuuthangc7@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const data = await ejs.renderFile('./apps/views/SendDiscount.ejs',{data:code});
        var receivers = [];
        receiver.forEach(function(data){
            receivers.push(data.email);
        })

        let infor = await transport.sendMail({
            from: '"Discounts" <nguyenhuuthangc7@gmail.com>',
            to: receivers,
            subject: "Discounts",
            html: data
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    sendMail,
    sendDiscount
};