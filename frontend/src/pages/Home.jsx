import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dog, Star, AlertCircle, Plus } from 'lucide-react';
import { productsAPI, authAPI } from '../services/api';
import { useAuthStore, useProfileStore } from '../store';
import { useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const clearProfile = useProfileStore((state) => state.clearProfile);
    const user = useAuthStore((state) => state.user);

    // Fetch user's profiles to validate currentProfile
    const { data: userProfiles = [] } = useQuery({
        queryKey: ['my-profiles'],
        queryFn: async () => {
            const response = await authAPI.getMyProfiles();
            return response.data;
        },
    });

    // Clear currentProfile if it doesn't belong to current user
    useEffect(() => {
        if (currentProfile && userProfiles.length > 0) {
            const profileExists = userProfiles.some(p => p.id === currentProfile.id);
            if (!profileExists) {
                clearProfile(); // Profile doesn't belong to current user
            }
        }
    }, [currentProfile, userProfiles, clearProfile]);

    // Fetch all products
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['all-products'],
        queryFn: async () => {
            const response = await productsAPI.list();
            return response.data;
        },
    });

    const products = Array.isArray(productsData) ? productsData : (productsData?.products || []);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Profile Creation Banner - Always Visible */}
            {!currentProfile && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-8 sticky top-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Dog className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">
                                    Create a profile for personalized recommendations!
                                </h3>
                                <p className="text-blue-100">
                                    Get AI-powered product suggestions based on your pet's allergies, age, and health conditions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/profiles')}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Create Profile
                        </button>
                    </div>
                </div>
            )}

            {currentProfile && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Dog className="w-5 h-5 text-green-600" />
                        <p>
                            <span className="font-semibold">Profile Active: {currentProfile.name}</span>
                            {' · '}
                            <button
                                onClick={() => navigate('/recommendations')}
                                className="text-green-700 underline hover:text-green-900"
                            >
                                View personalized recommendations
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Browse All Pet Food Products
                </h1>
                <p className="text-gray-600 text-lg">
                    {products.length} premium dog food options available
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
                <div className="text-center py-20">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No products available
                    </h3>
                    <p className="text-gray-600">
                        Products will appear here once they're added to the database.
                    </p>
                </div>
            )}
        </div>
    );
}

function ProductCard({ product }) {
    const attributes = product.attributes || {};
    const ingredients = attributes.ingredients || {};
    const nutrition = attributes.nutrition || {};

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
            {/* Product Image */}
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

            {/* Product Info */}
            <div className="p-5">
                {/* Brand */}
                <p className="text-sm text-primary-600 font-medium mb-1">{product.brand}</p>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Key Info */}
                <div className="space-y-2 mb-4">
                    {attributes.primary_protein && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Protein:</span>
                            <span className="font-medium capitalize">{attributes.primary_protein}</span>
                        </div>
                    )}

                    {attributes.life_stage && attributes.life_stage.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Life Stage:</span>
                            <span className="font-medium capitalize">{attributes.life_stage.join(', ')}</span>
                        </div>
                    )}

                    {nutrition.protein_pct && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Nutrition:</span>
                            <span className="font-medium">
                                Protein: {nutrition.protein_pct}% · Fat: {nutrition.fat_pct}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {attributes.features && attributes.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {attributes.features.slice(0, 3).map((feature) => (
                            <span
                                key={feature}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full capitalize"
                            >
                                {feature.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {/* Price */}
                    <div>
                        <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            {product.price_unit}
                        </span>
                    </div>

                    {/* Rating */}
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