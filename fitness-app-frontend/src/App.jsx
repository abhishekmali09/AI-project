import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import { AnimatePresence } from 'framer-motion';

import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ActivityTracker from './pages/ActivityTracker';
import ActivityDetail from './pages/ActivityDetail';
import Statistics from './pages/Statistics';
import AISuggestions from './pages/AISuggestions';
import FoodAnalyzer from './pages/FoodAnalyzer';
import Profile from './pages/Profile';
import LoadingSpinner from './components/ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { token, tokenData } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          />

          {/* Authenticated routes */}
          <Route
            element={
              <ProtectedRoute>
                {authReady ? <AppLayout /> : (
                  <div className="min-h-screen gradient-bg flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activities" element={<ActivityTracker />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/ai-suggestions" element={<AISuggestions />} />
            <Route path="/food-analyzer" element={<FoodAnalyzer />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;