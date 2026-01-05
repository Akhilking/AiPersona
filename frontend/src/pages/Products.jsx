import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authAPI, recommendationsAPI, productsAPI } from '../services/api';
import { useProfileStore, useAuthStore, useComparisonStore, useCartStore } from '../store';
import { Dog, Cat, Baby, User, Star, ChevronDown, ChevronUp, ShoppingBag, Filter, X, Scale, Plus, Check, ShoppingCart, Utensils, Package, Droplet, Heart, Shirt, Pill } from 'lucide-react';

const CATEGORY_CONFIG = {
    dog: { icon: Dog, color: 'blue', label: 'Dog' },
    cat: { icon: Cat, color: 'purple', label: 'Cat' },
    baby: { icon: Baby, color: 'pink', label: 'Baby' },
    human: { icon: User, color: 'green', label: 'Adult' }
};

const SUB_CATEGORY_CONFIGS = {
    dog: [
        { id: 'all', name: 'All Products', icon: ShoppingBag },
        { id: 'food', name: 'Food', icon: Utensils },
        { id: 'toys', name: 'Toys', icon: Package },
        { id: 'grooming', name: 'Grooming', icon: Droplet },
        { id: 'health', name: 'Health', icon: Heart },
    ],
    cat: [
        { id: 'all', name: 'All Products', icon: ShoppingBag },
        { id: 'food', name: 'Food', icon: Utensils },
        { id: 'litter', name: 'Litter', icon: Package },
        { id: 'toys', name: 'Toys', icon: Package },
        { id: 'health', name: 'Health', icon: Heart },
    ],
    baby: [
        { id: 'all', name: 'All Products', icon: ShoppingBag },
        { id: 'formula', name: 'Formula', icon: Utensils },
        { id: 'diapers', name: 'Diapers', icon: Package },
        { id: 'care', name: 'Care', icon: Heart },
        { id: 'clothing', name: 'Clothing', icon: Shirt },
    ],
    human: [
        { id: 'all', name: 'All Products', icon: ShoppingBag },
        { id: 'skincare', name: 'Skincare', icon: Droplet },
        { id: 'supplements', name: 'Supplements', icon: Pill },
        { id: 'wellness', name: 'Wellness', icon: Heart },
        { id: 'personal_care', name: 'Personal Care', icon: Package },
    ],
};

export default function Products() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentProfile, setCurrentProfile } = useProfileStore();
    const user = useAuthStore((state) => state.user);
    const { selectedProducts, addProduct, removeProduct, clearSelection } = useComparisonStore();
    const cartCount = useCartStore((state) => state.getCartCount());

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [showFilters, setShowFilters] = useState(true);

    // Category state from URL
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    // Update category from URL changes
    useEffect(() => {
        const category = searchParams.get('category') || 'all';
        setSelectedCategory(category);
    }, [searchParams]);

    // Fetch user's profiles
    const { data: userProfiles = [], isLoading: profilesLoading } = useQuery({
        queryKey: ['my-profiles'],
        queryFn: async () => {
            const response = await authAPI.getMyProfiles();
            return response.data;
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    // Auto-select first profile if none selected
    useEffect(() => {
        if (!profilesLoading && userProfiles.length > 0) {
            const profileStore = useProfileStore.getState();

            if (profileStore.userId !== user?.id) {
                profileStore.clearProfile();
                localStorage.removeItem('profile-storage');
            }

            if (!currentProfile || !userProfiles.some(p => p.id === currentProfile.id)) {
                const latestProfile = [...userProfiles].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                )[0];
                setCurrentProfile(latestProfile);
            }

            profileStore.setProfiles(userProfiles, user?.id);
        }
    }, [userProfiles, profilesLoading, currentProfile, setCurrentProfile, user]);

    // Fetch ALL products (not recommendations)
    const { data: productsData = [], isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['all-products', currentProfile?.profile_category],
        queryFn: async () => {
            try {
                // Fetch products filtered by current profile's category
                const params = currentProfile
                    ? { pet_type: currentProfile.profile_category, limit: 100 }
                    : { limit: 100 };
                const response = await productsAPI.list(params);
                return response.data;
            } catch (error) {
                console.error('❌ Products API Error:', error);
                console.error('Response:', error.response?.data);
                throw error;
            }
        },
        enabled: !!currentProfile,
        retry: 1,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Show error state
    if (productsError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Products</h2>
                    <p className="text-red-700 mb-4">{productsError.message}</p>
                    <pre className="text-left bg-red-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(productsError.response?.data || productsError, null, 2)}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const allProducts = productsData || [];

    // Filter products by profile category first
    const profileFilteredProducts = allProducts;

    // Extract unique brands from filtered products
    const allBrands = [...new Set(profileFilteredProducts.map(p => p.brand))].sort();

    // Apply additional filters including sub-category
    const filteredProducts = profileFilteredProducts.filter(product => {
        // Sub-category filter
        if (selectedCategory !== 'all' && product.product_category !== selectedCategory) {
            return false;
        }

        // Price filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

        // Rating filter
        if (product.rating < minRating) return false;

        return true;
    });

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const clearFilters = () => {
        setPriceRange([0, 100]);
        setSelectedBrands([]);
        setMinRating(0);
    };

    const handleCompareClick = () => {
        if (selectedProducts.length >= 2) {
            navigate('/comparison');
        }
    };

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        setSearchParams(categoryId === 'all' ? {} : { category: categoryId });
        setSelectedCategory(categoryId);
    };

    const handleAddToCart = (product) => {
        const addToCart = useCartStore.getState().addToCart;
        addToCart({
            product,
            profileId: currentProfile?.id,
            quantity: 1
        });
    };

    const handleCompareToggle = (product) => {
        if (selectedProducts.some(p => p.id === product.id)) {
            removeProduct(product.id);
        } else {
            addProduct(product);
        }
    };

    // No profiles - Onboarding
    if (!profilesLoading && userProfiles.length === 0) {
        return <OnboardingView onCreateProfile={() => navigate('/profile/templates')} />;
    }

    // Loading state
    if (profilesLoading || productsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto -mx-4">
            {/* Compact Profile Bar */}
            {currentProfile && (
                <div className="bg-white border-b border-gray-200 px-6 py-3 mb-0 sticky top-16 z-10 shadow-sm">
                    <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-primary-600" />
                            <span className="text-sm text-gray-600">Shopping for</span>
                            <span className="font-bold text-gray-900">{currentProfile.name}</span>
                            {currentProfile.allergies?.length > 0 && (
                                <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                                    {currentProfile.allergies.length} allergie(s) filtered
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Compare Icon */}
                            <button
                                onClick={handleCompareClick}
                                disabled={selectedProducts.length < 2}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${selectedProducts.length >= 2
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                title={`Compare ${selectedProducts.length} products`}
                            >
                                <Scale className="w-5 h-5" />
                                <span>Compare</span>
                                {selectedProducts.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {selectedProducts.length}
                                    </span>
                                )}
                            </button>

                            {/* Cart Icon */}
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/profiles')}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Change Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Category Tabs */}
            {currentProfile && SUB_CATEGORY_CONFIGS[currentProfile.profile_category] && (
                <div className="bg-white border-b border-gray-200 px-6 py-3 mb-0 sticky top-28 z-10 shadow-sm">
                    <div className="flex items-center gap-2 max-w-screen-2xl mx-auto overflow-x-auto">
                        {SUB_CATEGORY_CONFIGS[currentProfile.profile_category].map((cat) => {
                            const CategoryIcon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <CategoryIcon className="w-4 h-4" />
                                    <span>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Floating Comparison Bar */}
            {selectedProducts.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up max-w-5xl">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl px-6 py-4">
                        <div className="flex items-center gap-6">
                            {/* Info Section */}
                            <div className="flex items-center gap-3">
                                <Scale className="w-6 h-6" />
                                <div>
                                    <div className="font-bold text-lg">
                                        {selectedProducts.length} of 4 Selected
                                    </div>
                                    <div className="text-xs text-blue-100">
                                        {selectedProducts.length >= 2
                                            ? 'Ready to compare!'
                                            : `Add ${2 - selectedProducts.length} more to compare`
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-white/30"></div>

                            {/* Selected Products with Remove Buttons */}
                            <div className="flex items-center gap-3 flex-1">
                                {selectedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative bg-white rounded-xl p-2 shadow-md group hover:shadow-lg transition-all"
                                        style={{ width: '120px' }}
                                    >
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeProduct(product.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all z-10"
                                            title="Remove from comparison"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>

                                        {/* Product Image */}
                                        <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Dog className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {product.brand}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty Slots */}
                                {[...Array(4 - selectedProducts.length)].map((_, i) => (
                                    <div
                                        key={`empty-${i}`}
                                        className="bg-white/20 border-2 border-dashed border-white/50 rounded-xl flex flex-col items-center justify-center"
                                        style={{ width: '120px', height: '120px' }}
                                    >
                                        <Plus className="w-8 h-8 text-white/60 mb-1" />
                                        <span className="text-xs text-white/60">Add Product</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-12 w-px bg-white/30"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={clearSelection}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition flex items-center gap-2"
                                    title="Clear all selections"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                                <button
                                    onClick={handleCompareClick}
                                    disabled={selectedProducts.length < 2}
                                    className={`px-6 py-2 rounded-lg font-bold text-sm transition ${selectedProducts.length >= 2
                                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                                        : 'bg-white/20 text-white/50 cursor-not-allowed'
                                        }`}
                                >
                                    Compare Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-0">
                {/* Sidebar Filters - Chewy Style - More compact */}
                <aside className={`w-56 flex-shrink-0 bg-white border-r border-gray-200 ${showFilters ? '' : 'hidden'}`}>
                    <div className="sticky top-40 p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                        {/* Filter Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <h2 className="font-bold text-gray-900 text-sm">Filters</h2>
                            </div>
                            {(selectedBrands.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Price Range */}
                        <FilterSection title="Price" defaultOpen>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">${priceRange[0]}</span>
                                    <span className="text-gray-600">${priceRange[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                        </FilterSection>

                        {/* Brands */}
                        <FilterSection title={`Brand (${allBrands.length})`} defaultOpen>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {allBrands.map(brand => (
                                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-xs">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                            className="rounded text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-gray-700">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </FilterSection>

                        {/* Rating */}
                        <FilterSection title="Rating" defaultOpen>
                            <div className="space-y-1">
                                {[4, 3, 2, 1].map(rating => (
                                    <button
                                        key={rating}
                                        onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                                        className={`flex items-center gap-2 w-full p-1.5 rounded hover:bg-gray-50 text-xs ${minRating === rating ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">& Up</span>
                                    </button>
                                ))}
                            </div>
                        </FilterSection>

                        {/* Profile Info */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Active Filters</h3>
                            {currentProfile?.allergies?.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-xs text-gray-600 mb-1">Avoiding:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {currentProfile.allergies.slice(0, 3).map(allergen => (
                                            <span key={allergen} className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                                                {allergen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content - Wider */}
                <main className="flex-1 px-6 py-4 bg-gray-50">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Recommended for {currentProfile?.name}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredProducts.length} of {allProducts.length} products
                                {selectedCategory !== 'all' && ` • ${selectedCategory}`}
                                {selectedBrands.length > 0 && ` • ${selectedBrands.length} brand(s)`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn-secondary flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {/* Products Grid - 5 columns for more space usage */}
                    {productsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                                    <div className="bg-gray-200 h-48 rounded mb-4"></div>
                                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    profile={currentProfile}
                                    onAddToCart={() => handleAddToCart(product)}
                                    onCompare={() => handleCompareToggle(product)}
                                    isSelected={selectedProducts.some(p => p.id === product.id)}
                                    isMaxReached={selectedProducts.length >= 4}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg shadow-md">
                            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No products match your filters
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your filters to see more results
                            </p>
                            <button onClick={clearFilters} className="btn-secondary">
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Filter Section Component
function FilterSection({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-3 pb-3 border-b border-gray-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-2"
            >
                <h3 className="font-semibold text-xs text-gray-900">{title}</h3>
                {isOpen ? (
                    <ChevronUp className="w-3 h-3 text-gray-500" />
                ) : (
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                )}
            </button>
            {isOpen && <div className="mt-2">{children}</div>}
        </div>
    );
}

function ProductCard({ product, profile, onCompare, isSelected, isMaxReached }) {
    const canSelect = !isMaxReached || isSelected;
    const navigate = useNavigate();

    // Get features - use cached AI features if available, otherwise fallback
    const getProductFeatures = () => {
        // First, check if AI features are cached in product attributes
        if (product.attributes?.ai_key_features && product.attributes.ai_key_features.length >= 2) {
            return product.attributes.ai_key_features.slice(0, 2);
        }

        // Fallback to manual extraction
        const attrs = product.attributes || {};
        const features = [];

        const profileCategory = profile?.profile_category;

        switch (profileCategory) {
            case 'dog':
            case 'cat':
                if (attrs.primary_protein) {
                    features.push(`${attrs.primary_protein} protein`);
                }
                if (attrs.grain_free) {
                    features.push('Grain-free formula');
                } else if (attrs.nutrition?.protein_pct && features.length < 2) {
                    features.push(`${attrs.nutrition.protein_pct}% protein`);
                }
                break;

            case 'baby':
                if (attrs.features && attrs.features.length > 0) {
                    features.push(attrs.features[0]);
                    if (attrs.features.length > 1) features.push(attrs.features[1]);
                }
                break;

            case 'human':
                if (attrs.key_ingredients && attrs.key_ingredients.length > 0) {
                    features.push(attrs.key_ingredients[0]);
                    if (attrs.key_ingredients.length > 1) {
                        features.push(attrs.key_ingredients[1]);
                    }
                }
                if (attrs.fragrance_free && features.length < 2) {
                    features.push('Fragrance-free');
                }
                break;
        }

        if (features.length === 0) {
            features.push('Premium quality');
            if (product.rating >= 4.5) features.push('Highly rated');
        }

        return features.slice(0, 2);
    };

    const features = getProductFeatures();

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer relative border ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
                }`}
        >
            {/* Compare Checkbox */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (canSelect) {
                        onCompareToggle();
                    }
                }}
                disabled={!canSelect}
                className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${isSelected
                    ? 'bg-blue-600 text-white scale-110'
                    : canSelect
                        ? 'bg-white text-gray-700 hover:bg-blue-50 opacity-0 group-hover:opacity-100'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                title={isSelected ? 'Remove from comparison' : isMaxReached ? 'Maximum 4 products' : 'Add to comparison'}
            >
                {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-3 h-3" />}
            </button>

            {/* Image with overlay effect */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <Dog className="w-20 h-20 text-gray-300" />
                )}
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content - Fixed height sections for consistency */}
            <div className="p-3 flex flex-col h-[calc(100%-12rem)]">
                {/* Brand Badge */}
                <div className="mb-1.5">
                    <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-full">
                        {product.brand}
                    </span>
                </div>

                {/* Product Title - Fixed height */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                    {product.name}
                </h3>

                {/* Rating & Reviews - Always same height */}
                <div className="mb-2 h-5">
                    {product.rating > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No reviews yet</span>
                    )}
                </div>

                {/* Price - Prominent */}
                <div className="mb-3">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-gray-900">
                            ${Math.floor(product.price)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                            .{(product.price % 1).toFixed(2).slice(2)}
                        </span>
                    </div>
                </div>

                {/* Key Features Box - Dynamic based on profile */}
                <div className="mt-auto">
                    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-lg p-2.5 space-y-1.5">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                                <span className="text-xs font-semibold text-gray-800 capitalize">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick View Button on Hover */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-lg transition-colors">
                    View Details →
                </button>
            </div>
        </div>
    );
}

// Onboarding View
function OnboardingView({ onCreateProfile }) {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg mb-8">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to AI Persona!
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Create a profile to get personalized AI-powered recommendations
                </p>
                <button
                    onClick={onCreateProfile}
                    className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition"
                >
                    Create Your First Profile
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-5xl mb-4">🐕</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pet Profiles</h3>
                    <p className="text-gray-600 text-sm">Dogs and cats with dietary needs</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-5xl mb-4">👶</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Baby Profiles</h3>
                    <p className="text-gray-600 text-sm">Personalized baby products</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-5xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Adult Profiles</h3>
                    <p className="text-gray-600 text-sm">Health and dietary preferences</p>
                </div>
            </div>
        </div>
    );
}