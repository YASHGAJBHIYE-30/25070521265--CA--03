import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar/Navbar';
import Toast from './components/Toast/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

import Landing from './pages/Landing/Landing';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Library from './pages/Library/Library';
import BookForm from './pages/BookForm/BookForm';
import BookDetail from './pages/BookDetail/BookDetail';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// Helper for routes accessible only when not authenticated
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Loading..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Toast />
      <main>
        <Routes>
          {/* Guest / Public Routes */}
          <Route
            path="/"
            element={
              <GuestRoute>
                <Landing />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/add"
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute>
                <BookForm isEdit={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute>
                <BookDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
