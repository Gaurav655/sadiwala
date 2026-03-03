const mongoose = require('mongoose');
const fs = require('fs');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8']);

const LOG_FILE = 'diag_results.txt';
fs.writeFileSync(LOG_FILE, 'DEEP DIAG START\n');
function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function check() {
    log('Attempting connection...');
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
        log('CONNECTED');

        // Check current DB name
        log('Current DB: ' + mongoose.connection.name);

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        log('Collections: ' + collections.map(c => c.name).join(', '));

        // Check if vendors collection exists and has data
        if (collections.find(c => c.name === 'vendors')) {
            const count = await mongoose.connection.db.collection('vendors').countDocuments();
            log('Vendor Count: ' + count);
            if (count > 0) {
                const sample = await mongoose.connection.db.collection('vendors').findOne();
                log('Sample Vendor: ' + sample.businessName + ' Status: ' + sample.status);
            }
        } else {
            log('ERROR: "vendors" collection not found!');
        }
    } catch (err) {
        log('CONNECTION ERROR: ' + err.message);
    } finally {
        await mongoose.connection.close();
        log('DEEP DIAG END');
        process.exit(0);
    }
}

check();
