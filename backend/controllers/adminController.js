const Vendor = require('../models/Vendor');

// Get all vendors with 'pending' status
exports.getPendingVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending vendors', error: error.message });
    }
};

// Update vendor status (approve/reject)
exports.updateVendorStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updateData = { status };
        if (rejectionReason) updateData.rejectionReason = rejectionReason;
        if (status === 'approved') updateData.isVerified = true;

        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({ message: `Vendor ${status} successfully`, vendor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating vendor status', error: error.message });
    }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vendor', error: error.message });
    }
};
