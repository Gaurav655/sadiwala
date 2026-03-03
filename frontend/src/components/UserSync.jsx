import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const UserSync = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        const syncUserWithDB = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    await axios.post(`${API_URL}/api/users/sync`, {
                        clerkId: user.id,
                        email: user.primaryEmailAddress.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl
                    });
                    console.log('User synced with MongoDB');
                } catch (error) {
                    console.error('Error syncing user with MongoDB:', error);
                }
            }
        };

        syncUserWithDB();
    }, [isLoaded, isSignedIn, user]);

    return null; // This component doesn't render anything
};

export default UserSync;
