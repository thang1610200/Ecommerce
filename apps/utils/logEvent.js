const fs = require('fs').promises;
const path = require('path');
const {format} = require('date-fns')

const filename = path.join(__dirname, '../log','logs.log');

const logEvent = async (msg) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`;
    const contentLog = `${dateTime}==============${msg}\n`;
    try{
        fs.appendFile(filename,contentLog);
    }
    catch(err){
        console.error(err);
    }
}

module.exports = logEvent;