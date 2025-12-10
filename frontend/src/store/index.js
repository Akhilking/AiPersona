import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store (NEW)
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (token, user) => set({
                token,
                user,
                isAuthenticated: true
            }),

            logout: () => {
                useProfileStore.getState().clearProfile();
                useProfileStore.getState().setProfiles([]);

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

// Profile Store (UPDATED)
export const useProfileStore = create(
    persist(
        (set) => ({
            currentProfile: null,
            profiles: [],

            setCurrentProfile: (profile) => set({ currentProfile: profile }),
            setProfiles: (profiles) => set({ profiles }),
            addProfile: (profile) => set((state) => ({
                profiles: [...state.profiles, profile]
            })),
            clearProfile: () => set({ currentProfile: null, profiles: [] }),
        }),
        {
            name: 'profile-storage',
        }
    )
);

// Comparison Store (unchanged)
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