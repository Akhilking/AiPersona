import { Routes, Route, Navigate } from 'react-router-dom';
import { useProfileStore } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfileBuilder from './pages/ProfileBuilder';
import Recommendations from './pages/Recommendations';
import Comparison from './pages/Comparison';

function App() {
    const currentProfile = useProfileStore((state) => state.currentProfile);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<ProfileBuilder />} />
                    <Route
                        path="/recommendations"
                        element={currentProfile ? <Recommendations /> : <Navigate to="/profile" />}
                    />
                    <Route
                        path="/comparison"
                        element={currentProfile ? <Comparison /> : <Navigate to="/profile" />}
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
