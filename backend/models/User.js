const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    savedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
