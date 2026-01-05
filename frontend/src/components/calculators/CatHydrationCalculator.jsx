import { useState } from 'react';
import { Droplets, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function CatHydrationCalculator({ profile }) {
    const [weight, setWeight] = useState(profile?.weight_lbs || '');
    const [dietType, setDietType] = useState('dry');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [healthIssues, setHealthIssues] = useState('none');
    const [results, setResults] = useState(null);

    const calculate = () => {
        if (!weight) return;

        // Base water requirement: 60ml per kg of body weight
        const weightKg = weight * 0.453592;
        const baseWater = weightKg * 60; // ml per day

        // Diet adjustments (wet food contains ~70% water)
        const dietMultipliers = {
            dry: 1.0,      // Needs full water intake
            wet: 0.3,      // Only needs 30% since wet food provides 70%
            mixed: 0.65    // Needs 65% water intake
        };

        // Activity adjustments
        const activityMultipliers = {
            sedentary: 0.9,
            moderate: 1.0,
            active: 1.2
        };

        // Health condition adjustments
        const healthMultipliers = {
            none: 1.0,
            kidney: 1.5,
            urinary: 1.3,
            diabetes: 1.4
        };

        const totalWater = baseWater * dietMultipliers[dietType] * activityMultipliers[activityLevel] * healthMultipliers[healthIssues];

        // Convert to oz (1 oz = 29.5735 ml)
        const waterOz = totalWater / 29.5735;

        // Water from wet food if applicable
        const wetFoodWater = dietType !== 'dry' ? baseWater * 0.7 : 0;

        setResults({
            totalWaterMl: Math.round(totalWater),
            totalWaterOz: waterOz.toFixed(1),
            wetFoodWaterMl: Math.round(wetFoodWater),
            drinkingWaterMl: Math.round(totalWater),
            drinkingWaterOz: waterOz.toFixed(1),
            fountainRefills: Math.ceil(waterOz / 10), // assuming 10oz fountain
            dehydrationRisk: healthIssues !== 'none' || dietType === 'dry' ? 'moderate' : 'low'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Hydration Calculator</h3>
                    <p className="text-sm text-gray-600">Calculate daily water needs for {profile?.name || 'your cat'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs) *</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter weight"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diet Type *</label>
                    <select
                        value={dietType}
                        onChange={(e) => setDietType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                        <option value="dry">🥘 Dry Food Only</option>
                        <option value="wet">🥫 Wet Food Only</option>
                        <option value="mixed">🍽️ Mixed (Wet + Dry)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level *</label>
                    <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                        <option value="sedentary">😴 Sedentary (indoor, low energy)</option>
                        <option value="moderate">🐱 Moderate (typical cat)</option>
                        <option value="active">⚡ Active (playful, outdoor access)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Health Concerns</label>
                    <select
                        value={healthIssues}
                        onChange={(e) => setHealthIssues(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                        <option value="none">✅ None</option>
                        <option value="kidney">🏥 Kidney Issues</option>
                        <option value="urinary">💧 Urinary Problems</option>
                        <option value="diabetes">🩺 Diabetes</option>
                    </select>
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={!weight}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-lg font-bold hover:from-cyan-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
                Calculate Hydration Needs
            </button>

            {results && (
                <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-cyan-200 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">Hydration Results</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${results.dehydrationRisk === 'low' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {results.dehydrationRisk === 'low' ? '✓ Low Risk' : '⚠ Monitor Closely'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <p className="text-xs text-gray-600 mb-1">Total Water Needed</p>
                            <p className="text-2xl font-black text-cyan-600">{results.totalWaterMl}</p>
                            <p className="text-xs text-gray-500">ml/day ({results.totalWaterOz} oz)</p>
                        </div>

                        {dietType !== 'dry' && (
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <p className="text-xs text-gray-600 mb-1">From Wet Food</p>
                                <p className="text-2xl font-black text-green-600">{results.wetFoodWaterMl}</p>
                                <p className="text-xs text-gray-500">ml/day (~70%)</p>
                            </div>
                        )}

                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <p className="text-xs text-gray-600 mb-1">Drinking Water</p>
                            <p className="text-2xl font-black text-blue-600">{results.drinkingWaterMl}</p>
                            <p className="text-xs text-gray-500">ml/day</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <p className="text-xs text-gray-600 mb-1">Fountain Refills</p>
                            <p className="text-2xl font-black text-purple-600">{results.fountainRefills}</p>
                            <p className="text-xs text-gray-500">per day</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                            <div className="flex gap-3">
                                <Droplets className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-blue-900 text-sm mb-2">💡 Hydration Tips:</p>
                                    <ul className="space-y-1 text-sm text-blue-800">
                                        <li>• Use a cat water fountain (encourages drinking)</li>
                                        <li>• Place multiple water bowls around the house</li>
                                        <li>• Add water to dry food if needed</li>
                                        <li>• Clean water bowls daily</li>
                                        {healthIssues !== 'none' && <li>• Monitor intake closely due to health condition</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {dietType === 'dry' && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-yellow-900 text-sm mb-1">Dry Food Alert</p>
                                        <p className="text-yellow-800 text-sm">
                                            Cats on dry food need to drink more water. Consider adding wet food to their diet for better hydration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-green-900 text-sm mb-1">Signs of Proper Hydration:</p>
                                    <p className="text-green-800 text-sm">
                                        Clear urine, moist gums, elastic skin, bright eyes, good energy levels
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}