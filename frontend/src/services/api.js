import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Profiles API
export const profilesAPI = {
    create: (data) => apiClient.post('/profiles/', data),
    get: (id) => apiClient.get(`/profiles/${id}`),
    list: () => apiClient.get('/profiles/'),
    update: (id, data) => apiClient.put(`/profiles/${id}`, data),
    delete: (id) => apiClient.delete(`/profiles/${id}`),
};

// Products API
export const productsAPI = {
    list: (params = {}) => apiClient.get('/products/', { params }),
    get: (id) => apiClient.get(`/products/${id}`),
    search: (query, petType) => apiClient.get('/products/search/', { params: { query, pet_type: petType } }),
};

// Recommendations API
export const recommendationsAPI = {
    get: (profileId, limit = 10, forceRefresh = false) =>
        apiClient.post('/recommendations/', { profile_id: profileId, limit, force_refresh: forceRefresh }),
    compare: (profileId, productIds) =>
        apiClient.post('/recommendations/compare', { profile_id: profileId, product_ids: productIds }),
};

export default apiClient;
