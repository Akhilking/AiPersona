import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dog, Cat, Baby, User, Star, ChevronRight, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { authAPI, recommendationsAPI } from '../services/api';
import { useProfileStore, useAuthStore } from '../store';

const CATEGORY_CONFIG = {
    dog: { icon: Dog, color: 'blue', label: 'Dog' },
    cat: { icon: Cat, color: 'purple', label: 'Cat' },
    baby: { icon: Baby, color: 'pink', label: 'Baby' },
    human: { icon: User, color: 'green', label: 'Adult' }
};

export default function Home() {
    const navigate = useNavigate();
    const { currentProfile, setCurrentProfile } = useProfileStore();
    const user = useAuthStore((state) => state.user);

    // Fetch user's profiles
    const { data: userProfiles = [], isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
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

            // Check if profiles belong to current user
            if (profileStore.userId !== user?.id) {
                // Clear old user's profiles
                profileStore.clearProfile();
                localStorage.removeItem('profile-storage');
            }

            // Auto-select profile if none selected or invalid
            if (!currentProfile || !userProfiles.some(p => p.id === currentProfile.id)) {
                const latestProfile = [...userProfiles].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                )[0];
                setCurrentProfile(latestProfile);
            }

            // Store userId to track ownership
            profileStore.setProfiles(userProfiles, user?.id);
        }
    }, [userProfiles, profilesLoading, currentProfile, setCurrentProfile, user]);

    // Fetch recommendations for current profile
    const { data: recommendationsData, isLoading: recsLoading, refetch } = useQuery({
        queryKey: ['recommendations', currentProfile?.id],
        queryFn: async () => {
            if (!currentProfile) return null;
            const response = await recommendationsAPI.get(currentProfile.id);
            return response.data;
        },
        enabled: !!currentProfile,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const recommendations = recommendationsData?.recommendations || [];

    const handleProfileSwitch = (profile) => {
        setCurrentProfile(profile);
    };

    // No profiles - Onboarding
    if (!profilesLoading && userProfiles.length === 0) {
        return <OnboardingView onCreateProfile={() => navigate('/profile/templates')} />;
    }

    // Loading state
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

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header with Profile Switcher */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            AI Recommendations
                        </h1>
                        <p className="text-gray-600">
                            Personalized product suggestions powered by AI
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Manage Profiles
                    </button>
                </div>

                {/* Profile Switcher Bar */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                        <span className="font-semibold text-gray-900">Select Profile:</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {userProfiles.map((profile) => {
                            const category = profile.profile_category || 'dog';
                            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.dog;
                            const Icon = config.icon;
                            const isActive = currentProfile?.id === profile.id;

                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => handleProfileSwitch(profile)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${isActive
                                        ? 'border-primary-500 bg-primary-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary-100' : 'bg-gray-100'
                                        }`}>
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-semibold ${isActive ? 'text-primary-700' : 'text-gray-900'
                                            }`}>
                                            {profile.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {config.label} • {profile.age_years} yrs
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="ml-2">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {/* Add New Profile Button */}
                        <button
                            onClick={() => navigate('/profile/templates')}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                                <Plus className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-600">New Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Profile Info */}
            {currentProfile && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Recommendations for {currentProfile.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {currentProfile.allergies?.length > 0 && (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                        {currentProfile.allergies.length} Allergie(s)
                                    </span>
                                )}
                                {currentProfile.health_conditions?.length > 0 && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                        {currentProfile.health_conditions.length} Health Condition(s)
                                    </span>
                                )}
                                {currentProfile.preferences?.price_range && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                                        {currentProfile.preferences.price_range} Budget
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm">
                                AI has analyzed {recommendations.length > 0 ? recommendations.length : 'multiple'} products based on this profile
                            </p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            disabled={recsLoading}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${recsLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            )}

            {/* Recommendations Grid */}
            {recsLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Generating AI recommendations...</p>
                    </div>
                </div>
            ) : recommendations.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((rec) => (
                            <RecommendationCard key={rec.product.id} recommendation={rec} />
                        ))}
                    </div>

                    {/* Compare Button */}
                    {recommendations.length >= 2 && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/comparison')}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <ChevronRight className="w-5 h-5" />
                                Compare Products
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <Dog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No recommendations available
                    </h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any products matching this profile's requirements.
                    </p>
                    <button onClick={() => navigate('/profile/new')} className="btn-secondary">
                        Update Profile Settings
                    </button>
                </div>
            )}
        </div>
    );
}

function OnboardingView({ onCreateProfile }) {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
                    <Sparkles className="w-12 h-12 text-primary-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to AI Persona! 🎉
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Get started by creating a profile to receive AI-powered personalized recommendations
                </p>
                <button
                    onClick={onCreateProfile}
                    className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition inline-flex items-center gap-3"
                >
                    <Plus className="w-6 h-6" />
                    Create Your First Profile
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                    icon="🐕"
                    title="Pet Profiles"
                    description="Dogs and cats with dietary needs"
                />
                <FeatureCard
                    icon="👶"
                    title="Baby Profiles"
                    description="Personalized baby product recommendations"
                />
                <FeatureCard
                    icon="👤"
                    title="Adult Profiles"
                    description="Health and dietary preferences"
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}

function RecommendationCard({ recommendation }) {
    const product = recommendation.product;
    const attributes = product.attributes || {};
    const nutrition = attributes.nutrition || {};

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
            {/* Match Score Badge */}
            <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-48 flex items-center justify-center">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Dog className="w-20 h-20 text-gray-400" />
                    )}
                </div>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {recommendation.match_score}% Match
                </div>
            </div>

            <div className="p-5">
                <p className="text-xs text-primary-600 font-medium mb-1">{product.brand}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {/* AI Explanation */}
                {recommendation.explanation && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {recommendation.explanation}
                    </p>
                )}

                {/* Quick Pros */}
                {recommendation.pros && recommendation.pros.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs font-semibold text-green-700 mb-1">Why it's good:</p>
                        <ul className="space-y-1">
                            {recommendation.pros.slice(0, 2).map((pro, idx) => (
                                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span className="line-clamp-1">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Price & Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}