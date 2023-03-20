const express = require("express");
const productModel = require('../../models/product.js');
const userModel = require('../../models/User.js');
const multer = require('multer');
const drive = require('../../utils/drive.js');
const discountService = require('../../service/discount.service.js');
const {sendDiscount} = require('../../utils/mail.js');

const upload = multer();

const router = express.Router();

router.get('/product',async (req,res) => {
    const product = await productModel.find();
    res.render("product",{data:product,message: req.flash("product_add")});
})
    .post('/product',upload.single("file-upload") ,async (req,res) => {
        const {name,code,brand,price,details,quantity} = req.body;
        const product = await productModel.findOne({name,code});
        if(product){
            req.flash("product_add","Product already exists");
        }
        else
        {
            const file = await drive.uploadFile(req.file);
            await productModel.create({name,code,brand,price,details,quantity,release_date: new Date(),img: file.id});
            req.flash("product_add","Create successful products");
        }
        res.redirect("/admin/product");
    })

router.get("/discount",async (req,res) => {
    const discount = await discountService.findAll();
    res.render("discount",{message: req.flash("discount_add"),data: discount});
})
    .post("/discount", async (req,res) => {
        const {name, code, active, discount, quantity} = req.body;
        await discountService.createDiscount(name,code,active,discount,quantity);
        const discount_code = await discountService.findAll();
        const email = await userModel.find();
        sendDiscount(email,discount_code);
        req.flash("discount_add","Create successful discount");
        res.redirect("/admin/discount");
    })
module.exports = router;