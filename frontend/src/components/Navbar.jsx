import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dog, User, LogOut, Home, ShoppingBag, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useAuthStore, useProfileStore, useCartStore, useWishlistStore } from '../store';
import { useState } from 'react';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const cartCount = useCartStore((state) => state.getCartCount());
    const wishlistCount = useWishlistStore((state) => state.items.length);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/products', icon: ShoppingBag, label: 'Products' },
        { path: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistCount },
        { path: '/profiles', icon: User, label: 'Profiles' },
        { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-screen-2xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Dog className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">AI Persona</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ path, icon: Icon, label, badge }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive(path)
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{label}</span>
                                {badge > 0 && (
                                    <span className={`absolute -top-1 -right-1 ${path === '/wishlist' ? 'bg-pink-500' : 'bg-red-500'
                                        } text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        ))}

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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        {navLinks.map(({ path, icon: Icon, label, badge }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`relative flex items-center justify-between px-4 py-3 rounded-lg mb-1 ${isActive(path)
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{label}</span>
                                </div>
                                {badge > 0 && (
                                    <span className={`${path === '/wishlist' ? 'bg-pink-500' : 'bg-red-500'
                                        } text-white text-xs font-bold rounded-full px-2 py-1`}>
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        ))}

                        <div className="mt-4 pt-4 border-t border-gray-200 px-4">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                                {user?.full_name || user?.email?.split('@')[0]}
                            </div>
                            {currentProfile && (
                                <div className="text-xs text-gray-500 mb-3">
                                    Shopping for: {currentProfile.name}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}