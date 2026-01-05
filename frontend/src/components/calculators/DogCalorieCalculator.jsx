// DogCalorieCalculator.jsx - Show results update on value change
import { useState, useEffect } from 'react';
import { Calculator, Info, TrendingUp, Utensils } from 'lucide-react';

export default function DogCalorieCalculator({ profile }) {
    const [weight, setWeight] = useState(profile?.weight_lbs || '');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [lifeStage, setLifeStage] = useState(profile?.age_years < 1 ? 'puppy' : profile?.age_years > 7 ? 'senior' : 'adult');
    const [goal, setGoal] = useState('maintenance');
    const [results, setResults] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const calculate = () => {
        if (!weight) return;

        // RER (Resting Energy Requirement) = 70 * (weight in kg)^0.75
        const weightKg = weight * 0.453592;
        const RER = 70 * Math.pow(weightKg, 0.75);

        // Activity multipliers
        const multipliers = {
            sedentary: { puppy: 2.0, adult: 1.2, senior: 1.1 },
            moderate: { puppy: 2.5, adult: 1.6, senior: 1.4 },
            active: { puppy: 3.0, adult: 2.0, senior: 1.6 },
            very_active: { puppy: 3.5, adult: 2.5, senior: 1.8 }
        };

        // Goal adjustments
        const goalMultipliers = {
            weight_loss: 0.8,
            maintenance: 1.0,
            weight_gain: 1.2
        };

        const DER = RER * multipliers[activityLevel][lifeStage] * goalMultipliers[goal];

        // Assuming 350 kcal per cup (average dry food)
        const cupsPerDay = DER / 350;
        const mealsPerDay = weight < 20 ? 3 : 2;
        const cupsPerMeal = cupsPerDay / mealsPerDay;
        const treatsCalories = DER * 0.1;

        setResults({
            calories: Math.round(DER),
            cupsPerDay: cupsPerDay.toFixed(2),
            mealsPerDay,
            cupsPerMeal: cupsPerMeal.toFixed(2),
            treatsCalories: Math.round(treatsCalories),
            RER: Math.round(RER)
        });
        setHasChanges(false);
    };

    // Auto-calculate on mount and track changes
    useEffect(() => {
        if (weight && !results) {
            calculate();
        } else if (results) {
            setHasChanges(true);
        }
    }, [weight, activityLevel, lifeStage, goal]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Daily Calorie Calculator</h3>
                    <p className="text-sm text-gray-600">Calculate optimal feeding amounts for {profile?.name || 'your dog'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Weight Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter weight"
                    />
                </div>

                {/* Activity Level */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
                    <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="sedentary">😴 Sedentary (mostly sleeps)</option>
                        <option value="moderate">🚶 Moderate (daily walks)</option>
                        <option value="active">🏃 Active (running, playing)</option>
                        <option value="very_active">⚡ Very Active (working dog)</option>
                    </select>
                </div>

                {/* Life Stage */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Life Stage</label>
                    <select
                        value={lifeStage}
                        onChange={(e) => setLifeStage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="puppy">🐕 Puppy (0-1 year)</option>
                        <option value="adult">🐕‍🦺 Adult (1-7 years)</option>
                        <option value="senior">🦮 Senior (7+ years)</option>
                    </select>
                </div>

                {/* Goal */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Goal</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="weight_loss">📉 Weight Loss</option>
                        <option value="maintenance">⚖️ Maintenance</option>
                        <option value="weight_gain">📈 Weight Gain</option>
                    </select>
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={!weight}
                className={`w-full py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl relative ${!weight
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : hasChanges
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 animate-pulse'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    }`}
            >
                {!weight ? 'Enter Weight to Calculate' : hasChanges ? '🔄 Recalculate with New Values' : '✓ Calculate Nutrition Plan'}
            </button>

            {/* Results */}
            {results && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Daily Nutrition Plan
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Daily Calories</p>
                                <p className="text-2xl font-bold text-blue-600">{results.calories} kcal</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Cups per Day</p>
                                <p className="text-2xl font-bold text-blue-600">{results.cupsPerDay}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Meals per Day</p>
                                <p className="text-2xl font-bold text-blue-600">{results.mealsPerDay}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-green-600" />
                            Feeding Schedule
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Cups per Meal</span>
                                <span className="font-bold text-gray-900">{results.cupsPerMeal} cups</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Treat Allowance</span>
                                <span className="font-bold text-gray-900">{results.treatsCalories} kcal/day</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Resting Energy (RER)</span>
                                <span>{results.RER} kcal</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-semibold mb-1">Important Notes:</p>
                            <ul className="list-disc list-inside space-y-1 text-amber-700">
                                <li>Calculations based on average dry food (350 kcal/cup)</li>
                                <li>Adjust portions based on your dog's body condition</li>
                                <li>Consult your vet for medical conditions or dietary restrictions</li>
                                <li>Fresh water should always be available</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}