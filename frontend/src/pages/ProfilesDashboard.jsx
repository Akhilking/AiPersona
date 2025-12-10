import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dog, Cat, Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { authAPI, profilesAPI } from '../services/api';
import { useProfileStore, useAuthStore } from '../store';

export default function ProfilesDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const { setCurrentProfile, setProfiles } = useProfileStore();

    // Fetch user's profiles
    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ['my-profiles'],
        queryFn: async () => {
            const response = await authAPI.getMyProfiles();
            return response.data;
        },
        refetchOnMount : 'always',
        refetchOnWindowFocus : true
    });

    // Delete profile mutation
    const deleteMutation = useMutation({
        mutationFn: (profileId) => profilesAPI.delete(profileId),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-profiles']);
        },
    });

    const handleSelectProfile = (profile) => {
        setCurrentProfile(profile);
        navigate('/recommendations');
    };

    const handleCreateNew = () => {
        navigate('/profile/new');
    };

    const handleDelete = (profileId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this profile?')) {
            deleteMutation.mutate(profileId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.full_name || user?.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                    Select a profile to get personalized recommendations or create a new one
                </p>
            </div>

            {/* Profiles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Profile Card */}
                <button
                    onClick={handleCreateNew}
                    className="card hover:shadow-xl transition-shadow border-2 border-dashed border-gray-300 hover:border-primary-500 min-h-[240px] flex flex-col items-center justify-center text-center group"
                >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition">
                        <Plus className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Profile</h3>
                    <p className="text-gray-600">For your dog, cat, or baby</p>
                </button>

                {/* Existing Profiles */}
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onSelect={() => handleSelectProfile(profile)}
                        onDelete={(e) => handleDelete(profile.id, e)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {profiles.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-md mt-8">
                    <Dog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No profiles yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Create your first profile to get started with personalized recommendations
                    </p>
                    <button onClick={handleCreateNew} className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Create First Profile
                    </button>
                </div>
            )}
        </div>
    );
}

function ProfileCard({ profile, onSelect, onDelete }) {
    const getIcon = () => {
        if (profile.pet_type === 'dog') return <Dog className="w-8 h-8" />;
        if (profile.pet_type === 'cat') return <Cat className="w-8 h-8" />;
        return <Dog className="w-8 h-8" />;
    };

    const getBgColor = () => {
        if (profile.pet_type === 'dog') return 'bg-blue-100 text-blue-600';
        if (profile.pet_type === 'cat') return 'bg-purple-100 text-purple-600';
        return 'bg-pink-100 text-pink-600';
    };

    return (
        <div
            onClick={onSelect}
            className="card hover:shadow-xl transition-all cursor-pointer group relative"
        >
            {/* Delete Button */}
            <button
                onClick={onDelete}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBgColor()}`}>
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                        {profile.pet_type} • {profile.age_years} years
                        {profile.weight_lbs && ` • ${profile.weight_lbs} lbs`}
                    </p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-2 mb-4">
                {profile.size_category && (
                    <div className="text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium capitalize">{profile.size_category}</span>
                    </div>
                )}

                {profile.allergies && profile.allergies.length > 0 && (
                    <div className="text-sm">
                        <span className="text-gray-600">Allergies:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {profile.allergies.slice(0, 3).map((allergen) => (
                                <span key={allergen} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                                    {allergen}
                                </span>
                            ))}
                            {profile.allergies.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{profile.allergies.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {profile.health_conditions && profile.health_conditions.length > 0 && (
                    <div className="text-sm">
                        <span className="text-gray-600">Health:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {profile.health_conditions.slice(0, 2).map((condition) => (
                                <span key={condition} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs capitalize">
                                    {condition.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* View Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                    {new Date(profile.created_at).toLocaleDateString()}
                </span>
                <button className="text-primary-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition">
                    View Recommendations
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
}