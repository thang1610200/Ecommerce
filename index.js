const express = require("express");
require("dotenv").config();
const body_parser = require("body-parser");
const router = require(__dirname + "/apps/routes");

const app = express();

app.use("/static",express.static(__dirname + "/public"));

app.set("views",__dirname + "/apps/views");
app.set("view engine","ejs");

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running in port: ${PORT}`);
})