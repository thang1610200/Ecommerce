const express = require("express");
const router = express.Router();

router.use("/guest",require(__dirname + "/guest"));
router.use("/customer",require(__dirname + "/customer"));

router.get("/",(req,res) => {
    res.render("homepage");
})

module.exports = router;