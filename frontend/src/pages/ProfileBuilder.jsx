import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dog, Plus, X } from 'lucide-react';
import { profilesAPI } from '../services/api';
import { useProfileStore } from '../store';

const COMMON_ALLERGIES = ['chicken', 'beef', 'dairy', 'corn', 'soy', 'wheat', 'lamb', 'fish'];
const HEALTH_CONDITIONS = ['sensitive_stomach', 'joint_issues', 'skin_allergies', 'weight_management'];

export default function ProfileBuilder() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setCurrentProfile = useProfileStore((state) => state.setCurrentProfile);

    const [formData, setFormData] = useState({
        name: '',
        pet_type: 'dog',
        age_years: '',
        weight_lbs: '',
        allergies: [],
        health_conditions: [],
        preferences: {
            grain_free: false,
            price_range: 'mid',
        },
    });

    const [customAllergen, setCustomAllergen] = useState('');

    const createProfileMutation = useMutation({
        mutationFn: (data) => profilesAPI.create(data),
        onSuccess: (response) => {
            setCurrentProfile(response.data);
            navigate('/recommendations');
        },
        onSettled: () => {
            queryClient.invalidateQueries(['my-profiles']);
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, [prefKey]: type === 'checkbox' ? checked : value }
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

        try {
            const response = await profilesAPI.create(submitData);
            setCurrentProfile(response.data);
            navigate('/recommendations');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                        <Dog className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Create Pet Profile</h1>
                    <p className="text-gray-600">Tell us about your dog to get personalized recommendations</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pet's Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Buddy"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age (years) *</label>
                            <input
                                type="number"
                                name="age_years"
                                value={formData.age_years}
                                onChange={handleChange}
                                required
                                min="0"
                                max="30"
                                step="0.5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="e.g., 2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                            <input
                                type="number"
                                name="weight_lbs"
                                value={formData.weight_lbs}
                                onChange={handleChange}
                                min="0"
                                max="300"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="e.g., 25"
                            />
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Known Allergies</label>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {COMMON_ALLERGIES.map(allergen => (
                                <button
                                    key={allergen}
                                    type="button"
                                    onClick={() => toggleArrayItem('allergies', allergen)}
                                    className={`px-4 py-2 rounded-lg border transition ${formData.allergies.includes(allergen)
                                        ? 'bg-red-100 border-red-300 text-red-700'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    {allergen}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customAllergen}
                                onChange={(e) => setCustomAllergen(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergen())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Add custom allergen"
                            />
                            <button
                                type="button"
                                onClick={addCustomAllergen}
                                className="btn-secondary"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {formData.allergies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.allergies.map(allergen => (
                                    <span key={allergen} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                        {allergen}
                                        <button type="button" onClick={() => toggleArrayItem('allergies', allergen)}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Health Conditions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Health Conditions</label>
                        <div className="grid grid-cols-2 gap-2">
                            {HEALTH_CONDITIONS.map(condition => (
                                <button
                                    key={condition}
                                    type="button"
                                    onClick={() => toggleArrayItem('health_conditions', condition)}
                                    className={`px-4 py-2 rounded-lg border transition ${formData.health_conditions.includes(condition)
                                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    {condition.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Preferences</label>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="preferences.grain_free"
                                    checked={formData.preferences.grain_free}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-gray-700">Prefer grain-free options</span>
                            </label>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Price Range</label>
                                <select
                                    name="preferences.price_range"
                                    value={formData.preferences.price_range}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="budget">Budget ($)</option>
                                    <option value="mid">Mid-range ($$)</option>
                                    <option value="premium">Premium ($$$)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={createProfileMutation.isPending}
                            className="w-full btn-primary py-3 text-lg"
                        >
                            {createProfileMutation.isPending ? 'Creating Profile...' : 'Get Recommendations'}
                        </button>
                        {createProfileMutation.isError && (
                            <p className="mt-2 text-sm text-red-600">
                                Error creating profile. Please try again.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
