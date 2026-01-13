import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dog, User, LogOut, Home, ShoppingBag, ShoppingCart, Heart, Menu, X, Search, HelpCircle, TrendingUp } from 'lucide-react';
import { useAuthStore, useProfileStore, useCartStore, useWishlistStore } from '../store';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const cartCount = useCartStore((state) => state.getCartCount());
    const wishlistCount = useWishlistStore((state) => state.items.length);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [storeHydrated, setStoreHydrated] = useState(false);
    const searchRef = useRef(null);

    // Wait for store to hydrate from localStorage
    useEffect(() => {
        // Small delay to ensure store has hydrated
        const timer = setTimeout(() => {
            setStoreHydrated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    // Fetch products for search - enabled after store hydration
    const { data: productsResponse, isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['all-products-search'],
        queryFn: async () => {
            const response = await productsAPI.list({ limit: 100 });
            return response.data;
        },
        enabled: storeHydrated && isAuthenticated, // Wait for both hydration and auth
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });

    const allProducts = productsResponse || [];

    // Filter products based on search query
    const searchResults = searchQuery.length >= 2 && allProducts.length > 0
        ? allProducts
            .filter(product =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 6)
        : [];

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchResultClick = (productId) => {
        setShowSearchResults(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const handleViewAllResults = () => {
        navigate(`/products?search=${searchQuery}`);
        setShowSearchResults(false);
        setSearchQuery('');
    };

    const navLinks = [
        { path: '/products', icon: ShoppingBag, label: 'Products' }, // Browse everything
        { path: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistCount },
        { path: '/profiles', icon: User, label: 'Profiles' },
        { path: '/faq', icon: HelpCircle, label: 'FAQ' },
        { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-screen-2xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <Dog className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">AI Persona</span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block flex-1 max-w-xl mx-8" ref={searchRef}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products, brands..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchResults(true);
                                }}
                                onFocus={() => setShowSearchResults(true)}
                                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            />

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchQuery.length >= 2 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                                    {productsLoading ? (
                                        <div className="p-8 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
                                            <p className="text-gray-500 text-sm font-medium">Searching products...</p>
                                        </div>
                                    ) : productsError ? (
                                        <div className="p-8 text-center text-red-600">
                                            <p className="font-semibold text-base">Unable to load products</p>
                                            <p className="text-sm mt-1 text-red-500">Please try again later</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            {/* Results Header */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-primary-600" />
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">for "{searchQuery}"</span>
                                                </div>
                                            </div>

                                            {/* Results List */}
                                            <div className="max-h-96 overflow-y-auto">
                                                {searchResults.map((product, index) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => handleSearchResultClick(product.id)}
                                                        className={`w-full flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 transition-all duration-200 border-b border-gray-100 last:border-0 text-left group ${index === 0 ? 'bg-gray-50' : ''
                                                            }`}
                                                    >
                                                        {/* Product Image */}
                                                        <div className="relative flex-shrink-0">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary-300 transition-colors"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 group-hover:border-primary-300 transition-colors">
                                                                    <ShoppingBag className="w-7 h-7 text-gray-400" />
                                                                </div>
                                                            )}
                                                            {index === 0 && (
                                                                <div className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                                    1
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                                                                {product.name}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm text-gray-600 font-medium">{product.brand}</span>
                                                                <span className="text-gray-300">•</span>
                                                                <span className="text-sm font-bold text-primary-600">${product.price.toFixed(2)}</span>
                                                            </div>
                                                            {product.rating > 0 && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <div className="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                                                ★
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        {product.rating.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Arrow */}
                                                        <div className="text-gray-400 group-hover:text-primary-600 transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* View All Footer */}
                                            <div className="p-3 bg-gray-50 border-t border-gray-200">
                                                <button
                                                    onClick={handleViewAllResults}
                                                    className="w-full text-center py-2.5 px-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                                                >
                                                    View All Results →
                                                </button>
                                            </div>
                                        </>
                                    ) : allProducts.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="font-semibold text-gray-700">No products available</p>
                                            <p className="text-sm mt-1">Please check back later</p>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="font-semibold text-gray-700">No products found</p>
                                            <p className="text-sm mt-1">Try searching with different keywords</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
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
                                <span className="hidden lg:inline">{label}</span>
                                {badge > 0 && (
                                    <span className={`absolute -top-1 -right-1 ${path === '/wishlist' ? 'bg-pink-500' : 'bg-red-500'
                                        } text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        ))}

                        {/* User Menu */}
                        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                            <div className="text-right hidden xl:block">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.full_name || user?.email?.split('@')[0]}
                                </div>
                                {currentProfile && (
                                    <div className="text-xs text-gray-500">
                                        {currentProfile.name}
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
                        {/* Mobile Search */}
                        <div className="px-4 mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            {/* Mobile search results */}
                            {searchQuery.length >= 2 && searchResults.length > 0 && (
                                <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                handleSearchResultClick(product.id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
                                        >
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 truncate">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-0.5">
                                                    {product.brand} • ${product.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => {
                                            handleViewAllResults();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full p-3 bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700"
                                    >
                                        View All Results
                                    </button>
                                </div>
                            )}
                        </div>

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