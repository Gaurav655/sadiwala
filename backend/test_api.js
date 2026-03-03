const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/vendors?category=Photography',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('api_test_result.txt', `STATUS: ${res.statusCode}\nBODY: ${data}`);
        process.exit(0);
    });
});

req.on('error', (e) => {
    fs.writeFileSync('api_test_result.txt', `ERROR: ${e.message}`);
    process.exit(1);
});

req.end();
