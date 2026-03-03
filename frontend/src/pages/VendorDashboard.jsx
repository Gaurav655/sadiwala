import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Clock, CheckCircle, XCircle, Eye, Settings, LogOut, Package, Star, MessageSquare } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const VendorDashboard = () => {
    const { user, isLoaded: userLoaded } = useUser();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userLoaded && user) {
            fetchMyVendor();
        } else if (userLoaded && !user) {
            setLoading(false);
            setError('Please login to view your dashboard.');
        }
    }, [userLoaded, user]);

    const fetchMyVendor = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/vendors/me?clerkId=${user.id}`);
            setVendor(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.status === 404 ? 'No vendor profile found.' : 'Failed to fetch dashboard data.');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold font-playfair"></div>
        </div>
    );

    if (error === 'No vendor profile found.') {
        return (
            <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col items-center justify-center p-6 pt-24">
                <Package className="w-16 h-16 text-gray-700 mb-6" />
                <h2 className="text-3xl font-playfair font-bold mb-4">No Business Profile Yet</h2>
                <p className="text-gray-400 mb-8 max-w-md text-center">Ready to grow your business? Create your luxury listing on Sadiwala.com today.</p>
                <a href="/vendor/register" className="bg-gradient-to-r from-[#D4AF37] to-[#F2D272] text-[#1A1A1A] px-10 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                    Register Your Business
                </a>
            </div>
        );
    }

    const StatusBadge = ({ status }) => {
        if (status === 'approved') return (
            <span className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-tighter">
                <CheckCircle size={14} /> Live & Approved
            </span>
        );
        if (status === 'rejected') return (
            <span className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-tighter">
                <XCircle size={14} /> Action Required
            </span>
        );
        return (
            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-tighter">
                <Clock size={14} /> Under Review
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white">
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111111] border-r border-white/5 pt-24 px-4 hidden lg:block">
                <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gold/10 text-gold rounded-xl font-bold shadow-[inset_0_0_10px_rgba(212,175,55,0.05)]">
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <Eye size={20} /> View Listing
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <MessageSquare size={20} /> Inquiries
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <Settings size={20} /> Settings
                    </button>
                </nav>
                <div className="absolute bottom-8 left-4 right-4">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/5 rounded-xl font-medium transition-colors">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 pt-24 px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-playfair font-bold mb-2">Hello, {vendor.businessName}</h1>
                            <p className="text-gray-500">Manage your business profile and track performance</p>
                        </div>
                        <StatusBadge status={vendor.status} />
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Profile Views', val: '1,284', icon: <Eye className="text-blue-400" /> },
                            { label: 'Avg. Rating', val: '4.9', icon: <Star className="text-yellow-400 fill-yellow-400" /> },
                            { label: 'Inquiries', val: '12', icon: <MessageSquare className="text-gold" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <p className="text-3xl font-playfair font-bold">{stat.val}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* Current Listing Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-all group">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="h-64 lg:h-auto overflow-hidden">
                                <img
                                    src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt="listing"
                                />
                            </div>
                            <div className="p-8 md:p-12 space-y-6">
                                <div>
                                    <p className="text-gold text-sm font-bold tracking-widest uppercase mb-2">{vendor.category}</p>
                                    <h2 className="text-3xl font-playfair font-bold mb-4">{vendor.businessName}</h2>
                                    <p className="text-gray-400 line-clamp-3">{vendor.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Location</p>
                                        <p className="text-sm">{vendor.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Starting From</p>
                                        <p className="text-sm font-bold text-gold">₹{vendor.startingPrice.amount} <span className="text-gray-600 font-normal">/{vendor.startingPrice.unit}</span></p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button className="bg-gradient-to-r from-[#D4AF37] to-[#F2D272] text-[#1A1A1A] px-10 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
                                        Edit Full Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Alert */}
                    {vendor.status === 'rejected' && (
                        <div className="mt-12 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl flex gap-4">
                            <XCircle className="text-red-500 shrink-0" />
                            <div>
                                <h4 className="text-lg font-bold text-red-200 mb-1">Listing Rejected</h4>
                                <p className="text-red-200/70 text-sm">
                                    Your listing was not approved for the following reason: <span className="text-white italic underline">"{vendor.rejectionReason || 'Incomplete business information'}"</span>. Please update your profile to resubmit for review.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
