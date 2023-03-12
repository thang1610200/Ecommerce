const {incr, expire, ttl} = require('../models/limiter.js');

module.exports = async (req,res,next) => {
    const get_id = req.headers['x-forwarded-for'];
    const numRequest = await incr(get_id);
    if(numRequest === 1){
        await expire(get_id,60);
    }

    if(numRequest > 5){
        return res.status(503).json({message: "You have sent too many requests"});
    }
    next();
}