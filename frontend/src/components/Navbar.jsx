import React from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, UserButton, useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

function Navbar() {
    const { user } = useUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'gauravkesh.tech@gmail.com';

    return (
        <nav className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-premium-gold/10">
            <Link to="/" className="text-3xl font-playfair font-bold text-premium-charcoal">
                Sadi<span className="text-premium-gold">wala</span>
            </Link>

            <div className="hidden md:flex space-x-8 font-medium">
                <Link to="/search" className="hover:text-premium-gold transition-colors">Find Services</Link>
                <Link to="/vendor/register" className="hover:text-premium-gold transition-colors">List your Service</Link>

                <SignedIn>
                    <Link to="/vendor/dashboard" className="px-4 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-premium-gold transition-all">Vendor Dashboard</Link>
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="text-gray-400 text-xs hover:text-premium-gold transition-colors uppercase tracking-widest font-bold flex items-center">Admin Panel</Link>
                    )}
                </SignedIn>
            </div>

            <div className="flex items-center gap-4">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="btn-premium px-6 py-2">Vendor Login</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    );
}

export default Navbar;
