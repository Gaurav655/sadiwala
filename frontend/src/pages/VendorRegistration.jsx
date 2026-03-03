import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, MessageSquare, IndianRupee, Image as ImageIcon, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const CATEGORIES = ['Venues', 'Catering', 'Photography', 'Pandit', 'Car Rental', 'Mehendi Artist', 'Makeup Artist', 'Decorator', 'DJ/Sound', 'Gifting'];

const VendorRegistration = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        description: '',
        city: '',
        address: '',
        startingPrice: { amount: '', unit: 'per event' },
        contact: { whatsapp: '', phone: '', email: '' },
        socials: { instagram: '', facebook: '' },
        images: [],
        clerkId: user?.id || ''
    });

    // Update clerkId if user loads late
    React.useEffect(() => {
        if (user?.id) {
            setFormData(prev => ({ ...prev, clerkId: user.id }));
        }
    }, [user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data: sigData } = await axios.get(`${API_URL}/api/vendors/upload-signature`);

            const uploadedUrls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', sigData.apiKey);
                formData.append('timestamp', sigData.timestamp);
                formData.append('signature', sigData.signature);
                formData.append('folder', 'sadiwala_vendors');

                const url = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
                const { data: cloudRes } = await axios.post(url, formData);
                uploadedUrls.push(cloudRes.secure_url);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 5)
            }));
        } catch (err) {
            setError('Image upload failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/vendors`, formData);
            alert('Registration Successful! Redirecting to your dashboard...');
            navigate('/vendor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12 px-4 selection:bg-gold selection:text-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1A1A1A] mb-3">Register Your Business</h1>
                    <p className="text-gray-600 max-w-lg mx-auto">Join India's most premium wedding service directory and start growing your reach.</p>
                </div>

                {/* Progress Header */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="flex justify-between mb-4 px-2">
                        {['Basic Info', 'Details & Pricing', 'Contact & Images'].map((label, i) => (
                            <span key={i} className={`text-xs font-bold uppercase tracking-wider ${step >= i + 1 ? 'text-gold' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        ))}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gold transition-all duration-500 ease-out shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Sidebar info (Desktop only) */}
                        <div className="hidden md:flex md:col-span-4 bg-[#1A1A1A] p-10 flex-col justify-between text-white border-r border-gray-100">
                            <div>
                                <Building2 className="w-10 h-10 text-gold mb-6" />
                                <h3 className="text-2xl font-playfair font-bold mb-4">Why list with us?</h3>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li className="flex gap-3"><CheckCircle2 className="text-gold shrink-0 w-5 h-5" /> Targeted reach to couples</li>
                                    <li className="flex gap-3"><CheckCircle2 className="text-gold shrink-0 w-5 h-5" /> Premium listing placement</li>
                                    <li className="flex gap-3"><CheckCircle2 className="text-gold shrink-0 w-5 h-5" /> 0% commission on leads</li>
                                </ul>
                            </div>
                            <div className="text-xs text-gray-500">
                                Need help? Email us at partners@sadiwala.com
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="md:col-span-8 p-8 md:p-12">
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3 animate-shake">
                                        <XCircle2 className="shrink-0 w-5 h-5" />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-playfair font-bold text-[#1A1A1A] mb-6">Basic Information</h2>
                                        <div>
                                            <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Business Name</label>
                                            <input
                                                type="text" name="businessName" value={formData.businessName} onChange={handleChange} required
                                                className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                placeholder="e.g. Royal Jaipur Weddings"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Category</label>
                                            <select
                                                name="category" value={formData.category} onChange={handleChange} required
                                                className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all"
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Description</label>
                                            <textarea
                                                name="description" value={formData.description} onChange={handleChange} required rows="5"
                                                className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                placeholder="Describe your services, specialties, and experience..."
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-playfair font-bold text-[#1A1A1A] mb-6">Service Area & Pricing</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Base City</label>
                                                <input
                                                    type="text" name="city" value={formData.city} onChange={handleChange} required
                                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                    placeholder="e.g. Jaipur"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Full Studio Address</label>
                                                <input
                                                    type="text" name="address" value={formData.address} onChange={handleChange} required
                                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                    placeholder="Detailed address..."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Starting Price (₹)</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                                    <input
                                                        type="number" name="startingPrice.amount" value={formData.startingPrice.amount} onChange={handleChange} required
                                                        className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl pl-9 pr-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Unit</label>
                                                <select
                                                    name="startingPrice.unit" value={formData.startingPrice.unit} onChange={handleChange} required
                                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all"
                                                >
                                                    <option value="per event">per event</option>
                                                    <option value="per day">per day</option>
                                                    <option value="per hour">per hour</option>
                                                    <option value="per plate">per plate</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-playfair font-bold text-[#1A1A1A] mb-6">Contact Details</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">Phone Number</label>
                                                <input
                                                    type="tel" name="contact.phone" value={formData.contact.phone} onChange={handleChange} required
                                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                    placeholder="99999 99999"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">WhatsApp (Direct Chat)</label>
                                                <input
                                                    type="tel" name="contact.whatsapp" value={formData.contact.whatsapp} onChange={handleChange} required
                                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl px-5 py-4 focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                                                    placeholder="Whatsapp number..."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#1A1A1A] mb-4 uppercase tracking-tight">Showcase Your Work (Images)</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 hover:border-gold/50 transition-all text-center cursor-pointer group bg-gray-50/50">
                                                <input type="file" multiple onChange={handleImageUpload} className="hidden" id="image-upload" accept="image/*" />
                                                <label htmlFor="image-upload" className="cursor-pointer space-y-3 block">
                                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                        <ImageIcon className="w-8 h-8 text-gold" />
                                                    </div>
                                                    <p className="text-[#1A1A1A] font-bold">Upload Photos</p>
                                                    <p className="text-sm text-gray-500">Drag & drop or browse from your device</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest pt-2">Max 5 images • JPG, PNG</p>
                                                </label>
                                            </div>

                                            {formData.images.length > 0 && (
                                                <div className="mt-6 flex flex-wrap gap-4">
                                                    {formData.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-24 h-24 group rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                                    className="bg-white text-red-600 rounded-full p-2 hover:scale-110 transition-all"
                                                                >
                                                                    <XCircle2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-12 flex flex-col md:flex-row justify-between gap-4">
                                    {step > 1 && (
                                        <button
                                            type="button" onClick={prevStep}
                                            className="order-2 md:order-1 px-8 py-4 rounded-xl font-bold bg-white text-[#1A1A1A] border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                    )}
                                    {step < 3 ? (
                                        <button
                                            type="button" onClick={nextStep}
                                            className="order-1 md:order-2 flex-1 px-8 py-4 rounded-xl font-bold bg-[#1A1A1A] text-white hover:bg-black transition-all shadow-xl hover:shadow-gold/10 flex items-center justify-center gap-2"
                                        >
                                            Continue <ArrowRight size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit" disabled={loading}
                                            className="order-1 md:order-2 flex-1 px-8 py-4 rounded-xl font-bold bg-gold text-[#1A1A1A] hover:bg-[#D4AF37] transition-all shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? 'Submitting Application...' : 'Submit Listing for Approval'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    By submitting, you agree to Sadiwala.com's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Quality Standards</a>.
                </p>
            </div>
        </div>
    );
};

const XCircle2 = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);

export default VendorRegistration;
