import { Link, useNavigate } from 'react-router-dom';
import { Dog, ShoppingBag } from 'lucide-react';
import { useProfileStore } from '../store';

export default function Navbar() {
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const clearProfile = useProfileStore((state) => state.clearProfile);
    const navigate = useNavigate();

    const handleNewProfile = () => {
        clearProfile();
        navigate('/profile');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Dog className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">AI Pet Food Advisor</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        {currentProfile ? (
                            <>
                                <div className="text-sm">
                                    <span className="text-gray-600">Profile: </span>
                                    <span className="font-medium text-gray-900">{currentProfile.name}</span>
                                </div>
                                <Link to="/recommendations" className="text-gray-700 hover:text-primary-600 transition">
                                    Recommendations
                                </Link>
                                <button onClick={handleNewProfile} className="btn-secondary text-sm">
                                    New Profile
                                </button>
                            </>
                        ) : (
                            <Link to="/profile" className="btn-primary">
                                Create Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
