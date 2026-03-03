import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Trash2, Clock, MapPin, Tag } from 'lucide-react';

const AdminDashboard = () => {
    const [pendingVendors, setPendingVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingVendors();
    }, []);

    const fetchPendingVendors = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/admin/pending`);
            setPendingVendors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch pending vendors.');
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        // 1. Get the status value
        const status = action === 'approve' ? 'approved' : 'rejected';

        try {
            // 2. Use the environment variable for the URL
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            if (action === 'delete') {
                if (!window.confirm('Are you sure you want to delete this vendor? This action is irreversible.')) return;
                await axios.delete(`${API_URL}/api/admin/vendors/${id}`);
                alert('Vendor deleted successfully.');
            } else {
                await axios.patch(`${API_URL}/api/admin/vendors/${id}/status`, {
                    status: status
                });

                // 3. Logic to remove the item from local state immediately for a "snappy" feel
                setPendingVendors(prev => prev.filter(v => v._id !== id));

                // 4. (Optional) Replace alert with a toast later
                console.log(`Vendor ${id} set to ${status}`);
            }
        } catch (err) {
            console.error('Action failed:', err);
            // Error handling remains important
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-premium-offWhite flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-premium-gold"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-premium-offWhite text-premium-charcoal pt-24 px-6 pb-24">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 animate-fade-in-down">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px w-12 bg-premium-gold"></div>
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-premium-gold">Management Console</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-playfair font-black text-premium-richBlack mb-4">
                        Admin <span className="text-premium-gold italic">Control</span> Center
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl">
                        Review, verify, and curate the most exclusive wedding service providers in the region.
                    </p>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-12 animate-fade-in flex items-center gap-4 shadow-sm">
                        <XCircle className="shrink-0" />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {pendingVendors.length === 0 ? (
                    <div className="card-premium p-20 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-premium-offWhite rounded-full flex items-center justify-center mx-auto mb-8 relative border border-gray-100 shadow-inner">
                            <Clock className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-3xl font-playfair font-black mb-4 text-premium-richBlack">Verification Queue Empty</h3>
                        <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
                            There are currently no elite partners waiting for verification. All systems are up to date.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {pendingVendors.map((vendor, index) => (
                            <div
                                key={vendor._id}
                                className="card-premium group hover:border-premium-gold/30 flex flex-col lg:flex-row items-center gap-8 p-4 lg:p-6 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-full lg:w-72 h-52 shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                                    {vendor.images && vendor.images.length > 0 ? (
                                        <img
                                            src={vendor.images[0]}
                                            alt={vendor.businessName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-premium-richBlack flex items-center justify-center">
                                            <Tag className="text-premium-gold/30 w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-premium-gold shadow-lg flex items-center gap-1.5 border border-premium-gold/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse"></div>
                                            Awaiting Verification
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 py-2">
                                    <div>
                                        <h2 className="text-3xl font-playfair font-bold text-premium-richBlack group-hover:text-premium-gold transition-colors duration-300 mb-1">{vendor.businessName}</h2>
                                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Tag size={14} className="text-premium-gold" /> {vendor.category}
                                            </div>
                                            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-premium-gold" /> {vendor.city}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-base leading-relaxed line-clamp-2 max-w-3xl italic">
                                        "{vendor.description}"
                                    </p>

                                    <div className="flex items-center gap-6 pt-2">
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Price Range</p>
                                            <p className="text-lg font-playfair font-bold text-premium-richBlack">
                                                ₹{vendor.startingPrice.amount.toLocaleString()} <span className="text-xs font-medium text-gray-400 italic">/{vendor.startingPrice.unit}</span>
                                            </p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-100"></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Contact Method</p>
                                            <p className="text-sm font-bold text-premium-charcoal">{vendor.contact.whatsapp}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
                                    <button
                                        onClick={() => handleAction(vendor._id, 'approve')}
                                        className="flex-1 bg-premium-richBlack hover:bg-premium-gold text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-premium-gold/20 active:scale-95 group/btn"
                                    >
                                        <CheckCircle size={18} className="text-premium-gold group-hover/btn:text-white transition-colors" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(vendor._id, 'reject')}
                                        className="flex-1 bg-white border border-gray-100 hover:border-red-500/50 hover:bg-red-50 text-gray-400 hover:text-red-600 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(vendor._id, 'delete')}
                                        className="h-14 w-14 lg:w-full bg-gray-50 hover:bg-red-600 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
