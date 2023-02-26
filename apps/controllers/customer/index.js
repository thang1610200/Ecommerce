const express = require("express");
const router = express.Router();
const AuthorUser = require('../../middleware/AuthorUser.js');

router.use(AuthorUser);

router.get('/shop',(req,res) => {
    res.render("shop");
})

module.exports = router;