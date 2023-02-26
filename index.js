const express = require("express");
require("dotenv").config();
const body_parser = require("body-parser");
const router = require(__dirname + "/apps/routes");
const mongoose = require('mongoose');
const cookie_parser = require("cookie-parser");
const session = require("express-session");
const passport = require('passport');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL);

app.use("/static",express.static(__dirname + "/public"));

app.set("views",__dirname + "/apps/views");
app.set("view engine","ejs");

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

app.use(cookie_parser());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running in port: ${PORT}`);
})