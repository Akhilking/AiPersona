import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { wishlistAPI } from '../services/api';
import { useWishlistStore, useCartStore, useProfileStore } from '../store';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';

export default function Wishlist() {
    const navigate = useNavigate();
    const { items: wishlistIds, removeFromWishlist } = useWishlistStore();
    const { currentProfile } = useProfileStore();
    const addToCart = useCartStore((state) => state.addToCart);

    const { data: wishlistItems = [], isLoading, refetch } = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const response = await wishlistAPI.get();
            return response.data;
        },
    });

    const handleRemove = async (item) => {
        try {
            await wishlistAPI.remove(item.id);
            removeFromWishlist(item.product_id);
            refetch();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = (product) => {
        addToCart({
            product,
            profileId: currentProfile?.id,
            quantity: 1
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="text-center bg-white rounded-2xl shadow-lg p-12">
                    <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
                    <p className="text-gray-600 mb-8">
                        Save products you love and come back to them later!
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p className="text-gray-600">{wishlistItems.length} saved items</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                    >
                        <div
                            onClick={() => navigate(`/product/${item.product_id}`)}
                            className="cursor-pointer"
                        >
                            <div className="relative h-48 bg-gray-100">
                                {item.product.image_url ? (
                                    <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <span className="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full mb-2">
                                    {item.product.brand}
                                </span>
                                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                                    {item.product.name}
                                </h3>
                                <p className="text-2xl font-black text-gray-900">
                                    ${item.product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="px-4 pb-4 flex gap-2">
                            <button
                                onClick={() => handleAddToCart(item.product)}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleRemove(item)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                title="Remove from wishlist"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}