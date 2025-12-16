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
            userId: null, // Track which user owns these profiles

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

// Comparison Store
export const useComparisonStore = create((set) => ({
    selectedProducts: [],

    addProduct: (product) =>
        set((state) => {
            if (state.selectedProducts.length >= 3) return state;
            if (state.selectedProducts.find(p => p.id === product.id)) return state;
            return { selectedProducts: [...state.selectedProducts, product] };
        }),

    removeProduct: (productId) =>
        set((state) => ({
            selectedProducts: state.selectedProducts.filter(p => p.id !== productId)
        })),

    clearSelection: () => set({ selectedProducts: [] }),
}));