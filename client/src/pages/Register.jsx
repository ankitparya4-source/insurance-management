import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register({ name, email, phone, password });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-cream-100 text-navy-950 font-sans">
      <div className="bg-cream-50 p-7 sm:p-8 rounded-xl border border-cream-300 w-full max-w-md shadow-card">
        {/* Header */}
        <div className="pb-5 mb-5 border-b border-cream-200">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-700 block">
            Customer Onboarding
          </span>
          <h1 className="font-display text-2xl font-black text-navy-950 tracking-tight mt-1">
            Create Customer Account
          </h1>
          <p className="text-xs text-navy-700 mt-0.5">
            Register a self-service account to purchase policies and file claims directly.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-800 text-xs mb-4 bg-rose-50 p-2.5 rounded-md border border-rose-200 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Ankit Sharma"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. ankit@example.com"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Mobile Contact Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. +91 98765 43210"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Create Password (min 6 characters) *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-xs font-display font-bold text-cream-50 bg-navy-950 hover:bg-navy-850 active:scale-98 transition-all shadow-md disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Registering Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-cream-200" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-cream-200 text-center text-xs text-navy-700">
          <span>Already registered? </span>
          <Link to="/login" className="font-display font-bold text-navy-950 hover:underline">
            Sign In to Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
