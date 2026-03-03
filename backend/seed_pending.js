const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8']);

const seedPending = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const newVendor = new Vendor({
            businessName: "Test Pending Vendor",
            category: "Photography",
            description: "A trial vendor waiting for approval.",
            city: "Mumbai",
            address: "Marine Drive",
            startingPrice: { amount: 1000, unit: "per hour" },
            images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
            contact: { whatsapp: "9999999999", phone: "9999999999" },
            status: "pending",
            clerkId: "user_test_admin"
        });

        await newVendor.save();
        console.log('✅ Pending Vendor Seeded!');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seedPending();
