import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (token, user) => set({
                token,
                user,
                isAuthenticated: true
            }),

            logout: () => {
                // Clear profile store
                useProfileStore.getState().clearProfile();

                // Clear localStorage
                localStorage.removeItem('profile-storage');
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('cart-storage');

                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                });
            },

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

// Profile Store
export const useProfileStore = create(
    persist(
        (set) => ({
            currentProfile: null,
            profiles: [],
            userId: null,

            setCurrentProfile: (profile) => set({ currentProfile: profile }),

            setProfiles: (profiles, userId) => set({
                profiles,
                userId
            }),

            addProfile: (profile) => set((state) => ({
                profiles: [...state.profiles, profile]
            })),

            clearProfile: () => set({
                currentProfile: null,
                profiles: [],
                userId: null
            }),
        }),
        {
            name: 'profile-storage',
        }
    )
);

// Comparison Store - Updated with 4 product limit
export const useComparisonStore = create((set) => ({
    selectedProducts: [],

    addProduct: (product) =>
        set((state) => {
            // Max 4 products
            if (state.selectedProducts.length >= 4) return state;
            // No duplicates
            if (state.selectedProducts.find(p => p.id === product.id)) return state;
            return { selectedProducts: [...state.selectedProducts, product] };
        }),

    removeProduct: (productId) =>
        set((state) => ({
            selectedProducts: state.selectedProducts.filter(p => p.id !== productId)
        })),

    clearSelection: () => set({ selectedProducts: [] }),

    isSelected: (productId) => (state) =>
        state.selectedProducts.some(p => p.id === productId),
}));

// Cart Store - One cart for all profiles
export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [], // { product, quantity, profileId, profileName }

            addToCart: (product, profileId, profileName, quantity = 1) =>
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        item => item.product.id === product.id && item.profileId === profileId
                    );

                    if (existingIndex >= 0) {
                        const updatedItems = [...state.items];
                        updatedItems[existingIndex].quantity += quantity;
                        return { items: updatedItems };
                    }

                    return {
                        items: [...state.items, { product, quantity, profileId, profileName }]
                    };
                }),

            updateQuantity: (productId, profileId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                item => !(item.product.id === productId && item.profileId === profileId)
                            )
                        };
                    }

                    return {
                        items: state.items.map(item =>
                            item.product.id === productId && item.profileId === profileId
                                ? { ...item, quantity }
                                : item
                        )
                    };
                }),

            removeFromCart: (productId, profileId) =>
                set((state) => ({
                    items: state.items.filter(
                        item => !(item.product.id === productId && item.profileId === profileId)
                    )
                })),

            clearCart: () => set({ items: [] }),

            getCartTotal: () => {
                const state = get();
                return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            },

            getCartCount: () => {
                const state = get();
                return state.items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

// Wishlist Store
export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [], // Array of product IDs in wishlist

            addToWishlist: (productId) =>
                set((state) => {
                    const productIdStr = String(productId);
                    // Check if already exists (compare as strings)
                    if (state.items.some(id => String(id) === productIdStr)) {
                        return state;
                    }
                    return { items: [...state.items, productIdStr] };
                }),

            removeFromWishlist: (productId) =>
                set((state) => {
                    const productIdStr = String(productId);
                    return {
                        items: state.items.filter(id => String(id) !== productIdStr)
                    };
                }),

            toggleWishlist: (productId) =>
                set((state) => {
                    const productIdStr = String(productId);
                    if (state.items.some(id => String(id) === productIdStr)) {
                        return { items: state.items.filter(id => String(id) !== productIdStr) };
                    }
                    return { items: [...state.items, productIdStr] };
                }),

            isInWishlist: (productId) => {
                const state = get();
                const productIdStr = String(productId);
                return state.items.some(id => String(id) === productIdStr);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);

// Recently Viewed Store
export const useRecentlyViewedStore = create(
    persist(
        (set, get) => ({
            items: [], // { product, viewedAt }
            maxItems: 20,

            addRecentlyViewed: (product) =>
                set((state) => {
                    // Remove if already exists
                    const filtered = state.items.filter(item => item.product.id !== product.id);

                    // Add to beginning
                    const newItems = [
                        { product, viewedAt: new Date().toISOString() },
                        ...filtered
                    ];

                    // Keep only maxItems
                    return {
                        items: newItems.slice(0, state.maxItems)
                    };
                }),

            clearRecentlyViewed: () => set({ items: [] }),

            getRecentItems: (limit = 10) => {
                const state = get();
                return state.items.slice(0, limit);
            }
        }),
        {
            name: 'recently-viewed-storage',
        }
    )
);