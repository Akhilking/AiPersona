import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, XCircle, Scale, User, AlertTriangle, Sparkles } from 'lucide-react';
import { recommendationsAPI } from '../services/api';
import { useProfileStore, useComparisonStore } from '../store';

export default function Recommendations() {
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const navigate = useNavigate();
    const { selectedProducts, addProduct, removeProduct, clearSelection } = useComparisonStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['recommendations', currentProfile?.id],
        queryFn: () => recommendationsAPI.get(currentProfile.id, 10),
        enabled: !!currentProfile,
    });

    const handleCompare = () => {
        navigate('/comparison');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-3 text-lg text-gray-600">AI analyzing products for {currentProfile?.name}...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card max-w-md mx-auto text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Recommendations</h2>
                <p className="text-gray-600">{error.message}</p>
            </div>
        );
    }

    const recommendations = data?.data?.recommendations || [];
    const totalFiltered = data?.data?.total_filtered_out || 0;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI-Powered Recommendations</h1>
                <p className="text-gray-600">Personalized product selections for your profile</p>
            </div>

            {/* Profile Context Card */}
            <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 mb-6">
                <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                        <User className="w-6 h-6 text-primary-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-primary-900 mb-2">
                            Recommendations for: {currentProfile?.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="ml-2 font-medium text-gray-900 capitalize">{currentProfile?.pet_type}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Age:</span>
                                <span className="ml-2 font-medium text-gray-900">{currentProfile?.age_years} yrs</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Size:</span>
                                <span className="ml-2 font-medium text-gray-900 capitalize">{currentProfile?.size_category || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Weight:</span>
                                <span className="ml-2 font-medium text-gray-900">{currentProfile?.weight_lbs} lbs</span>
                            </div>
                        </div>
                        {currentProfile?.allergies && currentProfile.allergies.length > 0 && (
                            <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <span className="font-medium text-yellow-900">Allergies:</span>
                                    <span className="ml-2 text-yellow-800">{currentProfile.allergies.join(', ')}</span>
                                    <span className="ml-2 text-yellow-700">(filtered from results)</span>
                                </div>
                            </div>
                        )}
                        {currentProfile?.health_conditions && currentProfile.health_conditions.length > 0 && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-600">Health Conditions:</span>
                                <span className="ml-2 text-gray-900">{currentProfile.health_conditions.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {recommendations.length} safe products
                </span>
                {totalFiltered > 0 && (
                    <span className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        {totalFiltered} filtered out (allergies/safety)
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    AI-powered match scores
                </span>
            </div>

            {/* Comparison Bar */}
            {selectedProducts.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-primary-900">
                            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected for comparison
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clearSelection} className="btn-secondary text-sm">
                            Clear
                        </button>
                        <button
                            onClick={handleCompare}
                            disabled={selectedProducts.length < 2}
                            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            AI Compare {selectedProducts.length > 1 && `(${selectedProducts.length})`}
                        </button>
                    </div>
                </div>
            )}

            {/* Recommendations Grid */}
            {recommendations.length === 0 ? (
                <div className="card text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No safe products found for this profile.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                        <ProductCard
                            key={rec.product.id}
                            recommendation={rec}
                            profileName={currentProfile?.name}
                            isSelected={selectedProducts.some(p => p.id === rec.product.id)}
                            onToggleSelect={() => {
                                if (selectedProducts.some(p => p.id === rec.product.id)) {
                                    removeProduct(rec.product.id);
                                } else if (selectedProducts.length < 3) {
                                    addProduct(rec.product);
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ProductCard({ recommendation, profileName, isSelected, onToggleSelect }) {
    const { product, match_score, explanation, pros, cons } = recommendation;

    return (
        <div className={`card hover:shadow-lg transition relative ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${match_score >= 80 ? 'bg-green-100 text-green-700' :
                    match_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    <Sparkles className="w-3 h-3" />
                    {match_score}%
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                    AI Match
                </div>
            </div>

            {/* Brand & Name */}
            <div className="mb-4 pr-20">
                <p className="text-sm text-primary-600 font-medium">{product.brand}</p>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">{product.name}</h3>
            </div>

            {/* Price */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <span className="text-sm text-gray-600 ml-1">/ {product.price_unit}</span>
            </div>

            {/* AI Explanation */}
            <div className="mb-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-700 mb-2">
                    <Sparkles className="w-3 h-3" />
                    AI ANALYSIS FOR {profileName?.toUpperCase()}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{explanation}</p>
            </div>

            {/* Pros */}
            {pros && pros.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">PROS:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                        {pros.slice(0, 2).map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Cons */}
            {cons && cons.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">CONSIDERATIONS:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                        {cons.slice(0, 2).map((con, i) => (
                            <li key={i} className="flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onToggleSelect}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {isSelected ? 'Selected' : 'Compare'}
                </button>
                <button className="px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}