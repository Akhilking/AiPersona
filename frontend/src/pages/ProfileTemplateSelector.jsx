import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dog, Cat, Baby, User, ArrowRight, Sparkles } from 'lucide-react';
import { templatesAPI } from '../services/api';

const CATEGORY_ICONS = {
    dog: Dog,
    cat: Cat,
    baby: Baby,
    human: User,
};

export default function ProfileTemplateSelector() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetch all templates
    const { data: templates = {} } = useQuery({
        queryKey: ['profile-templates'],
        queryFn: async () => {
            const response = await templatesAPI.getAll();
            return response.data;
        },
    });

    const categories = Object.keys(templates);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handlePresetSelect = (preset) => {
        // Navigate to profile builder with preset data
        navigate('/profile/new', { state: { preset: preset.defaults } });
    };

    const handleCreateCustom = () => {
        // Navigate to empty profile builder
        navigate('/profile/new', { state: { category: selectedCategory } });
    };

    if (!selectedCategory) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Create a Profile
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose a category to get started with personalized recommendations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((categoryKey) => {
                        const category = templates[categoryKey];
                        const Icon = CATEGORY_ICONS[categoryKey] || User;

                        return (
                            <button
                                key={categoryKey}
                                onClick={() => handleCategorySelect(categoryKey)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center group border-2 border-transparent hover:border-primary-500"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-4 group-hover:bg-primary-100 transition">
                                    <Icon className="w-10 h-10 text-primary-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {category.icon} {category.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {category.presets?.length || 0} preset templates available
                                </p>
                                <div className="flex items-center justify-center text-primary-600 font-medium">
                                    Select
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Show presets for selected category
    const categoryData = templates[selectedCategory];
    const Icon = CATEGORY_ICONS[selectedCategory];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => setSelectedCategory(null)}
                className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
                ← Back to categories
            </button>

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {categoryData.icon} {categoryData.name}
                </h1>
                <p className="text-lg text-gray-600">
                    Choose a preset template or create a custom profile
                </p>
            </div>

            {/* Preset Templates */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categoryData.presets?.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-primary-500 group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition">
                                {preset.name}
                            </h3>
                            <Sparkles className="w-5 h-5 text-primary-500" />
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            {preset.description}
                        </p>

                        {/* Preview Details */}
                        <div className="space-y-2 text-sm text-gray-700">
                            {preset.defaults.age_years && (
                                <div>Age: {preset.defaults.age_years} years</div>
                            )}
                            {preset.defaults.allergies?.length > 0 && (
                                <div>Allergies: {preset.defaults.allergies.join(', ')}</div>
                            )}
                            {preset.defaults.health_conditions?.length > 0 && (
                                <div>Health: {preset.defaults.health_conditions.join(', ')}</div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-primary-600 font-medium">Use this template</span>
                            <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition" />
                        </div>
                    </button>
                ))}

                {/* Custom Profile Option */}
                <button
                    onClick={handleCreateCustom}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-dashed border-primary-300 hover:border-primary-500 group"
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Custom Profile
                        </h3>
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                            +
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Start from scratch and customize every detail
                    </p>
                    <div className="mt-4 pt-4 border-t border-primary-200 flex items-center justify-between">
                        <span className="text-sm text-primary-600 font-medium">Create custom</span>
                        <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition" />
                    </div>
                </button>
            </div>
        </div>
    );
}