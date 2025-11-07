import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Redux store and persistor
import { store, persistor } from './store/store';

// Redux actions and hooks
import { loadUserFromStorage } from './store/slices/authSlice';
import { useAppDispatch } from './store/hooks';

// Development utilities
import './utils/clearStorage';
import './utils/encryption';

// Components
import Login from './components/LoginRedux';
import Signup from './components/SignupRedux';
import Dashboard from './components/DashboardRedux';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import OAuthCallback from './components/OAuthCallback';
import Chatbot from './components/Chatbot';

/**
 * Inner App component that uses Redux hooks
 * Separated because hooks can only be used inside Provider
 */
function AppContent(): JSX.Element {
  const dispatch = useAppDispatch();

  // Load user from localStorage when app starts
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <div className='App'>
        <Routes>
          {/* Root route redirects to login */}
          <Route path='/' element={<Navigate to='/login' replace />} />

          {/* Authentication routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* Protected routes */}
          <Route path='/dashboard' element={<Dashboard />} />

          {/* Password reset routes */}
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          {/* OAuth callback route */}
          <Route path='/oauth/callback' element={<OAuthCallback />} />
        </Routes>

        {/* AI Chatbot - Available on all pages */}
        <Chatbot />
      </div>
    </Router>
  );
}

/**
 * Main App component that provides Redux store to all child components
 */
function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
