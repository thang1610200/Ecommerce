const express = require("express");
require("dotenv").config();
const body_parser = require("body-parser");
const router = require(__dirname + "/apps/routes");
const mongoose = require('mongoose');
const cookie_parser = require("cookie-parser");
const session = require("express-session");
const passport = require('passport');
const flash = require('connect-flash');
const compression = require('compression');
const logevent = require(__dirname + '/apps/utils/logEvent.js');

const app = express();

app.use(compression({level: 6}));  // tối ưu băng thông, tăng tốc độ chạy

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
    saveUninitialized: false,
    cookie: { secure: false}
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(router);
app.use((req,res,next) => {
    res.status(404);
    res.json({
        message: "cc"
    })
})

app.use((err,req,res,next) => {
    logevent(`${req.url}====${req.method}====${err}`);
    res.status(err.status || 500);
    res.json({
        message: "cddddd"
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running in port: ${PORT}`);
})