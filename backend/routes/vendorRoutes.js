const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// @route   GET /api/vendors
// @desc    Get all approved vendors with filters
router.get('/', vendorController.getVendors);

// @route   GET /api/vendors/me
// @desc    Get current user's vendor profile
router.get('/me', (req, res, next) => {
    console.log('--- Vendor Me Route Hit ---');
    vendorController.getMyVendorProfile(req, res, next);
});

// @route   GET /api/vendors/upload-signature
// @desc    Get signature for Cloudinary upload
router.get('/upload-signature', vendorController.getUploadSignature);

// @route   POST /api/vendors
// @desc    Register a new vendor
router.post('/', vendorController.createVendor);

// @route   GET /api/vendors/:id
// @desc    Get vendor by ID
router.get('/:id', vendorController.getVendorById);

module.exports = router;
