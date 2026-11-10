import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, AlertCircle, User, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please verify credentials.'
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
            Portal Authentication
          </span>
          <h1 className="font-display text-2xl font-black text-navy-950 tracking-tight mt-1">
            Sign In to InsureApp
          </h1>
          <p className="text-xs text-navy-700 mt-0.5">
            Access your customer portfolio or administrative underwriting operations.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Shortcut Box */}
        <div className="mb-5 p-3.5 bg-cream-100 border border-cream-300 rounded-lg">
          <span className="font-mono text-[10px] font-bold text-navy-700 uppercase tracking-wider block mb-2">
            Evaluation Quick-Fill Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer@insure.com', 'customer123')}
              className="p-2.5 text-left bg-cream-50 border border-cream-300 hover:border-navy-400 rounded-md text-xs transition-colors shadow-2xs"
            >
              <span className="block font-display font-bold text-navy-950">Ankit (Customer)</span>
              <span className="text-[10px] font-mono text-navy-600 block mt-0.5">customer@insure.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@insure.com', 'admin123')}
              className="p-2.5 text-left bg-cream-50 border border-cream-300 hover:border-navy-400 rounded-md text-xs transition-colors shadow-2xs"
            >
              <span className="block font-display font-bold text-navy-950">Staff Underwriter</span>
              <span className="text-[10px] font-mono text-navy-600 block mt-0.5">admin@insure.com</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-800 text-xs mb-4 bg-rose-50 p-2.5 rounded-md border border-rose-200 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. customer@insure.com"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2.5 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-bold text-navy-950 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2.5 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-xs font-display font-bold text-cream-50 bg-navy-950 hover:bg-navy-850 active:scale-98 transition-all shadow-md disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-cream-200" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-cream-200 text-center text-xs text-navy-700">
          <span>New policyholder? </span>
          <Link to="/register" className="font-display font-bold text-navy-950 hover:underline">
            Register Customer Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
