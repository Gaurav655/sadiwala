const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Venues', 'Catering', 'Photography', 'Pandit', 'Car Rental', 'Mehendi Artist', 'Makeup Artist', 'Decorator', 'DJ/Sound', 'Gifting']
  },
  description: { type: String, required: true },
  city: { type: String, required: true, index: true },
  address: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number
  },
  startingPrice: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  images: [{ type: String }],
  contact: {
    whatsapp: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  socials: {
    instagram: { type: String },
    facebook: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  isVerified: { type: Boolean, default: false },
  tags: [{ type: String }],
  clerkId: { type: String, required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
