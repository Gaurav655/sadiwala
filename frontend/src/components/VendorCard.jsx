import { MapPin, Star, MessageCircle, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function VendorCard({ vendor }) {
    const {
        _id,
        businessName,
        category,
        city,
        startingPrice,
        images,
        isVerified,
        description
    } = vendor;

    const mainImage = images && images.length > 0
        ? images[0]
        : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070';

    return (
        <Link to={`/vendor/${_id}`} className="card-premium group block overflow-hidden bg-white shadow-xl hover:shadow-gold-gradient/20 transition-all duration-500">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={mainImage}
                    alt={businessName}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {isVerified && (
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-premium-gold" />
                            <span className="text-xs font-bold text-premium-charcoal uppercase tracking-wider">Verified</span>
                        </div>
                    )}
                    <div className="bg-premium-gold/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {category}
                    </div>
                </div>

                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all duration-300">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-playfair font-bold text-premium-charcoal group-hover:text-premium-gold transition-colors truncate flex-1">
                        {businessName}
                    </h3>
                    <div className="flex items-center gap-1 bg-premium-lightGold/20 px-2 py-1 rounded text-premium-darkGold">
                        <Star className="w-3.5 h-3.5 fill-premium-darkGold" />
                        <span className="text-xs font-bold">4.8</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 mb-4 text-sm">
                    <MapPin className="w-4 h-4 text-premium-gold" />
                    <span>{city}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
                    {description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-widest block">Starting From</span>
                        <span className="text-xl font-playfair font-black text-premium-charcoal">
                            ₹{startingPrice.amount.toLocaleString()}
                            <span className="text-sm font-normal text-gray-500 ml-1 italic">{startingPrice.unit}</span>
                        </span>
                    </div>
                    <button className="bg-premium-charcoal text-white p-3 rounded-xl hover:bg-premium-gold transition-all duration-300 transform group-hover:translate-x-1">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default VendorCard;
