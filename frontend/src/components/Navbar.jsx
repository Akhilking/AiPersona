import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dog, User, LogOut, Home, Sparkles } from 'lucide-react';
import { useAuthStore, useProfileStore } from '../store';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const currentProfile = useProfileStore((state) => state.currentProfile);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Dog className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">AI Persona</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive('/')
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/profiles"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive('/profiles')
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span>My Profiles</span>
                        </Link>

                        {currentProfile && (
                            <Link
                                to="/recommendations"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive('/recommendations')
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Sparkles className="w-5 h-5" />
                                <span>Recommendations</span>
                            </Link>
                        )}

                        {/* User Menu */}
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.full_name || user?.email?.split('@')[0]}
                                </div>
                                {currentProfile && (
                                    <div className="text-xs text-gray-500">
                                        Profile: {currentProfile.name}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}