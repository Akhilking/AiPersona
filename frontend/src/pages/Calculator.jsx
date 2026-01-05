// Calculator.jsx - Enhanced UI
import { useProfileStore } from '../store';
import DogCalorieCalculator from '../components/calculators/DogCalorieCalculator';
import CatHydrationCalculator from '../components/calculators/CatHydrationCalculator';
import BabyFeedingCalculator from '../components/calculators/BabyFeedingCalculator';
import SkincareCalculator from '../components/calculators/SkincareCalculator';
import { Calculator as CalculatorIcon, Dog, Cat, Baby, User } from 'lucide-react';

export default function Calculator() {
    const currentProfile = useProfileStore(state => state.currentProfile);

    const calculators = {
        dog: { component: DogCalorieCalculator, icon: Dog, title: 'Dog Calorie Calculator', color: 'blue' },
        cat: { component: CatHydrationCalculator, icon: Cat, title: 'Cat Hydration Calculator', color: 'purple' },
        baby: { component: BabyFeedingCalculator, icon: Baby, title: 'Baby Feeding Calculator', color: 'pink' },
        human: { component: SkincareCalculator, icon: User, title: 'Skincare Calculator', color: 'green' }
    };

    if (!currentProfile) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <CalculatorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Selected</h2>
                <p className="text-gray-600">Please select a profile to use the calculator.</p>
            </div>
        );
    }

    const calculatorConfig = calculators[currentProfile.profile_category];
    const CalculatorComponent = calculatorConfig?.component;
    const Icon = calculatorConfig?.icon || CalculatorIcon;

    if (!CalculatorComponent) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <CalculatorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculator Not Available</h2>
                <p className="text-gray-600">No calculator available for this profile type.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${calculatorConfig.color}-100 rounded-full mb-4`}>
                    <Icon className={`w-8 h-8 text-${calculatorConfig.color}-600`} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {calculatorConfig.title}
                </h1>
                <p className="text-gray-600">
                    Personalized calculations for <span className="font-semibold text-gray-900">{currentProfile.name}</span>
                </p>
            </div>

            {/* Calculator Component */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <CalculatorComponent profile={currentProfile} />
            </div>
        </div>
    );
}