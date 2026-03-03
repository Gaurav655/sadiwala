const mongoose = require('mongoose');
const fs = require('fs');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to resolve SRV records
dns.setServers(['8.8.8.8']);

const LOG_FILE = 'diag_log.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function start() {
    fs.writeFileSync(LOG_FILE, 'DIAGNOSTIC START\n');
    log('MONGODB_URI present: ' + !!process.env.MONGODB_URI);
    if (!process.env.MONGODB_URI) {
        log('ERROR: MONGODB_URI missing');
        process.exit(1);
    }

    try {
        log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        log('CONNECTED SUCCESS');
        const count = await mongoose.connection.db.collection('vendors').countDocuments();
        log('Vendor Count: ' + count);
    } catch (err) {
        log('ERROR: ' + err.message);
    } finally {
        await mongoose.connection.close();
        log('DIAGNOSTIC END');
        process.exit(0);
    }
}

start();
