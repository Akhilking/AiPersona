import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react';
import { recommendationsAPI } from '../services/api';
import { useProfileStore, useComparisonStore } from '../store';

export default function Comparison() {
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const { selectedProducts, clearSelection } = useComparisonStore();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['comparison', currentProfile?.id, selectedProducts.map(p => p.id)],
        queryFn: () => recommendationsAPI.compare(
            currentProfile.id,
            selectedProducts.map(p => p.id)
        ),
        enabled: !!currentProfile && selectedProducts.length >= 2,
    });

    if (selectedProducts.length < 2) {
        return (
            <div className="card max-w-md mx-auto text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select Products to Compare</h2>
                <p className="text-gray-600 mb-6">Please select 2-3 products from the recommendations page.</p>
                <button onClick={() => navigate('/recommendations')} className="btn-primary">
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Back to Recommendations
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-3 text-lg text-gray-600">Comparing products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card max-w-md mx-auto text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Comparison</h2>
                <p className="text-gray-600">{error.message}</p>
            </div>
        );
    }

    const comparison = data?.data;
    const products = comparison?.products || [];
    const recommendations = comparison?.recommendations || [];
    const bestChoiceId = comparison?.best_choice;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => navigate('/recommendations')} className="btn-secondary mb-4">
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Back to Recommendations
                </button>
                <h1 className="text-3xl font-bold mb-2">Product Comparison for {currentProfile?.name}</h1>
                <p className="text-gray-600">Side-by-side analysis with AI insights</p>
            </div>

            {/* AI Summary */}
            {comparison?.comparison_summary && (
                <div className="card bg-primary-50 border border-primary-200 mb-8">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-primary-900 mb-2">AI Recommendation</h3>
                            <p className="text-gray-700 leading-relaxed">{comparison.comparison_summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Table */}
            <div className="card overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-4 font-semibold text-gray-700 w-40">Feature</th>
                            {products.map((product, i) => (
                                <th key={product.id} className="text-left py-4 px-4 min-w-[250px]">
                                    <div className="relative">
                                        {bestChoiceId === product.id && (
                                            <div className="absolute -top-2 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                Best Choice
                                            </div>
                                        )}
                                        <p className="text-sm text-primary-600 font-medium mt-4">{product.brand}</p>
                                        <p className="font-semibold text-gray-900">{product.name}</p>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* Price */}
                        <tr>
                            <td className="py-4 px-4 font-medium text-gray-700">Price</td>
                            {products.map(product => (
                                <td key={product.id} className="py-4 px-4">
                                    <span className="text-xl font-bold">${product.price}</span>
                                    <span className="text-sm text-gray-600 ml-1">/ {product.price_unit}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Match Score */}
                        <tr className="bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-700">Match Score</td>
                            {recommendations.map(rec => (
                                <td key={rec.product.id} className="py-4 px-4">
                                    <div className={`inline-block px-4 py-2 rounded-full font-semibold ${rec.match_score >= 80 ? 'bg-green-100 text-green-700' :
                                            rec.match_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {rec.match_score}%
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Primary Protein */}
                        <tr>
                            <td className="py-4 px-4 font-medium text-gray-700">Primary Protein</td>
                            {products.map(product => (
                                <td key={product.id} className="py-4 px-4 capitalize">
                                    {product.attributes?.primary_protein || 'N/A'}
                                </td>
                            ))}
                        </tr>

                        {/* Protein % */}
                        <tr className="bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-700">Protein Content</td>
                            {products.map(product => (
                                <td key={product.id} className="py-4 px-4">
                                    {product.attributes?.nutrition?.protein_pct}%
                                </td>
                            ))}
                        </tr>

                        {/* Fat % */}
                        <tr>
                            <td className="py-4 px-4 font-medium text-gray-700">Fat Content</td>
                            {products.map(product => (
                                <td key={product.id} className="py-4 px-4">
                                    {product.attributes?.nutrition?.fat_pct}%
                                </td>
                            ))}
                        </tr>

                        {/* Pros */}
                        <tr className="bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-700 align-top">Pros</td>
                            {recommendations.map(rec => (
                                <td key={rec.product.id} className="py-4 px-4">
                                    <ul className="space-y-2">
                                        {rec.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>

                        {/* Cons */}
                        <tr>
                            <td className="py-4 px-4 font-medium text-gray-700 align-top">Considerations</td>
                            {recommendations.map(rec => (
                                <td key={rec.product.id} className="py-4 px-4">
                                    <ul className="space-y-2">
                                        {rec.cons.map((con, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-gray-400 mt-0.5">•</span>
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-center gap-4">
                <button onClick={clearSelection} className="btn-secondary">
                    Clear Selection
                </button>
                <button onClick={() => navigate('/recommendations')} className="btn-primary">
                    View All Recommendations
                </button>
            </div>
        </div>
    );
}
