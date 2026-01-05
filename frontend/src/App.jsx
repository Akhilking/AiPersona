// App.jsx - Remove Calculator Route
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useProfileStore } from './store';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProfilesDashboard from './pages/ProfilesDashboard';
import ProfileTemplateSelector from './pages/ProfileTemplateSelector';
import ProfileBuilder from './pages/ProfileBuilder';
import Comparison from './pages/Comparison';
import ProfileEdit from './pages/ProfileEdit';
import ProfileShopping from './pages/ProfileShopping';
import { useEffect } from 'react';

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const currentProfile = useProfileStore((state) => state.currentProfile);
    const location = useLocation();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(['my-profiles']);
    }, [location.pathname, queryClient]);

    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {isAuthenticated && <Navbar />}
            <main className={isAuthenticated ? "container mx-auto px-4 py-8" : ""}>
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/" replace /> : <Login />
                    } />

                    <Route path="/" element={
                        <ProtectedRoute><Home /></ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute><Products /></ProtectedRoute>
                    } />

                    <Route path="/product/:productId" element={
                        <ProtectedRoute><ProductDetail /></ProtectedRoute>
                    } />

                    <Route path="/cart" element={
                        <ProtectedRoute><Cart /></ProtectedRoute>
                    } />

                    <Route path="/profiles" element={
                        <ProtectedRoute><ProfilesDashboard /></ProtectedRoute>
                    } />

                    <Route path="/profile/templates" element={
                        <ProtectedRoute><ProfileTemplateSelector /></ProtectedRoute>
                    } />

                    <Route path="/profile/new" element={
                        <ProtectedRoute><ProfileBuilder /></ProtectedRoute>
                    } />

                    <Route path="/profile/edit" element={
                        <ProtectedRoute><ProfileEdit /></ProtectedRoute>
                    } />

                    <Route path="/comparison" element={
                        <ProtectedRoute>
                            {currentProfile ? <Comparison /> : <Navigate to="/profiles" />}
                        </ProtectedRoute>
                    } />

                    <Route path="/profile/shopping" element={
                        <ProtectedRoute><ProfileShopping /></ProtectedRoute>
                    } />

                    <Route path="/recommendations" element={
                        <Navigate to="/products" replace />
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;