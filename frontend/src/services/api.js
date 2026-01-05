import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const { state } = JSON.parse(authStorage);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        } catch (e) {
            console.error('Error parsing auth token:', e);
        }
    }
    return config;
});

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth and redirect to login
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('profile-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    getMe: () => apiClient.get('/auth/me'),
    getMyProfiles: () => apiClient.get('/auth/me/profiles'),
};

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
    getKeyFeatures: (id) => apiClient.get(`/products/${id}/key-features`),  // ADD THIS LINE
    search: (query, petType) => apiClient.get('/products/search/', { params: { query, pet_type: petType } }),
};

// Recommendations API
export const recommendationsAPI = {
    get: (profileId, limit = 10, forceRefresh = false) =>
        apiClient.post('/recommendations/', { profile_id: profileId, limit, force_refresh: forceRefresh }),
    compare: (profileId, productIds) =>
        apiClient.post('/recommendations/compare', { profile_id: profileId, product_ids: productIds }),
};

// Templates API
export const templatesAPI = {
    getAll: () => apiClient.get('/templates/'),
    getByCategory: (category) => apiClient.get(`/templates/${category}`),
    getPreset: (category, presetId) => apiClient.get(`/templates/${category}/${presetId}`),
};


export default apiClient;