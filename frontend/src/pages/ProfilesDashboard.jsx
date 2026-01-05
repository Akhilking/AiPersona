import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dog, Cat, Baby, User, Plus, Trash2, Edit2, ChevronRight, Sparkles, Filter, Search, TrendingUp } from 'lucide-react';
import { authAPI, profilesAPI } from '../services/api';
import { useProfileStore, useAuthStore } from '../store';

const CATEGORY_CONFIG = {
    dog: { icon: Dog, color: 'blue', label: 'Dog' },
    cat: { icon: Cat, color: 'purple', label: 'Cat' },
    baby: { icon: Baby, color: 'pink', label: 'Baby' },
    human: { icon: User, color: 'green', label: 'Adult' }
};

export default function ProfilesDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const { setCurrentProfile, currentProfile } = useProfileStore();

    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch user's profiles
    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ['my-profiles'],
        queryFn: async () => {
            const response = await authAPI.getMyProfiles();
            return response.data;
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true
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
        navigate('/products');
    };

    const handleEditProfile = (profile, e) => {
        e.stopPropagation();
        navigate('/profile/edit', { state: { profile } });
    };

    const handleCreateNew = () => {
        navigate('/profile/templates');
    };

    const handleDelete = (profileId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this profile?')) {
            deleteMutation.mutate(profileId);
        }
    };

    // Filter and search profiles
    const filteredProfiles = profiles.filter(profile => {
        const matchesCategory = filterCategory === 'all' || profile.profile_category === filterCategory;
        const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calculate stats
    const stats = {
        total: profiles.length,
        dogs: profiles.filter(p => p.profile_category === 'dog').length,
        cats: profiles.filter(p => p.profile_category === 'cat').length,
        babies: profiles.filter(p => p.profile_category === 'baby').length,
        humans: profiles.filter(p => p.profile_category === 'human').length,
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
        <div className="max-w-7xl mx-auto">
            {/* Header with Stats */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            My Profiles
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Manage your personalized profiles and get AI recommendations
                        </p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Profile
                    </button>
                </div>

                {/* Stats Cards */}
                {profiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <StatCard label="Total Profiles" value={stats.total} icon={TrendingUp} color="blue" />
                        <StatCard label="Dogs" value={stats.dogs} icon={Dog} color="blue" />
                        <StatCard label="Cats" value={stats.cats} icon={Cat} color="purple" />
                        <StatCard label="Babies" value={stats.babies} icon={Baby} color="pink" />
                        <StatCard label="Adults" value={stats.humans} icon={User} color="green" />
                    </div>
                )}

                {/* Search and Filter Bar */}
                {profiles.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search profiles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="dog">🐕 Dogs</option>
                                <option value="cat">🐈 Cats</option>
                                <option value="baby">👶 Babies</option>
                                <option value="human">👤 Adults</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Profile Banner */}
            {currentProfile && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">Active Profile: {currentProfile.name}</p>
                                <p className="text-sm text-green-100">Currently using this profile for recommendations</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
                        >
                            View Products →
                        </button>
                    </div>
                </div>
            )}

            {/* Profiles Grid */}
            {filteredProfiles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Profile Card */}
                    <button
                        onClick={handleCreateNew}
                        className="card hover:shadow-xl transition-all border-2 border-dashed border-gray-300 hover:border-primary-500 min-h-[280px] flex flex-col items-center justify-center text-center group"
                    >
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition group-hover:scale-110">
                            <Plus className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Profile</h3>
                        <p className="text-gray-600">Get started with personalized recommendations</p>
                    </button>

                    {/* Existing Profiles */}
                    {filteredProfiles.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            isActive={currentProfile?.id === profile.id}
                            onSelect={() => handleSelectProfile(profile)}
                            onEdit={(e) => handleEditProfile(profile, e)}
                            onDelete={(e) => handleDelete(profile.id, e)}
                        />
                    ))}
                </div>
            ) : (
                /* No Results / Empty State */
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    {profiles.length === 0 ? (
                        <>
                            <Dog className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                No profiles yet
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Create your first profile to get started with AI-powered personalized recommendations
                            </p>
                            <button onClick={handleCreateNew} className="btn-primary inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create Your First Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No profiles found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search or filter criteria
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterCategory('all');
                                }}
                                className="btn-secondary"
                            >
                                Clear Filters
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        pink: 'bg-pink-50 text-pink-600',
        green: 'bg-green-50 text-green-600',
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-600">{label}</p>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ profile, isActive, onSelect, onEdit, onDelete }) {
    const category = profile.profile_category || 'dog';
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.dog;
    const Icon = config.icon;

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 border-blue-200',
        purple: 'bg-purple-100 text-purple-600 border-purple-200',
        pink: 'bg-pink-100 text-pink-600 border-pink-200',
        green: 'bg-green-100 text-green-600 border-green-200',
    };

    return (
        <div
            onClick={onSelect}
            className={`card hover:shadow-xl transition-all cursor-pointer group relative ${isActive ? 'ring-2 ring-green-500 border-green-500' : ''
                }`}
        >
            {/* Active Badge */}
            {isActive && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                    <Sparkles className="w-3 h-3" />
                    Active
                </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition shadow-md hover:shadow-lg"
                    title="Edit profile"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition shadow-md hover:shadow-lg"
                    title="Delete profile"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${colorClasses[config.color]}`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h3>
                    <p className="text-sm text-gray-500 capitalize flex items-center gap-2">
                        <span className="font-medium">{config.label}</span>
                        {profile.age_years && <span>• {profile.age_years} yrs</span>}
                        {profile.weight_lbs && <span>• {profile.weight_lbs} lbs</span>}
                    </p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-3 mb-4">
                {profile.size_category && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 w-16">Size:</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                            {profile.size_category}
                        </span>
                    </div>
                )}

                {profile.allergies && profile.allergies.length > 0 && (
                    <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-gray-500 w-16 pt-1">Allergies:</span>
                        <div className="flex-1 flex flex-wrap gap-1">
                            {profile.allergies.slice(0, 4).map((allergen) => (
                                <span key={allergen} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                                    {allergen}
                                </span>
                            ))}
                            {profile.allergies.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{profile.allergies.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {profile.health_conditions && profile.health_conditions.length > 0 && (
                    <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-gray-500 w-16 pt-1">Health:</span>
                        <div className="flex-1 flex flex-wrap gap-1">
                            {profile.health_conditions.slice(0, 3).map((condition) => (
                                <span key={condition} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs capitalize">
                                    {condition.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                    Created {new Date(profile.created_at).toLocaleDateString()}
                </span>
                <button className="text-primary-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition">
                    Shop Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
}