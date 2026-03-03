const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// @route   GET /api/admin/pending
// @desc    Get all pending vendors
router.get('/pending', adminController.getPendingVendors);

// @route   PATCH /api/admin/vendors/:id/status
// @desc    Approve or reject a vendor
router.patch('/vendors/:id/status', adminController.updateVendorStatus);

// @route   DELETE /api/admin/vendors/:id
// @desc    Delete a vendor
router.delete('/vendors/:id', adminController.deleteVendor);

module.exports = router;
