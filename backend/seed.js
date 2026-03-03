const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8']);

const vendors = [
    {
        businessName: "Grand Palace Ballroom",
        category: "Venues",
        description: "A luxury ballroom for grand weddings and corporate events.",
        city: "New Delhi",
        address: "MG Road, South Delhi",
        startingPrice: { amount: 1500, unit: "per plate" },
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3"],
        contact: { whatsapp: "9999999999", phone: "9999999999" },
        status: "approved",
        isVerified: true,
        clerkId: "user_1"
    },
    {
        businessName: "Shine Makeup Studio",
        category: "Makeup Artist",
        description: "Expert bridal makeup and party styling.",
        city: "Mumbai",
        address: "Andheri West",
        startingPrice: { amount: 15000, unit: "per session" },
        images: ["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2"],
        contact: { whatsapp: "8888888888", phone: "8888888888" },
        status: "approved",
        isVerified: true,
        clerkId: "user_2"
    },
    {
        businessName: "Capture Moments",
        category: "Photography",
        description: "Candid wedding photography and cinematography.",
        city: "New Delhi",
        address: "Vasant Vihar",
        startingPrice: { amount: 50000, unit: "per day" },
        images: ["https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8"],
        contact: { whatsapp: "7777777777", phone: "7777777777" },
        status: "approved",
        isVerified: true,
        clerkId: "user_3"
    },
    {
        businessName: "Royal Car Rentals",
        category: "Car Rental",
        description: "Luxury cars for wedding processions and guests.",
        city: "Mumbai",
        address: "Bandra",
        startingPrice: { amount: 10000, unit: "per day" },
        images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70"],
        contact: { whatsapp: "6666666666", phone: "6666666666" },
        status: "approved",
        isVerified: true,
        clerkId: "user_4"
    },
    {
        businessName: "Ganesh Pandit Ji",
        category: "Pandit",
        description: "Experienced vedic priests for all wedding rituals.",
        city: "New Delhi",
        address: "Gurgaon",
        startingPrice: { amount: 5000, unit: "per event" },
        images: ["https://images.unsplash.com/photo-1544717297-fa95b3ee21f3"],
        contact: { whatsapp: "5555555555", phone: "5555555555" },
        status: "pending",
        isVerified: false,
        clerkId: "user_5"
    }
];

const seedDB = async () => {
    console.log("Starting seed process...");
    if (!process.env.MONGODB_URI) {
        console.error("ERROR: MONGODB_URI is not defined in .env file.");
        process.exit(1);
    }

    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        console.log("Connected to DB successfully.");

        console.log("Clearing existing vendors...");
        await Vendor.deleteMany({});

        console.log(`Inserting ${vendors.length} vendors...`);
        await Vendor.insertMany(vendors);
        console.log("Database Seeded Successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    } finally {
        console.log("Closing connection...");
        await mongoose.connection.close();
        console.log("Process complete.");
        process.exit(0);
    }
};

seedDB();
