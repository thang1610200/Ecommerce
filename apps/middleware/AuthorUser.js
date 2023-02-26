const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');

function verifyToken(req,res,next){
    const publickey = fs.readFileSync("./apps/key/publickey.crt");
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/guest/login");
    }
    jwt.verify(token,publickey,{ algorithms: ['RS256'] },(err,data) => {
        if(err){
            return res.redirect("/guest/login");
        }
        next();
    });
}

module.exports = verifyToken;