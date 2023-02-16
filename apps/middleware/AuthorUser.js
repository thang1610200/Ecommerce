const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req,res,next){
    localStorage.getItem('auth');
    if(!token){
        res.sendStatus(401);
    }

    jwt.verify(token,process.env.SECRET_TOKEN,(err,data) => {
        console.log({err,data});
        return next();
    });
}

module.exports = verifyToken;