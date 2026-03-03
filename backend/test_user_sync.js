const axios = require('axios');

const testSync = async () => {
    try {
        const payload = {
            clerkId: 'test_clerk_999',
            email: 'gauravkesh.tech@gmail.com', // Admin email
            firstName: 'Gaurav',
            lastName: 'Kesharwani',
            imageUrl: 'https://example.com/image.jpg'
        };

        console.log('Testing User Sync with Admin Email...');
        const response = await axios.post('http://localhost:5000/api/users/sync', payload);
        console.log('Response:', JSON.stringify(response.data, null, 2));

        if (response.data.user.role === 'admin') {
            console.log('✅ Admin role correctly assigned!');
        } else {
            console.log('❌ Admin role NOT assigned!');
        }

        const userPayload = {
            clerkId: 'test_clerk_111',
            email: 'user@example.com',
            firstName: 'Regular',
            lastName: 'User'
        };

        console.log('\nTesting User Sync with Regular Email...');
        const res2 = await axios.post('http://localhost:5000/api/users/sync', userPayload);
        console.log('Response:', JSON.stringify(res2.data, null, 2));

        if (res2.data.user.role === 'user') {
            console.log('✅ Regular user role correctly assigned!');
        } else {
            console.log('❌ Regular user role NOT assigned!');
        }

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
};

testSync();
