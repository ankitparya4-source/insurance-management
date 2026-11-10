import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, Compass, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-cream-50/95 backdrop-blur-md border-b border-cream-300 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - League Spartan Display */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-md bg-navy-950 text-cream-100 flex items-center justify-center shadow-sm group-hover:bg-navy-850 transition-colors">
              <Shield className="w-5 h-5 text-cream-200" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-2xl font-black tracking-tight text-navy-950 group-hover:text-navy-700 transition-colors">
                INSURE<span className="text-navy-600">APP</span>
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-cream-200 text-navy-900 border border-cream-300">
                LAB ENGINE
              </span>
            </div>
          </Link>

          {/* Navigation Items - Manrope Font */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-sm font-sans">
            <Link
              to="/policies"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                isActive('/policies')
                  ? 'bg-navy-950 text-cream-50 shadow-2xs'
                  : 'text-navy-900 hover:bg-cream-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Browse Policies</span>
            </Link>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                      isActive('/dashboard')
                        ? 'bg-navy-950 text-cream-50 shadow-2xs'
                        : 'text-navy-900 hover:bg-cream-200'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                      isActive('/admin')
                        ? 'bg-navy-950 text-cream-50 shadow-2xs'
                        : 'text-navy-900 hover:bg-cream-200'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Operations</span>
                  </Link>
                )}

                {/* User Identity Capsule */}
                <div className="flex items-center space-x-2.5 pl-3 ml-2 border-l border-cream-300">
                  <div className="w-8 h-8 rounded-full bg-navy-950 text-cream-100 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-navy-950 leading-tight">{user.name}</p>
                    <span className="font-mono text-[10px] font-semibold text-navy-700 uppercase tracking-wider block">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center space-x-1 text-navy-700 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-md text-xs font-bold transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 pl-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold text-navy-900 hover:bg-cream-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs sm:text-sm font-bold bg-navy-950 text-cream-50 hover:bg-navy-850 shadow-sm active:scale-98 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
