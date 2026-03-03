const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// @route   POST /api/users/sync
// @desc    Sync user from Clerk to MongoDB
router.post('/sync', (req, res, next) => {
    console.log('--- User Sync Route Hit ---');
    userController.syncUser(req, res, next);
});

// @route   GET /api/users/profile
// @desc    Get current user profile by Clerk ID
router.get('/profile', userController.getUserProfile);

module.exports = router;
