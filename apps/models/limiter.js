const redis = require('redis');

const client = redis.createClient({
    legacyMode: true,
    port: 6379,
    host: '127.0.0.1'
})

client.connect();

const incr = (key) => {
    return new Promise((resolve,reject) => {
        client.incr(key, (err,result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

const expire = (key,ttl) => {                // set time hết hạn cho 1 key
    return new Promise((resolve,reject) => {
        client.expire(key,ttl,(err,result)=> {
            if(err) return reject(err);
            resolve(result)
        })
    })
}

const ttl = (key) => {                      // Thời gian còn lại của key
    return new Promise((resolve,reject)=>{
        client.ttl(key, (err,result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

module.exports = {
    client,
    incr,
    expire,
    ttl
};