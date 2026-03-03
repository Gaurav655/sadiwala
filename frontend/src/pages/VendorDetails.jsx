import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    MapPin,
    MessageCircle,
    Share2,
    CheckCircle,
    ArrowLeft,
    Star,
    Image as ImageIcon,
    ExternalLink,
    PhoneCall,
    Info
} from 'lucide-react';

const VendorDetails = () => {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/vendors/${id}`);
                setVendor(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching vendor:', err);
                setError('Vendor not found or server error.');
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    const handleWhatsAppInquiry = () => {
        const message = encodeURIComponent(`Hi ${vendor.businessName}, I found your profile on Sadiwala.com and I'm interested in your ${vendor.category} services. Could you please provide more details?`);
        window.open(`https://wa.me/${vendor.contact.whatsapp}?text=${message}`, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${vendor.businessName} on Sadiwala.com`,
                text: `Check out this premium ${vendor.category} on Sadiwala: ${vendor.businessName}`,
                url: window.location.href,
            });
        } else {
            const message = encodeURIComponent(`Check out this premium ${vendor.category} on Sadiwala: ${vendor.businessName} - ${window.location.href}`);
            window.open(`https://wa.me/?text=${message}`, '_blank');
        }
    };

    const handleViewOnMaps = () => {
        const query = encodeURIComponent(`${vendor.businessName} ${vendor.city} ${vendor.address}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    if (loading) return (
        <div className="min-h-screen bg-premium-offWhite flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-premium-gold"></div>
        </div>
    );

    if (error || !vendor) return (
        <div className="min-h-screen bg-premium-offWhite flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-playfair font-bold text-premium-charcoal mb-4">Oops! Listing Not Found</h2>
            <p className="text-gray-500 mb-8">The vendor you're looking for might have moved or is no longer listed.</p>
            <Link to="/search" className="btn-premium px-8">Back to Discovery</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-premium-offWhite pb-24">
            {/* Navigation Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <Link to="/search" className="flex items-center gap-2 text-premium-charcoal hover:text-premium-gold transition-colors font-medium">
                    <ArrowLeft size={20} /> Back
                </Link>
                <div className="flex gap-4">
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-premium-charcoal">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Media & Description */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Image Gallery */}
                        <div className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-gray-200/50">
                            <div className="relative aspect-[16/9] w-full">
                                <img
                                    src={vendor.images?.[activeImage] || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070'}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    alt={vendor.businessName}
                                />
                                {vendor.status === 'approved' && (
                                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                        <CheckCircle size={18} className="text-green-500 fill-green-500/20" />
                                        <span className="text-sm font-bold tracking-tight text-premium-charcoal">VERIFIED PARTNER</span>
                                    </div>
                                )}
                                <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                    <ImageIcon size={14} /> {activeImage + 1} / {vendor.images?.length || 1}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {vendor.images?.length > 1 && (
                                <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar border-t border-gray-50">
                                    {vendor.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all ${activeImage === idx ? 'ring-2 ring-premium-gold ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-playfair font-bold text-premium-charcoal mb-6 flex items-center gap-3">
                                <Info className="text-premium-gold" />
                                About the Business
                            </h3>
                            <div className="prose prose-premium max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {vendor.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Contact Sticky */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-28 space-y-6">
                            {/* Main Info Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200 border border-gray-100">
                                <div className="mb-6">
                                    <p className="text-premium-gold text-sm font-bold tracking-[0.2em] uppercase mb-2">{vendor.category}</p>
                                    <h1 className="text-4xl font-playfair font-bold text-premium-charcoal leading-tight mb-2 tracking-tight">{vendor.businessName}</h1>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin size={16} className="text-premium-gold" />
                                        <span className="font-medium">{vendor.city}</span>
                                    </div>
                                </div>

                                <div className="py-6 border-y border-gray-100 mb-8">
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Starting From</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-playfair font-bold text-premium-charcoal">₹{vendor.startingPrice.amount.toLocaleString()}</span>
                                        <span className="text-gray-500 font-medium">/{vendor.startingPrice.unit}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleWhatsAppInquiry}
                                        className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1fb355] transition-all shadow-lg shadow-green-200/50 hover:scale-[1.02] active:scale-95"
                                    >
                                        <MessageCircle fill="currentColor" /> Inquiry Now
                                    </button>
                                    <button
                                        onClick={handleViewOnMaps}
                                        className="w-full bg-white text-premium-charcoal border border-gray-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:border-premium-gold/30"
                                    >
                                        <ExternalLink size={20} className="text-premium-gold" /> View on Maps
                                    </button>
                                </div>
                            </div>

                            {/* Trust Factors Card */}
                            <div className="bg-premium-richBlack text-white rounded-3xl p-8 space-y-6 overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 opacity-10">
                                    <Star size={120} className="fill-white" />
                                </div>
                                <h4 className="text-lg font-playfair font-bold flex items-center gap-2 relative z-10">
                                    Why choose this vendor?
                                </h4>
                                <ul className="space-y-4 relative z-10">
                                    <li className="flex gap-3 text-sm text-gray-400">
                                        <CheckCircle size={18} className="text-premium-gold shrink-0" />
                                        <span>Identity and business address verified by Sadiwala team.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-400">
                                        <CheckCircle size={18} className="text-premium-gold shrink-0" />
                                        <span>Premium quality standards for service and delivery.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-400">
                                        <CheckCircle size={18} className="text-premium-gold shrink-0" />
                                        <span>Quick response time and transparent pricing.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 lg:hidden z-50 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                    <MessageCircle fill="currentColor" /> Chat Now
                </button>
                <a
                    href={`tel:${vendor.contact.phone}`}
                    className="bg-premium-richBlack text-white p-4 rounded-2xl active:scale-95 transition-transform"
                >
                    <PhoneCall size={24} />
                </a>
            </div>

            {/* Global Floating WhatsApp (Desktop) */}
            <button
                onClick={handleWhatsAppInquiry}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl items-center justify-center hidden lg:flex hover:scale-110 active:scale-90 transition-all z-50 animate-bounce-slow"
                title="Quick WhatsApp Inquiry"
            >
                <MessageCircle fill="currentColor" size={32} />
            </button>
        </div>
    );
};

export default VendorDetails;
