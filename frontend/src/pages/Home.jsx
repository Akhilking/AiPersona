import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, Heart, Shield, ArrowRight, Dog, Cat, Baby, User, Star } from 'lucide-react';

const FEATURES = [
    {
        icon: Sparkles,
        title: 'AI-Powered Recommendations',
        description: 'Get personalized product suggestions based on unique profiles for your pets, babies, and family members.',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        icon: Shield,
        title: 'Allergy & Health Filters',
        description: 'Automatically filters out unsafe products based on allergies and health conditions.',
        color: 'from-green-500 to-emerald-600'
    },
    {
        icon: Heart,
        title: 'Multi-Profile Support',
        description: 'Create profiles for all your loved ones - dogs, cats, babies, and adults - all in one place.',
        color: 'from-pink-500 to-rose-600'
    },
    {
        icon: ShoppingBag,
        title: 'Smart Comparison',
        description: 'Compare up to 4 products side-by-side with AI-generated insights and recommendations.',
        color: 'from-purple-500 to-violet-600'
    }
];

const CATEGORIES = [
    {
        icon: Dog,
        name: 'Dogs',
        count: '500+ Products',
        color: 'bg-blue-500',
        image: '🐕'
    },
    {
        icon: Cat,
        name: 'Cats',
        count: '400+ Products',
        color: 'bg-purple-500',
        image: '🐱'
    },
    {
        icon: Baby,
        name: 'Babies',
        count: '300+ Products',
        color: 'bg-pink-500',
        image: '👶'
    },
    {
        icon: User,
        name: 'Adults',
        count: '250+ Products',
        color: 'bg-green-500',
        image: '👤'
    }
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yNCA0MGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                            AI-Powered Shopping<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                                For Everyone You Love
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Create personalized profiles and get smart, safe product recommendations tailored to your pets, babies, and family.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-2xl hover:shadow-xl hover:scale-105 transform duration-200 flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                Start Shopping
                            </button>
                            <button
                                onClick={() => navigate('/profiles')}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
                            >
                                Create Profile
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="mt-16 flex flex-wrap justify-center gap-6">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                                <span className="font-semibold">AI Recommendations</span>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-300" />
                                <span className="font-semibold">Allergy Safe</span>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-300" />
                                <span className="font-semibold">Multi-Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-12">
                        Find products tailored for everyone in your family
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((category) => (
                            <div
                                key={category.name}
                                onClick={() => navigate('/products')}
                                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-2 duration-300"
                            >
                                <div className={`${category.color} h-32 flex items-center justify-center text-6xl relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                                    <span className="relative z-10">{category.image}</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <category.icon className="w-6 h-6" />
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600">{category.count}</p>
                                    <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                                        Browse Products
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Why Choose AI Persona?
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-16">
                        Smart shopping powered by artificial intelligence
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {FEATURES.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                                <div className={`relative inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="relative text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="relative text-gray-600 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Create your first profile and discover personalized recommendations in seconds.
                    </p>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl hover:bg-blue-50 transition shadow-2xl hover:shadow-xl hover:scale-105 transform duration-200 inline-flex items-center gap-3"
                    >
                        Create Your Profile
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </section>
        </div>
    );
}