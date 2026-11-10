import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  // Show plain loading text while initial auth check completes
  if (loading) {
    return <p className="text-center text-gray-500 py-12">Loading...</p>;
  }

  // Not authenticated: redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch: redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Authorized: render child routes
  return <Outlet />;
};

export default ProtectedRoute;

