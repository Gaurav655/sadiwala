import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Filter, Loader2, ArrowLeft } from 'lucide-react';
import VendorCard from '../components/VendorCard';
import { Link } from 'react-router-dom';

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [selectedTag, setSelectedTag] = useState('');

    const categories = ['Venues', 'Catering', 'Photography', 'Pandit', 'Car Rental', 'Mehendi Artist', 'Makeup Artist', 'Decorator', 'DJ/Sound', 'Gifting'];

    const tagMapping = {
        'Catering': ['Veg Only', 'Non-Veg', 'Buffet', 'High Tea'],
        'Venues': ['Indoor', 'Outdoor', 'Resort', 'Hotel', 'Barn'],
        'Photography': ['Pre-wedding', 'Wedding', 'Cinematic', 'Maternity'],
        'Makeup Artist': ['Bridal', 'Party', 'HD Makeup', 'Airbrush'],
        'Decoration': ['Floral', 'Theme Based', 'Minimalist']
    };

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/vendors`, {
                params: {
                    category: searchParams.get('category'),
                    city: searchParams.get('city')
                }
            });
            setVendors(response.data);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load vendors. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
        setSelectedTag(''); // Reset tag when category changes
    }, [searchParams]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (city) params.append('city', city);
        setSearchParams(params);
    };

    // Client-side tag filtering for "Instant" feel
    const filteredVendors = selectedTag
        ? vendors.filter(v => v.tags && v.tags.includes(selectedTag))
        : vendors;

    return (
        <div className="min-h-screen bg-premium-offWhite pb-24">
            {/* Search Header */}
            <div className="bg-premium-richBlack text-white pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <Link to="/" className="flex items-center gap-2 text-premium-gold hover:text-premium-lightGold transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">Back to Home</span>
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-5xl font-playfair font-bold mb-2">
                            Discovery <span className="text-premium-gold">Results</span>
                        </h2>
                        <p className="text-gray-400 font-medium">Find the perfect verified partners for your special day.</p>
                    </div>

                    <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-[1.5] relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-gold w-5 h-5" />
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold/30 transition-all appearance-none"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" className="text-black">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="text-black">{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-gold w-5 h-5" />
                            <input
                                type="text"
                                placeholder="City or Area"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold/30 transition-all"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-gradient-to-r from-premium-gold to-premium-lightGold text-premium-richBlack px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all active:scale-95">
                            Update Results
                        </button>
                    </form>

                    {/* Quick-Tags Section */}
                    {searchParams.get('category') && tagMapping[searchParams.get('category')] && (
                        <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mr-2">Quick Filters:</span>
                            {tagMapping[searchParams.get('category')].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${selectedTag === tag
                                        ? 'bg-premium-gold border-premium-gold text-premium-richBlack'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-premium-gold/50'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-3xl shadow-sm">
                        <Loader2 className="w-12 h-12 text-premium-gold animate-spin" />
                        <p className="text-gray-500 font-medium animate-pulse italic">Curating premium listings...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 p-12 rounded-3xl text-center">
                        <p className="text-red-700 font-bold mb-4 text-xl">{error}</p>
                        <p className="text-red-600/70 text-sm">Our concierge is currently unavailable. Please refresh or check back soon.</p>
                    </div>
                ) : filteredVendors.length > 0 ? (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                            <p className="text-premium-charcoal font-medium">
                                Found <span className="font-black text-2xl text-premium-gold mx-1">{filteredVendors.length}</span>
                                verified partners in {searchParams.get('city') || 'selected locations'}
                            </p>
                            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">Sorted By</span>
                                <select className="bg-transparent text-xs font-bold text-premium-charcoal outline-none cursor-pointer">
                                    <option>Most Exclusive</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredVendors.map(vendor => (
                                <VendorCard key={vendor._id} vendor={vendor} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50">
                        <div className="w-32 h-32 bg-premium-offWhite rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-premium-gold/10 rounded-full animate-ping"></div>
                            <Search className="w-12 h-12 text-premium-gold relative z-10" />
                        </div>
                        <h3 className="text-3xl font-playfair font-black text-premium-charcoal mb-4">No exclusive matches found</h3>
                        <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                            We haven't found any vendors matching <span className="text-premium-gold font-bold">"{selectedTag || searchParams.get('category')}"</span> in this location yet. <br /> Try broadening your search or exploring other categories.
                        </p>
                        <button
                            onClick={() => { setCategory(''); setCity(''); setSelectedTag(''); setSearchParams({}) }}
                            className="bg-premium-richBlack text-white px-10 py-4 rounded-2xl font-bold hover:bg-premium-gold transition-all shadow-lg hover:shadow-premium-gold/20"
                        >
                            Explore All Vendors
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
