const mongoose = require('mongoose');
require('dotenv').config();
const Vendor = require('./models/Vendor');

const seedTags = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const vendors = await Vendor.find({});
        for (let vendor of vendors) {
            let tags = [];
            if (vendor.category === 'Catering') {
                tags = ['Veg Only', 'Non-Veg', 'Buffet'];
            } else if (vendor.category === 'Venues') {
                tags = ['Indoor', 'Outdoor', 'Resort'];
            } else if (vendor.category === 'Photography') {
                tags = ['Pre-wedding', 'Wedding', 'Cinematic'];
            } else {
                tags = ['Premium', 'Verified', 'Quick Response'];
            }

            vendor.tags = tags;
            await vendor.save();
            console.log(`Updated tags for ${vendor.businessName}`);
        }

        console.log('Tags seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding tags:', error);
        process.exit(1);
    }
};

seedTags();
