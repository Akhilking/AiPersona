import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Shield, Truck, CreditCard, Dog, Cat, Baby, User } from 'lucide-react';

const faqData = [
    {
        category: 'Getting Started',
        icon: MessageCircle,
        questions: [
            {
                q: 'How do I create a profile?',
                a: 'Click on "Profiles" in the navigation, then select "Create Profile". Choose a template (Dog, Cat, Baby, or Adult) and fill in the details like age, weight, allergies, and health conditions. Our AI will use this information to personalize product recommendations.'
            },
            {
                q: 'Can I create multiple profiles?',
                a: 'Yes! You can create unlimited profiles for different family members or pets. Switch between profiles anytime to see personalized recommendations for each individual.'
            },
            {
                q: 'How does AI personalization work?',
                a: 'Our AI analyzes your profile information (age, weight, allergies, health conditions) and matches it against product attributes like ingredients, nutritional content, and safety warnings to provide tailored recommendations with match scores.'
            }
        ]
    },
    {
        category: 'Products & Shopping',
        icon: Dog,
        questions: [
            {
                q: 'What types of products do you offer?',
                a: 'We offer products for dogs, cats, babies, and adults across categories like food, toys, grooming supplies, health products, skincare, supplements, and wellness items. Each product is carefully curated and analyzed by our AI.'
            },
            {
                q: 'How accurate are the match scores?',
                a: 'Match scores are calculated based on compatibility between your profile and product attributes. A score of 80+ means excellent fit, 60-79 is good, and below 60 may have some incompatibilities. Always check the AI insights for detailed pros and cons.'
            },
            {
                q: 'Can I compare products?',
                a: 'Yes! Select up to 4 products using the compare icon on product cards, then click "Compare Now" to see side-by-side analysis with AI-powered insights tailored to your profile.'
            },
            {
                q: 'What is the wishlist feature?',
                a: 'Click the heart icon on any product to save it to your wishlist for later. Your wishlist syncs across devices and you can access it anytime from the navbar.'
            }
        ]
    },
    {
        category: 'Safety & Allergies',
        icon: Shield,
        questions: [
            {
                q: 'How does allergy filtering work?',
                a: 'When you add allergies to a profile, our AI automatically flags products containing those allergens and provides safety warnings. Products with known allergens will show lower match scores and detailed warnings in the AI insights.'
            },
            {
                q: 'Can I trust the allergy warnings?',
                a: 'Our AI analyzes ingredient lists and allergen data, but you should always verify ingredients yourself and consult with healthcare professionals for serious allergies. We provide tools to help inform your decisions, not replace professional advice.'
            },
            {
                q: 'What if a product has incorrect information?',
                a: 'We strive for accuracy but errors can occur. If you notice incorrect product information, please contact our support team and we\'ll investigate and update the database.'
            }
        ]
    },
    {
        category: 'Orders & Shipping',
        icon: Truck,
        questions: [
            {
                q: 'How do I place an order?',
                a: 'Add products to your cart, review your items, and proceed to checkout. We currently support major payment methods and ship to all 50 US states.'
            },
            {
                q: 'What are the shipping costs?',
                a: 'Shipping costs vary by location and order size. Free shipping is available on orders over $50. Exact shipping costs are calculated at checkout.'
            },
            {
                q: 'How long does delivery take?',
                a: 'Standard shipping takes 5-7 business days. Expedited shipping (2-3 days) and express shipping (1-2 days) are available at checkout for an additional fee.'
            },
            {
                q: 'Can I track my order?',
                a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also view order status in your account dashboard.'
            }
        ]
    },
    {
        category: 'Payments & Returns',
        icon: CreditCard,
        questions: [
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay.'
            },
            {
                q: 'Is my payment information secure?',
                a: 'Yes! We use industry-standard encryption and never store your full credit card information. All payments are processed through secure, PCI-compliant payment processors.'
            },
            {
                q: 'What is your return policy?',
                a: 'We offer 30-day returns on most products. Items must be unused and in original packaging. Perishable items like food may have different return policies. Contact support to initiate a return.'
            },
            {
                q: 'How do refunds work?',
                a: 'Refunds are processed within 5-7 business days after we receive your return. The refund will go back to your original payment method.'
            }
        ]
    },
    {
        category: 'Account & Support',
        icon: User,
        questions: [
            {
                q: 'How do I reset my password?',
                a: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a password reset link. The link is valid for 24 hours.'
            },
            {
                q: 'Can I delete my account?',
                a: 'Yes, you can request account deletion by contacting our support team. Note that this will permanently delete all your profiles, wishlists, and order history.'
            },
            {
                q: 'How do I contact customer support?',
                a: 'Email us at support@aipersona.com or use the contact form on our website. We typically respond within 24 hours on business days.'
            },
            {
                q: 'Do you have a mobile app?',
                a: 'Not yet, but our website is fully mobile-responsive and works great on all devices. A mobile app is in development and coming soon!'
            }
        ]
    }
];

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    // Filter FAQs based on search
    const filteredFAQs = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(qa =>
            qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            qa.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const toggleQuestion = (category, index) => {
        const key = `${category}-${index}`;
        setExpandedQuestion(expandedQuestion === key ? null : key);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Find answers to common questions about AI Persona, our products, and how to get the most out of personalized recommendations.
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* FAQ Categories */}
            {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                    {filteredFAQs.map((category) => {
                        const Icon = category.icon;
                        const isExpanded = expandedCategory === category.category;

                        return (
                            <div key={category.category} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.category)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-6 h-6 text-primary-600" />
                                        <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
                                        <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                                            {category.questions.length}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-6 h-6 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-400" />
                                    )}
                                </button>

                                {/* Questions */}
                                {isExpanded && (
                                    <div className="border-t border-gray-200">
                                        {category.questions.map((qa, index) => {
                                            const isQuestionExpanded = expandedQuestion === `${category.category}-${index}`;

                                            return (
                                                <div key={index} className="border-b border-gray-100 last:border-0">
                                                    <button
                                                        onClick={() => toggleQuestion(category.category, index)}
                                                        className="w-full text-left p-5 hover:bg-gray-50 transition flex items-start justify-between gap-4"
                                                    >
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                                {qa.q}
                                                            </h3>
                                                            {isQuestionExpanded && (
                                                                <p className="text-gray-700 leading-relaxed mt-3">
                                                                    {qa.a}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {isQuestionExpanded ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                        Try different keywords or browse all categories above
                    </p>
                </div>
            )}

            {/* Still have questions? */}
            <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 text-center">
                <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Still have questions?
                </h3>
                <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                    Can't find what you're looking for? Our support team is here to help!
                </p>
                <a
                    href="mailto:support@aipersona.com"
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}