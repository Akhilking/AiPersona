import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dog, Cat, Baby, User, Plus, X } from 'lucide-react';
import { profilesAPI } from '../services/api';
import { useProfileStore } from '../store';

const CATEGORY_CONFIG = {
    dog: {
        icon: Dog,
        name: 'Dog',
        allergies: ['chicken', 'beef', 'dairy', 'corn', 'soy', 'wheat', 'lamb', 'fish'],
        healthConditions: ['sensitive_stomach', 'joint_issues', 'skin_allergies', 'weight_management', 'diabetes'],
    },
    cat: {
        icon: Cat,
        name: 'Cat',
        allergies: ['chicken', 'fish', 'dairy', 'corn', 'soy', 'wheat'],
        healthConditions: ['kidney_health', 'hairball_control', 'urinary_health', 'weight_management', 'diabetes'],
    },
    baby: {
        icon: Baby,
        name: 'Baby',
        allergies: ['dairy', 'soy', 'nuts', 'eggs', 'wheat', 'shellfish'],
        healthConditions: ['colic', 'reflux', 'eczema', 'lactose_intolerance'],
    },
    human: {
        icon: User,
        name: 'Adult',
        allergies: ['dairy', 'gluten', 'nuts', 'soy', 'shellfish', 'eggs'],
        healthConditions: ['diabetes', 'heart_health', 'high_blood_pressure', 'celiac', 'ibs'],
    },
};

export default function ProfileBuilder() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const setCurrentProfile = useProfileStore((state) => state.setCurrentProfile);

    // Get preset data from navigation state
    const preset = location.state?.preset;
    const initialCategory = location.state?.category || preset?.profile_category || 'dog';

    const [formData, setFormData] = useState({
        name: preset?.name || '',
        profile_category: initialCategory,
        age_years: preset?.age_years || '',
        weight_lbs: preset?.weight_lbs || '',
        allergies: preset?.allergies || [],
        health_conditions: preset?.health_conditions || [],
        preferences: preset?.preferences || {},
        profile_data: preset?.profile_data || {},
    });

    const [customAllergen, setCustomAllergen] = useState('');

    const categoryConfig = CATEGORY_CONFIG[formData.profile_category];
    const Icon = categoryConfig.icon;

    const createProfileMutation = useMutation({
        mutationFn: (data) => profilesAPI.create(data),
        onSuccess: (response) => {
            setCurrentProfile(response.data);
            queryClient.invalidateQueries(['my-profiles']);
            queryClient.invalidateQueries(['recommendations']);
            setTimeout(() => navigate('/profiles'), 100);
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, [prefKey]: type === 'checkbox' ? checked : value }
            }));
        } else if (name.startsWith('profile_data.')) {
            const dataKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile_data: { ...prev.profile_data, [dataKey]: type === 'checkbox' ? checked : value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleArrayItem = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }));
    };

    const addCustomAllergen = () => {
        if (customAllergen.trim() && !formData.allergies.includes(customAllergen.trim().toLowerCase())) {
            setFormData(prev => ({
                ...prev,
                allergies: [...prev.allergies, customAllergen.trim().toLowerCase()]
            }));
            setCustomAllergen('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            age_years: parseFloat(formData.age_years),
            weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs) : null,
        };
        createProfileMutation.mutate(submitData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back to Templates */}
            <button
                onClick={() => navigate('/profile/templates')}
                className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
                ← Back to templates
            </button>

            <div className="card">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                        <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Create {categoryConfig.name} Profile
                    </h1>
                    {preset && (
                        <p className="text-sm text-primary-600 mb-2">
                            ✨ Using preset template
                        </p>
                    )}
                    <p className="text-gray-600">
                        Fill in the details to get personalized recommendations
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                                const CategoryIcon = config.icon;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            profile_category: key,
                                            allergies: [],
                                            health_conditions: []
                                        }))}
                                        className={`p-4 rounded-lg border-2 transition ${formData.profile_category === key
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <CategoryIcon className={`w-8 h-8 mx-auto mb-2 ${formData.profile_category === key ? 'text-primary-600' : 'text-gray-400'
                                            }`} />
                                        <span className={`text-sm font-medium ${formData.profile_category === key ? 'text-primary-600' : 'text-gray-600'
                                            }`}>
                                            {config.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder={`e.g., ${formData.profile_category === 'dog' ? 'Buddy' : formData.profile_category === 'cat' ? 'Whiskers' : formData.profile_category === 'baby' ? 'Emma' : 'John'}`}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age (years) *
                            </label>
                            <input
                                type="number"
                                name="age_years"
                                value={formData.age_years}
                                onChange={handleChange}
                                required
                                step="0.1"
                                min="0"
                                max={formData.profile_category === 'human' ? '120' : '30'}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight (lbs)
                            </label>
                            <input
                                type="number"
                                name="weight_lbs"
                                value={formData.weight_lbs}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Allergies & Sensitivities
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {categoryConfig.allergies.map((allergen) => (
                                <button
                                    key={allergen}
                                    type="button"
                                    onClick={() => toggleArrayItem('allergies', allergen)}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${formData.allergies.includes(allergen)
                                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {allergen}
                                </button>
                            ))}
                        </div>

                        {/* Custom Allergen */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customAllergen}
                                onChange={(e) => setCustomAllergen(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergen())}
                                placeholder="Add custom allergen"
                                className="input-field flex-1"
                            />
                            <button
                                type="button"
                                onClick={addCustomAllergen}
                                className="btn-secondary"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Display Custom Allergens */}
                        {formData.allergies.filter(a => !categoryConfig.allergies.includes(a)).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.allergies
                                    .filter(a => !categoryConfig.allergies.includes(a))
                                    .map((allergen) => (
                                        <span
                                            key={allergen}
                                            className="px-3 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2 border-2 border-red-300"
                                        >
                                            {allergen}
                                            <button
                                                type="button"
                                                onClick={() => toggleArrayItem('allergies', allergen)}
                                                className="hover:text-red-900"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Health Conditions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Health Conditions
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categoryConfig.healthConditions.map((condition) => (
                                <button
                                    key={condition}
                                    type="button"
                                    onClick={() => toggleArrayItem('health_conditions', condition)}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${formData.health_conditions.includes(condition)
                                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {condition.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category-Specific Fields */}
                    {formData.profile_category === 'dog' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Preferences
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="preferences.grain_free"
                                        checked={formData.preferences.grain_free || false}
                                        onChange={handleChange}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">Grain-free preferred</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {formData.profile_category === 'baby' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Feeding Type
                            </label>
                            <select
                                name="profile_data.feeding_type"
                                value={formData.profile_data.feeding_type || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select feeding type</option>
                                <option value="breastfed">Breastfed</option>
                                <option value="formula">Formula</option>
                                <option value="mixed">Mixed</option>
                                <option value="specialized_formula">Specialized Formula</option>
                            </select>
                        </div>
                    )}

                    {formData.profile_category === 'human' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dietary Preference
                            </label>
                            <select
                                name="preferences.dietary_preference"
                                value={formData.preferences.dietary_preference || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select dietary preference</option>
                                <option value="omnivore">Omnivore</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="high_protein">High Protein</option>
                                <option value="low_carb">Low Carb</option>
                                <option value="keto">Keto</option>
                            </select>
                        </div>
                    )}

                    {/* Price Range (All Categories) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget Preference
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['budget', 'mid', 'high'].map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        preferences: { ...prev.preferences, price_range: range }
                                    }))}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition ${formData.preferences.price_range === range
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {range === 'budget' ? '$ Budget' : range === 'mid' ? '$$ Mid-Range' : '$$$ Premium'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/profiles')}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createProfileMutation.isPending}
                            className="btn-primary flex-1"
                        >
                            {createProfileMutation.isPending ? 'Creating...' : 'Create Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}