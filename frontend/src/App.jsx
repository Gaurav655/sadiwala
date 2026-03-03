import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/AdminDashboard';
import VendorRegistration from './pages/VendorRegistration';
import VendorDashboard from './pages/VendorDashboard';
import VendorDetails from './pages/VendorDetails';
import UserSync from './components/UserSync';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null; // Or a loader

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.primaryEmailAddress?.emailAddress !== 'gauravkesh.tech@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based Redirect Handler
const RoleRedirect = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if this user has a vendor profile
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${API_URL}/api/vendors/me?clerkId=${user.id}`);
          if (response.status === 200 && window.location.pathname === '/') {
            // If they have a vendor profile and are on the home page, redirect to dashboard
            navigate('/vendor/dashboard');
          }
        } catch (err) {
          // No vendor profile found, stay on home or whatever
        }
      }
    };
    checkUserRoleAndRedirect();
  }, [isLoaded, isSignedIn, user]);

  return children;
};

function App() {
  return (
    <Router>
      <RoleRedirect>
        <div className="min-h-screen bg-premium-offWhite selection:bg-premium-gold selection:text-white">
          <UserSync />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/vendor/register" element={<VendorRegistration />} />
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedRoute>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/vendor/:id" element={<VendorDetails />} />
            </Routes>
          </main>
        </div>
      </RoleRedirect>
    </Router>
  );
}

export default App;
