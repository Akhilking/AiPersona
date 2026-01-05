import { useState } from 'react';
import { Baby, Clock, Milk, TrendingUp, Info } from 'lucide-react';

export default function BabyFeedingCalculator({ profile }) {
    const [ageMonths, setAgeMonths] = useState(Math.floor((profile?.age_years || 0) * 12));
    const [weight, setWeight] = useState(profile?.weight_lbs || '');
    const [feedingType, setFeedingType] = useState('formula');
    const [results, setResults] = useState(null);

    const calculate = () => {
        if (!weight || ageMonths === '') return;

        let feedingsPerDay, ozPerFeeding, totalOzPerDay, scheduleText;

        // Formula feeding guidelines
        if (feedingType === 'formula') {
            // Rule of thumb: 2.5 oz per pound of body weight per day (max 32 oz)
            totalOzPerDay = Math.min(weight * 2.5, 32);

            if (ageMonths < 1) {
                feedingsPerDay = 8;
                ozPerFeeding = totalOzPerDay / feedingsPerDay;
                scheduleText = "Every 2-3 hours (including night)";
            } else if (ageMonths < 3) {
                feedingsPerDay = 6;
                ozPerFeeding = totalOzPerDay / feedingsPerDay;
                scheduleText = "Every 3-4 hours";
            } else if (ageMonths < 6) {
                feedingsPerDay = 5;
                ozPerFeeding = totalOzPerDay / feedingsPerDay;
                scheduleText = "Every 4 hours";
            } else if (ageMonths < 12) {
                feedingsPerDay = 4;
                ozPerFeeding = totalOzPerDay / feedingsPerDay;
                scheduleText = "Every 4-5 hours + starting solids";
            } else {
                feedingsPerDay = 3;
                ozPerFeeding = totalOzPerDay / feedingsPerDay;
                scheduleText = "3 meals + 2 snacks + milk";
            }
        } else {
            // Breastfeeding
            if (ageMonths < 1) {
                feedingsPerDay = 8 - 12;
                scheduleText = "On demand, 8-12 times per day";
            } else if (ageMonths < 6) {
                feedingsPerDay = 6 - 8;
                scheduleText = "Every 2-4 hours during day";
            } else {
                feedingsPerDay = 4 - 6;
                scheduleText = "4-6 times + starting solids";
            }
            totalOzPerDay = "N/A (on demand)";
            ozPerFeeding = "N/A";
        }

        const introduceSolids = ageMonths >= 4 && ageMonths < 6;
        const solidsStarted = ageMonths >= 6;

        setResults({
            feedingsPerDay,
            ozPerFeeding: typeof ozPerFeeding === 'number' ? ozPerFeeding.toFixed(1) : ozPerFeeding,
            totalOzPerDay: typeof totalOzPerDay === 'number' ? Math.round(totalOzPerDay) : totalOzPerDay,
            scheduleText,
            introduceSolids,
            solidsStarted,
            wakeWindows: getWakeWindows(ageMonths)
        });
    };

    const getWakeWindows = (months) => {
        if (months < 1) return "45-60 min";
        if (months < 3) return "1-1.5 hours";
        if (months < 6) return "1.5-2 hours";
        if (months < 9) return "2-3 hours";
        if (months < 12) return "2.5-3.5 hours";
        return "3-4 hours";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Feeding Calculator</h3>
                    <p className="text-sm text-gray-600">Calculate feeding schedule for {profile?.name || 'your baby'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age (months) *</label>
                    <input
                        type="number"
                        value={ageMonths}
                        onChange={(e) => setAgeMonths(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter age in months"
                        min="0"
                        max="24"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs) *</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter weight"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Feeding Type *</label>
                    <select
                        value={feedingType}
                        onChange={(e) => setFeedingType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="breastfeeding">🤱 Breastfeeding</option>
                        <option value="formula">🍼 Formula</option>
                        <option value="mixed">👶 Mixed (Breast + Formula)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={!weight || ageMonths === ''}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-lg font-bold hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
                Calculate Feeding Schedule
            </button>

            {results && (
                <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl p-6 border-2 border-pink-200 animate-fade-in">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Feeding Schedule</h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <p className="text-xs text-gray-600 mb-1">Feedings/Day</p>
                            <p className="text-2xl font-black text-pink-600">{results.feedingsPerDay}</p>
                            <p className="text-xs text-gray-500">times</p>
                        </div>

                        {feedingType !== 'breastfeeding' && (
                            <>
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                    <p className="text-xs text-gray-600 mb-1">Per Feeding</p>
                                    <p className="text-2xl font-black text-blue-600">{results.ozPerFeeding}</p>
                                    <p className="text-xs text-gray-500">oz</p>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-md">
                                    <p className="text-xs text-gray-600 mb-1">Total/Day</p>
                                    <p className="text-2xl font-black text-purple-600">{results.totalOzPerDay}</p>
                                    <p className="text-xs text-gray-500">oz</p>
                                </div>
                            </>
                        )}

                        <div className="bg-white rounded-xl p-4 shadow-md md:col-span-2">
                            <p className="text-xs text-gray-600 mb-1">Wake Windows</p>
                            <p className="text-xl font-black text-green-600">{results.wakeWindows}</p>
                            <p className="text-xs text-gray-500">between naps</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                            <div className="flex gap-3">
                                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-bold text-blue-900 text-sm mb-2">Recommended Schedule:</p>
                                    <p className="text-blue-800 text-sm">{results.scheduleText}</p>
                                </div>
                            </div>
                        </div>

                        {results.introduceSolids && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-yellow-900 text-sm mb-1">Ready for Solids?</p>
                                        <p className="text-yellow-800 text-sm">
                                            At 4-6 months, babies may show signs of readiness for solid foods. Consult your pediatrician!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {results.solidsStarted && (
                            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Milk className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-bold text-green-900 text-sm mb-2">Solid Foods Integration:</p>
                                        <ul className="space-y-1 text-sm text-green-800">
                                            <li>• Start with iron-fortified cereals</li>
                                            <li>• Introduce single-ingredient purees</li>
                                            <li>• Wait 3-5 days between new foods</li>
                                            <li>• Continue milk as primary nutrition</li>
                                            <li>• Aim for 3 meals + 2 snacks by 12 months</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
                            <div className="flex gap-3">
                                <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-purple-900 text-sm mb-2">💡 Feeding Tips:</p>
                                    <ul className="space-y-1 text-sm text-purple-800">
                                        <li>• Feed on demand if breastfeeding</li>
                                        <li>• Look for hunger cues (rooting, sucking on hands)</li>
                                        <li>• Burp after every 2-3 oz or midway through feeding</li>
                                        <li>• Never prop the bottle</li>
                                        <li>• Track wet diapers (6-8 per day is normal)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}