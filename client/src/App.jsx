import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import PolicyCatalog from './pages/PolicyCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Open Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/policies" element={<PolicyCatalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute requiredRole="customer" />}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;

