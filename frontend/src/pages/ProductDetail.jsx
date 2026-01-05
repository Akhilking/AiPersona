// ProductDetail.jsx - Redesigned with Tabbed Interface
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowLeft, Star, ShoppingCart, Scale, Check, Heart, Shield,
    TrendingUp, Package, Award, Calculator, Info, Sparkles, MessageSquare
} from 'lucide-react';
import { productsAPI, recommendationsAPI } from '../services/api';
import { useProfileStore, useCartStore, useComparisonStore } from '../store';
import DogCalorieCalculator from '../components/calculators/DogCalorieCalculator';
import CatHydrationCalculator from '../components/calculators/CatHydrationCalculator';
import BabyFeedingCalculator from '../components/calculators/BabyFeedingCalculator';
import SkincareCalculator from '../components/calculators/SkincareCalculator';

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const addToCart = useCartStore((state) => state.addToCart);
    const { selectedProducts, addProduct, removeProduct } = useComparisonStore();
    const [quantity, setQuantity] = useState(1);
    const [showAddedToast, setShowAddedToast] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch product details
    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await productsAPI.get(productId);
            return response.data;
        },
    });

    // Fetch AI recommendation for this product if profile exists
    const { data: recommendationData } = useQuery({
        queryKey: ['product-recommendation', productId, currentProfile?.id],
        queryFn: async () => {
            if (!currentProfile) return null;
            const response = await recommendationsAPI.get(currentProfile.id, 50);
            const rec = response.data.recommendations.find(r => r.product.id === productId);
            return rec;
        },
        enabled: !!currentProfile,
    });

    const recommendation = recommendationData;
    const isInComparison = selectedProducts.some(p => p.id === productId);

    const handleAddToCart = () => {
        if (!currentProfile) {
            navigate('/profiles');
            return;
        }
        addToCart(product, currentProfile.id, currentProfile.name, quantity);
        setShowAddedToast(true);
        setTimeout(() => setShowAddedToast(false), 3000);
    };

    const toggleComparison = () => {
        if (isInComparison) {
            removeProduct(productId);
        } else {
            addProduct(product);
        }
    };

    const calculatorComponents = {
        dog: DogCalorieCalculator,
        cat: CatHydrationCalculator,
        baby: BabyFeedingCalculator,
        human: SkincareCalculator
    };

    const CalculatorComponent = currentProfile ? calculatorComponents[currentProfile.profile_category] : null;

    if (productLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Back to Products
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'specifications', label: 'Specifications', icon: Package },
        { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, enabled: !!currentProfile },
        { id: 'calculator', label: 'Calculator', icon: Calculator, enabled: !!currentProfile },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare }
    ].filter(tab => tab.enabled !== false);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Added to cart toast */}
            {showAddedToast && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-down flex items-center gap-3">
                    <Check className="w-6 h-6" />
                    <div>
                        <p className="font-bold">Added to Cart!</p>
                        <p className="text-sm text-green-100">{quantity} x {product.name}</p>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <button
                onClick={() => navigate('/products')}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Products
            </button>

            {/* Product Header Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="bg-gray-50 p-8 flex items-center justify-center relative">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="max-h-96 w-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center">
                                <Package className="w-32 h-32 text-gray-300" />
                            </div>
                        )}
                        {recommendation && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                                {recommendation.match_score}% Match
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-8">
                        <p className="text-sm text-primary-600 font-bold uppercase tracking-wide mb-2">
                            {product.brand}
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {product.rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">
                                    {product.rating.toFixed(1)} out of 5
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className="text-gray-600 ml-2">/ {product.price_unit}</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-400 font-bold text-lg transition"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 h-10 text-center border border-gray-300 rounded-lg font-semibold"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-400 font-bold text-lg transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={toggleComparison}
                                className={`px-6 py-4 rounded-lg font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg ${isInComparison
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Scale className="w-5 h-5" />
                                {isInComparison ? 'In Comparison' : 'Compare'}
                            </button>
                        </div>

                        {!currentProfile && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                                <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-yellow-800 text-sm">Create a Profile</p>
                                    <p className="text-yellow-700 text-xs">
                                        Get personalized AI recommendations and use calculators by creating a profile.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabbed Content Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition border-b-2 ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600 bg-white'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                                {product.description ? (
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No description available.</p>
                                )}
                            </div>

                            {/* Key Features */}
                            {product.attributes && (
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        Key Features
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {product.attributes.primary_protein && (
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Primary Protein</p>
                                                <p className="font-bold text-gray-900 capitalize text-lg">
                                                    {product.attributes.primary_protein}
                                                </p>
                                            </div>
                                        )}
                                        {product.attributes.nutrition?.protein_pct && (
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Protein</p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {product.attributes.nutrition.protein_pct}%
                                                </p>
                                            </div>
                                        )}
                                        {product.attributes.nutrition?.fat_pct && (
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Fat</p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {product.attributes.nutrition.fat_pct}%
                                                </p>
                                            </div>
                                        )}
                                        {product.attributes.grain_free !== undefined && (
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Grain-Free</p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {product.attributes.grain_free ? '✓ Yes' : '✗ No'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === 'specifications' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                            {product.attributes ? (
                                <div className="space-y-4">
                                    {/* Nutrition Facts */}
                                    {product.attributes.nutrition && (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <h3 className="font-bold text-gray-900">Nutrition Facts</h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {Object.entries(product.attributes.nutrition).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {typeof value === 'number' ? `${value}%` : value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Attributes */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h3 className="font-bold text-gray-900">Product Details</h3>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Brand</span>
                                                    <span className="font-semibold text-gray-900">{product.brand}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Price</span>
                                                    <span className="font-semibold text-gray-900">
                                                        ${product.price.toFixed(2)} / {product.price_unit}
                                                    </span>
                                                </div>
                                                {product.rating > 0 && (
                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-gray-600">Rating</span>
                                                        <span className="font-semibold text-gray-900">
                                                            {product.rating.toFixed(1)} / 5.0
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No specifications available.</p>
                            )}
                        </div>
                    )}

                    {/* AI Insights Tab */}
                    {activeTab === 'ai-insights' && currentProfile && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                AI Recommendation for {currentProfile.name}
                            </h2>
                            {recommendation ? (
                                <div className="space-y-6">
                                    {/* Match Score */}
                                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-gray-900 text-lg">Match Score</h3>
                                            <div className="text-4xl font-bold text-green-600">
                                                {recommendation.match_score}%
                                            </div>
                                        </div>
                                        {recommendation.explanation && (
                                            <p className="text-gray-700 leading-relaxed">
                                                {recommendation.explanation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pros and Cons */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {recommendation.pros && recommendation.pros.length > 0 && (
                                            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                                                <h3 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
                                                    <Check className="w-5 h-5" />
                                                    Why This Works
                                                </h3>
                                                <ul className="space-y-3">
                                                    {recommendation.pros.map((pro, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700">{pro}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {recommendation.cons && recommendation.cons.length > 0 && (
                                            <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                                                <h3 className="font-bold text-orange-800 mb-4 text-lg flex items-center gap-2">
                                                    <Info className="w-5 h-5" />
                                                    Considerations
                                                </h3>
                                                <ul className="space-y-3">
                                                    {recommendation.cons.map((con, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <span className="text-orange-600 text-xl leading-none">•</span>
                                                            <span className="text-gray-700">{con}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Safety Warning */}
                                    {!recommendation.is_safe && (
                                        <div className="p-6 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                                            <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="font-bold text-red-800 text-lg mb-2">Safety Warning</h3>
                                                <p className="text-red-700">
                                                    This product may not be suitable for {currentProfile.name} due to known allergies or health conditions. Please consult with a professional before purchasing.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">No AI recommendation available for this product.</p>
                                    <p className="text-gray-500 text-sm mt-1">Browse our recommended products page to see personalized matches.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Calculator Tab */}
                    {activeTab === 'calculator' && currentProfile && CalculatorComponent && (
                        <div className="animate-fade-in">
                            <CalculatorComponent profile={currentProfile} />
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                            <div className="p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Reviews coming soon!</p>
                                <p className="text-gray-500 text-sm mt-1">We're working on adding customer reviews to help you make better decisions.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}