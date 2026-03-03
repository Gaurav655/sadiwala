const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const dotenv = require('dotenv');
const fs = require('fs');

// 1. Force Google DNS for Atlas SRV
dns.setServers(['8.8.8.8']);

const LOG_FILE = 'backend_status.log';
function logFile(msg) {
    const time = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${time}] ${msg}\n`);
    console.log(msg);
}

logFile('--- New Startup ---');

// 2. Load environment variables
dotenv.config();
logFile(`MONGODB_URI present: ${!!process.env.MONGODB_URI}`);

// Disable buffering so we get real errors immediately instead of 10s hangs
mongoose.set('bufferCommands', false);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Debug Middleware: Log readyState on every request
app.use((req, res, next) => {
    logFile(`${req.method} ${req.url} - DB State: ${mongoose.connection.readyState}`);
    next();
});

// Connection Listeners
mongoose.connection.on('connected', () => logFile('Mongoose: Connected to DB'));
mongoose.connection.on('error', (err) => logFile(`Mongoose: Connection error: ${err.message}`));
mongoose.connection.on('disconnected', () => logFile('Mongoose: Disconnected from DB'));

// Routes (Deferred require to ensure Mongoose is initialized)
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name
    });
});

// Catch-all for unmatched routes
app.use((req, res) => {
    logFile(`404 Fallthrough: ${req.method} ${req.url}`);
    res.status(404).send(`Route ${req.method} ${req.url} not found on this server`);
});

// 3. Connect and Start
const URI = process.env.MONGODB_URI;
// Ensure we specify 'test' database if not present
const finalURI = URI.includes('.net/') && !URI.includes('.net/test') && !URI.includes('.net/?')
    ? URI.replace('.net/', '.net/test')
    : URI;

logFile(`Connecting to: ${finalURI.substring(0, 30)}...`);

mongoose.connect(finalURI, {
    serverSelectionTimeoutMS: 20000,
})
    .then(() => {
        logFile('✅ MongoDB initial connect success');
        app.listen(PORT, '0.0.0.0', () => {
            logFile(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        logFile(`❌ MongoDB initial connect failure: ${err.message}`);
        process.exit(1);
    });
