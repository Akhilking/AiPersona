import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, CreditCard } from 'lucide-react';
import { useCartStore, useProfileStore } from '../store';

export default function Cart() {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartStore();
    const profiles = useProfileStore((state) => state.profiles);
    const [showCheckoutMessage, setShowCheckoutMessage] = useState(false);

    const total = getCartTotal();
    const tax = total * 0.08; // 8% tax
    const shipping = total > 50 ? 0 : 5.99;
    const grandTotal = total + tax + shipping;

    // Group items by profile
    const itemsByProfile = items.reduce((acc, item) => {
        const key = item.profileId;
        if (!acc[key]) {
            acc[key] = {
                profileId: item.profileId,
                profileName: item.profileName,
                items: []
            };
        }
        acc[key].items.push(item);
        return acc;
    }, {});

    const handleCheckout = () => {
        setShowCheckoutMessage(true);
        setTimeout(() => {
            setShowCheckoutMessage(false);
        }, 3000);
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Start shopping and add products to your cart!
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-primary text-lg px-8 py-4"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Checkout Success Message */}
            {showCheckoutMessage && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-down">
                    <p className="font-bold text-lg">🎉 Checkout Feature Coming Soon!</p>
                    <p className="text-sm text-green-100">Payment integration will be added in the next phase.</p>
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8" />
                    Shopping Cart
                </h1>
                {items.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Clear Cart
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.values(itemsByProfile).map((group) => (
                        <div key={group.profileId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Package className="w-6 h-6" />
                                    Items for {group.profileName}
                                </h2>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-200">
                                {group.items.map((item) => (
                                    <div key={`${item.product.id}-${item.profileId}`} className="p-6 hover:bg-gray-50 transition">
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div
                                                onClick={() => navigate(`/product/${item.product.id}`)}
                                                className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:shadow-md transition"
                                            >
                                                {item.product.image_url ? (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Package className="w-16 h-16 text-gray-300" />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-sm text-primary-600 font-bold uppercase">
                                                            {item.product.brand}
                                                        </p>
                                                        <h3
                                                            onClick={() => navigate(`/product/${item.product.id}`)}
                                                            className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600"
                                                        >
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            ${item.product.price.toFixed(2)} / {item.product.price_unit}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.profileId, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-bold transition"
                                                        >
                                                            <Minus className="w-4 h-4 mx-auto" />
                                                        </button>
                                                        <span className="w-12 text-center font-bold text-lg">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.profileId, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-bold transition"
                                                        >
                                                            <Plus className="w-4 h-4 mx-auto" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.product.id, item.profileId)}
                                                        className="ml-auto text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span className="font-semibold">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax (8%)</span>
                                <span className="font-semibold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span className="font-semibold">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `$${shipping.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                            {total > 0 && total < 50 && (
                                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    Add <strong>${(50 - total).toFixed(2)}</strong> more for free shipping!
                                </p>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-bold text-blue-600">
                                    ${grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-6 h-6" />
                            Proceed to Checkout
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Secure checkout powered by AI Persona
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}