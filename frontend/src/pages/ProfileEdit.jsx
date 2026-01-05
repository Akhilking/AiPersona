import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, X } from 'lucide-react';
import { profilesAPI } from '../services/api';

export default function ProfileEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const profile = location.state?.profile;

    const [formData, setFormData] = useState({
        name: '',
        age_years: '',
        weight_lbs: '',
        allergies: [],
        health_conditions: [],
        preferences: {}
    });

    const [allergyInput, setAllergyInput] = useState('');
    const [healthInput, setHealthInput] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                age_years: profile.age_years || '',
                weight_lbs: profile.weight_lbs || '',
                allergies: profile.allergies || [],
                health_conditions: profile.health_conditions || [],
                preferences: profile.preferences || {}
            });
        } else {
            navigate('/profiles');
        }
    }, [profile, navigate]);

    const updateMutation = useMutation({
        mutationFn: (data) => profilesAPI.update(profile.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-profiles']);
            navigate('/profiles');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const addAllergy = () => {
        if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim().toLowerCase())) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, allergyInput.trim().toLowerCase()]
            });
            setAllergyInput('');
        }
    };

    const removeAllergy = (allergen) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter(a => a !== allergen)
        });
    };

    const addHealthCondition = () => {
        if (healthInput.trim() && !formData.health_conditions.includes(healthInput.trim().toLowerCase())) {
            setFormData({
                ...formData,
                health_conditions: [...formData.health_conditions, healthInput.trim().toLowerCase()]
            });
            setHealthInput('');
        }
    };

    const removeHealthCondition = (condition) => {
        setFormData({
            ...formData,
            health_conditions: formData.health_conditions.filter(c => c !== condition)
        });
    };

    if (!profile) return null;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <button
                onClick={() => navigate('/profiles')}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Profiles
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                <p className="text-gray-600 mb-8">Update {profile.name}'s information</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter name"
                        />
                    </div>

                    {/* Age and Weight */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Age (years) *
                            </label>
                            <input
                                type="number"
                                required
                                step="0.1"
                                min="0"
                                value={formData.age_years}
                                onChange={(e) => setFormData({ ...formData, age_years: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter age"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Weight (lbs)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.weight_lbs}
                                onChange={(e) => setFormData({ ...formData, weight_lbs: parseFloat(e.target.value) || '' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter weight"
                            />
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Allergies
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={allergyInput}
                                onChange={(e) => setAllergyInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter allergen and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addAllergy}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.allergies.map((allergen) => (
                                <span
                                    key={allergen}
                                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg font-medium flex items-center gap-2"
                                >
                                    {allergen}
                                    <button
                                        type="button"
                                        onClick={() => removeAllergy(allergen)}
                                        className="hover:text-red-900"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Health Conditions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Health Conditions
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={healthInput}
                                onChange={(e) => setHealthInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHealthCondition())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter health condition and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addHealthCondition}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.health_conditions.map((condition) => (
                                <span
                                    key={condition}
                                    className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium flex items-center gap-2 capitalize"
                                >
                                    {condition.replace('_', ' ')}
                                    <button
                                        type="button"
                                        onClick={() => removeHealthCondition(condition)}
                                        className="hover:text-yellow-900"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/profiles')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isLoading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}