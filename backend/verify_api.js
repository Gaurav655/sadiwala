const axios = require('axios');

async function verify() {
    try {
        const res = await axios.get('http://localhost:5000/api/vendors', {
            params: { category: 'Photography' }
        });
        console.log('API Status:', res.status);
        console.log('Vendors found:', res.data.length);
        if (res.data.length > 0) {
            console.log('First vendor:', res.data[0].businessName);
        } else {
            console.log('No vendors found. Check if seed.js worked.');
        }
    } catch (err) {
        console.error('API Verification Failed:', err.message);
    }
}

verify();
