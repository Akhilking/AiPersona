import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dog, Cat, Baby, User, Package, Droplet, Pill, Heart, Home, Shirt, Utensils, ShoppingBag, ChevronRight, TrendingUp, Clock, Star } from 'lucide-react';
import { useProfileStore } from '../store';
import { recommendationsAPI } from '../services/api';

// Category configurations for each profile type
const CATEGORY_CONFIGS = {
    dog: {
        icon: Dog,
        color: 'blue',
        categories: [
            { id: 'food', name: 'Dog Food', icon: Utensils, description: 'Premium dog food & treats', color: 'orange' },
            { id: 'toys', name: 'Toys & Play', icon: Package, description: 'Interactive toys & games', color: 'purple' },
            { id: 'grooming', name: 'Grooming', icon: Droplet, description: 'Shampoos & grooming supplies', color: 'blue' },
            { id: 'health', name: 'Health & Wellness', icon: Heart, description: 'Supplements & vitamins', color: 'red' },
        ]
    },
    cat: {
        icon: Cat,
        color: 'purple',
        categories: [
            { id: 'food', name: 'Cat Food', icon: Utensils, description: 'Nutritious cat food & treats', color: 'orange' },
            { id: 'litter', name: 'Litter & Boxes', icon: Package, description: 'Litter & accessories', color: 'green' },
            { id: 'toys', name: 'Toys & Play', icon: Package, description: 'Interactive cat toys', color: 'purple' },
            { id: 'health', name: 'Health & Wellness', icon: Heart, description: 'Supplements & care products', color: 'red' },
        ]
    },
    baby: {
        icon: Baby,
        color: 'pink',
        categories: [
            { id: 'formula', name: 'Formula & Feeding', icon: Utensils, description: 'Formula & feeding essentials', color: 'blue' },
            { id: 'diapers', name: 'Diapers & Wipes', icon: Package, description: 'Diapers, wipes & changing', color: 'green' },
            { id: 'care', name: 'Baby Care', icon: Heart, description: 'Lotions, shampoos & care', color: 'pink' },
            { id: 'clothing', name: 'Clothing', icon: Shirt, description: 'Baby clothes & accessories', color: 'purple' },
        ]
    },
    human: {
        icon: User,
        color: 'green',
        categories: [
            { id: 'skincare', name: 'Skincare', icon: Droplet, description: 'Cleansers, serums & moisturizers', color: 'blue' },
            { id: 'supplements', name: 'Supplements', icon: Pill, description: 'Vitamins & nutritional supplements', color: 'orange' },
            { id: 'wellness', name: 'Wellness', icon: Heart, description: 'Fitness & wellness products', color: 'green' },
            { id: 'personal_care', name: 'Personal Care', icon: Package, description: 'Hair care, oral care & more', color: 'purple' },
        ]
    }
};

export default function ProfileShopping() {
    const navigate = useNavigate();
    const { currentProfile, setCurrentProfile } = useProfileStore();
    const user = useAuthStore((state) => state.user);

    // Fetch user's profiles
    const { data: userProfiles = [], isLoading: profilesLoading } = useQuery({
        queryKey: ['my-profiles'],
        queryFn: async () => {
            const response = await authAPI.getMyProfiles();
            return response.data;
        },
        refetchOnMount: 'always',
    });

    // Auto-select first profile if none selected
    useEffect(() => {
        if (!profilesLoading && userProfiles.length > 0) {
            const profileStore = useProfileStore.getState();

            // Clear profile if user changed
            if (profileStore.userId !== user?.id) {
                profileStore.clearProfile();
                localStorage.removeItem('profile-storage');
            }

            // Auto-select latest profile if none selected
            if (!currentProfile || !userProfiles.some(p => p.id === currentProfile.id)) {
                const latestProfile = [...userProfiles].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                )[0];
                setCurrentProfile(latestProfile);
            }

            profileStore.setProfiles(userProfiles, user?.id);
        }
    }, [userProfiles, profilesLoading, currentProfile, setCurrentProfile, user]);

    // Fetch recommendations to show quick stats
    const { data: recommendationsData } = useQuery({
        queryKey: ['recommendations', currentProfile?.id],
        queryFn: async () => {
            if (!currentProfile) return null;
            const response = await recommendationsAPI.get(currentProfile.id, 20);
            return response.data;
        },
        enabled: !!currentProfile,
    });

    if (profilesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profiles...</p>
                </div>
            </div>
        );
    }

    // No profiles - redirect to create
    if (!profilesLoading && userProfiles.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-600 mb-4">Create your first profile to get started</p>
                <button onClick={() => navigate('/profile/templates')} className="btn-primary">
                    Create Profile
                </button>
            </div>
        );
    }

    if (!currentProfile) {
        return null; // Will auto-select in useEffect
    }

    const profileType = currentProfile.profile_category;
    const config = CATEGORY_CONFIGS[profileType];
    const ProfileIcon = config?.icon || User;

    const handleCategoryClick = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-full p-4">
                            <ProfileIcon className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Shopping for {currentProfile.name}
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Choose a category to explore personalized recommendations
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition"
                    >
                        Change Profile
                    </button>
                </div>

                {/* Quick Stats */}
                {recommendationsData && (
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/80 mb-1">
                                <ShoppingBag className="w-4 h-4" />
                                <span className="text-sm">Available Products</span>
                            </div>
                            <p className="text-3xl font-bold">{recommendationsData.total_safe_products}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/80 mb-1">
                                <Star className="w-4 h-4" />
                                <span className="text-sm">Top Rated</span>
                            </div>
                            <p className="text-3xl font-bold">
                                {recommendationsData.recommendations.filter(r => r.product.rating >= 4.5).length}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/80 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">Filtered for Safety</span>
                            </div>
                            <p className="text-3xl font-bold">{recommendationsData.total_filtered_out}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {config?.categories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 text-left border border-gray-200 hover:border-blue-500 transform hover:-translate-y-1"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-${category.color}-100 mb-4 group-hover:scale-110 transition-transform`}>
                                    <CategoryIcon className={`w-7 h-7 text-${category.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {category.description}
                                </p>
                                <div className="flex items-center text-blue-600 font-medium text-sm">
                                    <span>Explore</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recent Recommendations */}
            {recommendationsData && recommendationsData.recommendations.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Recommendations</h2>
                        <button
                            onClick={() => navigate('/products')}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recommendationsData.recommendations.slice(0, 4).map((rec) => {
                            const product = rec.product;
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-16 h-16 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-blue-600 font-bold mb-1">{product.brand}</p>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {product.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}