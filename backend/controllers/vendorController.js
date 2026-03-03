const Vendor = require('../models/Vendor');

// Get all vendors with optional city and category filters
exports.getVendors = async (req, res) => {
    try {
        const { city, category, tag } = req.query;
        let query = { status: 'approved' }; // Only show approved vendors to public

        if (city) {
            query.city = { $regex: new RegExp(city, 'i') };
        }

        if (category) {
            query.category = category;
        }

        if (tag) {
            query.tags = tag;
        }

        const vendors = await Vendor.find(query).sort({ createdAt: -1 });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors', error: error.message });
    }
};

// Get single vendor by ID
exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor details', error: error.message });
    }
};

// Create new vendor registration
exports.createVendor = async (req, res) => {
    try {
        const { businessName, category, description, city, address, startingPrice, images, contact, socials, clerkId } = req.body;

        // Check if vendor already exists for this clerkId
        const existingVendor = await Vendor.findOne({ clerkId });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor profile already exists for this user.' });
        }

        const vendor = new Vendor({
            businessName,
            category,
            description,
            city,
            address,
            startingPrice,
            images,
            contact,
            socials,
            clerkId,
            status: 'pending' // Always start as pending
        });

        await vendor.save();
        res.status(201).json({ message: 'Vendor registration submitted successfully!', vendor });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vendor profile', error: error.message });
    }
};

// Get vendor profile for logged in user
exports.getMyVendorProfile = async (req, res) => {
    try {
        const { clerkId } = req.query; // For now using query param, in production this would come from auth middleware
        if (!clerkId) {
            return res.status(400).json({ message: 'Clerk ID is required' });
        }

        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor profile', error: error.message });
    }
};

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get Cloudinary Signature for signed uploads
exports.getUploadSignature = (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder: 'sadiwala_vendors' },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating upload signature', error: error.message });
    }
};
