import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
    persist(
        (set) => ({
            currentProfile: null,
            setCurrentProfile: (profile) => set({ currentProfile: profile }),
            clearProfile: () => set({ currentProfile: null }),
        }),
        {
            name: 'profile-storage',
        }
    )
);

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
