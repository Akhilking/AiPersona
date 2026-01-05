// Navbar.jsx - Remove Calculator Link
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dog, User, LogOut, Home, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAuthStore, useProfileStore, useCartStore } from '../store';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const cartCount = useCartStore((state) => state.getCartCount());

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-screen-2xl mx-auto px-4">
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
                            to="/products"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive('/products')
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Products</span>
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

                        {/* Cart Icon with Badge */}
                        <Link
                            to="/cart"
                            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive('/cart')
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.full_name || user?.email?.split('@')[0]}
                                </div>
                                {currentProfile && (
                                    <div className="text-xs text-gray-500">
                                        Shopping for: {currentProfile.name}
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