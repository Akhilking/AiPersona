import { useNavigate } from 'react-router-dom';
import { Dog, Sparkles, Shield, Zap } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
                    <Dog className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    AI-Powered Pet Food Recommendations
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Get personalized dog food suggestions based on your pet's unique profile,
                    allergies, and health conditions. Powered by AI.
                </p>
                <button onClick={() => navigate('/profile')} className="btn-primary text-lg px-8 py-3">
                    Get Started
                </button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 py-16">
                <FeatureCard
                    icon={<Shield className="w-8 h-8 text-primary-600" />}
                    title="Safety First"
                    description="Automatically filters out products with ingredients your pet is allergic to."
                />
                <FeatureCard
                    icon={<Sparkles className="w-8 h-8 text-primary-600" />}
                    title="AI Explanations"
                    description="Get detailed explanations for why each product is suitable for your pet."
                />
                <FeatureCard
                    icon={<Zap className="w-8 h-8 text-primary-600" />}
                    title="Smart Comparisons"
                    description="Compare products side-by-side with AI-powered insights on the best choice."
                />
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-md p-12 my-16">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Step number="1" title="Create Profile" description="Tell us about your dog - age, size, allergies, health conditions" />
                    <Step number="2" title="Get Recommendations" description="AI analyzes 15+ products and filters unsafe options" />
                    <Step number="3" title="Compare & Choose" description="Compare top picks with detailed pros, cons, and explanations" />
                </div>
            </div>

            {/* CTA */}
            <div className="text-center py-16">
                <h2 className="text-3xl font-bold mb-4">Ready to find the perfect food for your dog?</h2>
                <p className="text-gray-600 mb-8">Takes less than 2 minutes to create a profile</p>
                <button onClick={() => navigate('/profile')} className="btn-primary text-lg px-8 py-3">
                    Create Pet Profile
                </button>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function Step({ number, title, description }) {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full text-xl font-bold mb-4">
                {number}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
