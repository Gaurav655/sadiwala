import React, { useState } from 'react';
import { Search, MapPin, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    const categories = [
        { name: 'Venues', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1084', span: 'md:col-span-2 md:row-span-2' },
        { name: 'Catering', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'Photography', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'DJ/Sound', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-2 md:row-span-1' },
        { name: 'Makeup Artist', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-2' },
        { name: 'Mehendi Artist', image: 'https://images.unsplash.com/photo-1590733526388-377395c9704e?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'Decorator', image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b33e?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'Pandit', image: 'https://images.unsplash.com/photo-1544717297-fa95b3ee21f3?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'Car Rental', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' },
        { name: 'Gifting', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=2070', span: 'md:col-span-1 md:row-span-1' }
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('category', searchQuery);
        if (city) params.append('city', city);
        navigate(`/search?${params.toString()}`);
    };

    const handleCategoryClick = (catName) => {
        navigate(`/search?category=${encodeURIComponent(catName)}`);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-premium-richBlack/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Luxury Wedding Background"
                />

                <div className="relative z-20 text-center text-white px-4 max-w-4xl">
                    <h2 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in-down">
                        Plan Your <span className="text-premium-lightGold italic">Dream Event</span> Hyperlocally.
                    </h2>
                    <p className="text-xl md:text-2xl font-light mb-12 text-white/90 drop-shadow-md">
                        The premium directory for Weddings, Birthdays, and Bespoke Parties.
                    </p>

                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/20 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 shadow-2xl transition-all duration-300">
                        <div className="flex-1 flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/50 transition-all">
                            <SearchIcon className="text-premium-gold mr-3 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="What are you planning? (Category)"
                                className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/50 transition-all">
                            <MapPin className="text-premium-gold mr-3 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="City or Area"
                                className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            className="bg-gradient-to-r from-[#D4AF37] to-[#F2D272] text-[#1A1A1A] px-10 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-300"
                            onClick={handleSearch}
                        >
                            Search Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Bento Grid Preview */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-playfair font-bold text-premium-charcoal mb-4">Explore by Category</h3>
                    <p className="text-gray-500 font-medium tracking-wide">Handpicked premium services for every occasion.</p>
                    <div className="w-24 h-1 bg-premium-gold mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`card-premium relative group cursor-pointer overflow-hidden ${cat.span || ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <div className="absolute inset-0 bg-premium-richBlack/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                            <img
                                src={cat.image}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt={cat.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex flex-col justify-end z-20">
                                {index === 0 && <span className="text-premium-gold font-bold text-sm mb-2 tracking-widest uppercase">Premium Venues</span>}
                                <h4 className="text-white text-2xl font-playfair font-bold group-hover:text-premium-lightGold transition-colors">
                                    {cat.name}
                                </h4>
                                <div className="w-0 group-hover:w-16 h-0.5 bg-premium-gold transition-all duration-500 mt-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
