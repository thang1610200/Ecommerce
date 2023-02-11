const express = require("express");
const router = express.Router();

router.use("/guest",require(__dirname + "/guest/index.js"));

router.get("/",(req,res) => {
    res.render("homepage");
})

module.exports = router;