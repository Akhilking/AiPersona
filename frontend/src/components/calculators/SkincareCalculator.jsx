import { useState } from 'react';
import { Sparkles, Sun, Moon, Calendar, CheckCircle } from 'lucide-react';

export default function SkincareCalculator({ profile }) {
    const [age, setAge] = useState(profile?.age_years || '');
    const [skinType, setSkinType] = useState('combination');
    const [concerns, setConcerns] = useState([]);
    const [climate, setClimate] = useState('moderate');
    const [budget, setBudget] = useState('mid');
    const [results, setResults] = useState(null);

    const toggleConcern = (concern) => {
        setConcerns(prev =>
            prev.includes(concern)
                ? prev.filter(c => c !== concern)
                : [...prev, concern]
        );
    };

    const calculate = () => {
        if (!age) return;

        const routine = {
            morning: [],
            evening: [],
            weekly: [],
            timeline: ''
        };

        // Morning routine (basic)
        routine.morning = [
            { step: 1, name: 'Gentle Cleanser', why: 'Remove overnight oil and debris' },
            { step: 2, name: 'Toner', why: 'Balance pH and prep skin' },
        ];

        // Age-specific products
        if (age >= 25) {
            routine.morning.push({ step: 3, name: 'Vitamin C Serum', why: 'Brightening and antioxidant protection' });
        }
        if (age >= 30) {
            routine.morning.push({ step: 4, name: 'Eye Cream', why: 'Prevent fine lines and dark circles' });
        }

        // Skin type specific
        if (skinType === 'dry') {
            routine.morning.push({ step: 5, name: 'Hyaluronic Acid Serum', why: 'Deep hydration' });
            routine.morning.push({ step: 6, name: 'Rich Moisturizer', why: 'Lock in moisture' });
        } else if (skinType === 'oily') {
            routine.morning.push({ step: 5, name: 'Oil-Free Moisturizer', why: 'Lightweight hydration' });
        } else if (skinType === 'combination') {
            routine.morning.push({ step: 5, name: 'Gel Moisturizer', why: 'Balanced hydration' });
        } else {
            routine.morning.push({ step: 5, name: 'Fragrance-Free Moisturizer', why: 'Gentle hydration for sensitive skin' });
        }

        routine.morning.push({ step: 7, name: 'SPF 30+ Sunscreen', why: 'UV protection (MOST IMPORTANT)' });

        // Evening routine
        routine.evening = [
            { step: 1, name: 'Oil Cleanser / Makeup Remover', why: 'Remove makeup and sunscreen' },
            { step: 2, name: 'Water-Based Cleanser', why: 'Deep clean (double cleanse)' },
            { step: 3, name: 'Toner', why: 'Prep for treatments' },
        ];

        // Concern-specific treatments
        if (concerns.includes('acne')) {
            routine.evening.push({ step: 4, name: 'Salicylic Acid or Benzoyl Peroxide', why: 'Treat acne' });
        }
        if (concerns.includes('aging') || age >= 25) {
            routine.evening.push({ step: 4, name: 'Retinol (start 2x/week)', why: 'Anti-aging, cell turnover' });
        }
        if (concerns.includes('hyperpigmentation')) {
            routine.evening.push({ step: 4, name: 'Niacinamide', why: 'Fade dark spots' });
        }
        if (concerns.includes('redness')) {
            routine.evening.push({ step: 4, name: 'Centella or Azelaic Acid', why: 'Calm inflammation' });
        }

        routine.evening.push({ step: 5, name: 'Moisturizer', why: 'Night recovery' });

        if (skinType === 'dry' || climate === 'dry') {
            routine.evening.push({ step: 6, name: 'Facial Oil', why: 'Extra nourishment' });
        }

        // Weekly treatments
        routine.weekly = [
            { name: 'Exfoliation (AHA/BHA)', frequency: '2x per week', why: 'Remove dead skin cells' },
            { name: 'Sheet Mask or Clay Mask', frequency: '1-2x per week', why: 'Deep treatment' },
        ];

        // Results timeline
        if (concerns.length > 0) {
            routine.timeline = "4-6 weeks for initial results, 12 weeks for significant improvement";
        } else {
            routine.timeline = "2-4 weeks to see improved skin texture and glow";
        }

        setResults(routine);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Skincare Routine Builder</h3>
                    <p className="text-sm text-gray-600">Get personalized skincare recommendations</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter age"
                            min="13"
                            max="100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Type *</label>
                        <select
                            value={skinType}
                            onChange={(e) => setSkinType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="dry">🏜️ Dry (tight, flaky)</option>
                            <option value="oily">💧 Oily (shiny, large pores)</option>
                            <option value="combination">⚖️ Combination (oily T-zone)</option>
                            <option value="sensitive">🌸 Sensitive (easily irritated)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Skin Concerns (select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['acne', 'aging', 'hyperpigmentation', 'redness', 'dullness', 'large_pores'].map((concern) => (
                            <button
                                key={concern}
                                type="button"
                                onClick={() => toggleConcern(concern)}
                                className={`px-4 py-3 rounded-lg font-medium text-sm transition ${concerns.includes(concern)
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {concern.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Climate *</label>
                        <select
                            value={climate}
                            onChange={(e) => setClimate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="humid">🌧️ Humid</option>
                            <option value="moderate">☁️ Moderate</option>
                            <option value="dry">☀️ Dry/Desert</option>
                            <option value="cold">❄️ Cold/Winter</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Budget *</label>
                        <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="budget">💰 Budget ($50-100/month)</option>
                            <option value="mid">💎 Mid-Range ($100-200/month)</option>
                            <option value="luxury">👑 Luxury ($200+/month)</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={!age}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
                Generate My Routine
            </button>

            {results && (
                <div className="space-y-6 animate-fade-in">
                    {/* Morning Routine */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Sun className="w-6 h-6 text-yellow-600" />
                            <h4 className="text-lg font-bold text-gray-900">Morning Routine</h4>
                        </div>
                        <div className="space-y-3">
                            {results.morning.map((product, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 flex gap-4">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold text-yellow-700 text-sm">{product.step}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                                        <p className="text-gray-600 text-xs mt-1">{product.why}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Evening Routine */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Moon className="w-6 h-6 text-indigo-600" />
                            <h4 className="text-lg font-bold text-gray-900">Evening Routine</h4>
                        </div>
                        <div className="space-y-3">
                            {results.evening.map((product, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold text-indigo-700 text-sm">{product.step}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                                        <p className="text-gray-600 text-xs mt-1">{product.why}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Treatments */}
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-6 h-6 text-green-600" />
                            <h4 className="text-lg font-bold text-gray-900">Weekly Treatments</h4>
                        </div>
                        <div className="space-y-3">
                            {results.weekly.map((treatment, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-gray-900 text-sm">{treatment.name}</p>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            {treatment.frequency}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-xs">{treatment.why}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex gap-3">
                            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-blue-900 text-sm mb-2">⏰ Expected Results:</p>
                                <p className="text-blue-800 text-sm">{results.timeline}</p>
                                <p className="text-blue-700 text-xs mt-3 italic">
                                    💡 Consistency is key! Stick to your routine daily for best results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}