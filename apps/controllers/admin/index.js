const express = require("express");
const productModel = require('../../models/product.js');
const multer = require('multer');
const drive = require('../../utils/drive.js');

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

router.get("/discount",(req,res) => {
    res.render("discount");
});
module.exports = router;