import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';
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
                <span className="ml-3 text-lg text-gray-600">Analyzing products for {currentProfile?.name}...</span>
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
                <h1 className="text-3xl font-bold mb-2">Recommendations for {currentProfile?.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                </div>
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
                            Compare {selectedProducts.length > 1 && `(${selectedProducts.length})`}
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

function ProductCard({ recommendation, isSelected, onToggleSelect }) {
    const { product, match_score, explanation, pros, cons } = recommendation;

    return (
        <div className={`card hover:shadow-lg transition relative ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${match_score >= 80 ? 'bg-green-100 text-green-700' :
                        match_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                    }`}>
                    {match_score}% Match
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

            {/* Explanation */}
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">{explanation}</p>

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
                    <p className="text-xs font-semibold text-gray-600 mb-1">CONSIDERATIONS:</p>
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

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={onToggleSelect}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${isSelected
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {isSelected ? 'Selected' : 'Compare'}
                </button>
            </div>
        </div>
    );
}
