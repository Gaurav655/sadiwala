const User = require('../models/User');

// Create or update user from Clerk sync
exports.syncUser = async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName, imageUrl } = req.body;

        if (!clerkId) {
            return res.status(400).json({ message: 'Clerk ID is required' });
        }

        // Hard-coded admin condition
        let role = 'user';
        if (email === 'gauravkesh.tech@gmail.com') {
            role = 'admin';
        }

        const userData = {
            clerkId,
            role,
            // We can expand these fields if we update the model later
        };

        const user = await User.findOneAndUpdate(
            { clerkId },
            userData,
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'User synced successfully',
            user
        });
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({ message: 'Error syncing user', error: error.message });
    }
};

// Get current user profile and role
exports.getUserProfile = async (req, res) => {
    try {
        const { clerkId } = req.query;
        if (!clerkId) {
            return res.status(400).json({ message: 'Clerk ID is required' });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};
