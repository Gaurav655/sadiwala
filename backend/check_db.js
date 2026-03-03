const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Vendor.countDocuments();
        console.log(`Total vendors in DB: ${count}`);
        const vendors = await Vendor.find().limit(2);
        console.log("Sample vendors:", JSON.stringify(vendors, null, 2));
    } catch (error) {
        console.error("Error checking DB:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

checkDB();
