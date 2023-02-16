const express = require("express");
const router = express.Router();
const AuthorUser = require('../../middleware/AuthorUser.js');

router.get('/shop',AuthorUser,(req,res) => {
    res.render("shop");
})

module.exports = router;