const express = require("express");
const router = express.Router();

router.use("/guest",require("../controllers/guest"));
router.use("/customer",require("../controllers/customer"));
router.use('/admin',require("../controllers/admin"));

router.get("/",(req,res) => {
    res.render("homepage");
})

module.exports = router;