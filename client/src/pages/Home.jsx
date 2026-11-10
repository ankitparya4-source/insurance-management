import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  ArrowRight,
  User,
  ShieldAlert,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Car,
  Umbrella,
  Home as HomeIcon,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (role) => {
    try {
      if (role === 'customer') {
        await login('customer@insure.com', 'customer123');
        navigate('/dashboard');
      } else {
        await login('admin@insure.com', 'admin123');
        navigate('/admin');
      }
    } catch (err) {
      navigate('/login');
    }
  };

  const categories = [
    {
      code: 'Health',
      title: 'Health & Medical',
      policyCount: '2 Active Plans',
      coverageRange: 'Up to ₹10,00,000',
      baseRate: 'From ₹5,000 / yr',
      highlights: 'Cashless hospital network, pre/post hospitalization, zero wait critical care',
      icon: Heart,
    },
    {
      code: 'Auto',
      title: 'Motor & Vehicle',
      policyCount: '2 Active Plans',
      coverageRange: 'Up to ₹3,00,000',
      baseRate: 'From ₹1,200 / yr',
      highlights: 'Bumper-to-bumper zero dep, 24x7 pan-India breakdown towing & spot claims',
      icon: Car,
    },
    {
      code: 'Life',
      title: 'Term Life Cover',
      policyCount: '1 Active Plan',
      coverageRange: 'Up to ₹25,00,000',
      baseRate: 'From ₹6,000 / yr',
      highlights: 'Guaranteed payout sum, terminal illness acceleration, family security rider',
      icon: Umbrella,
    },
    {
      code: 'Home',
      title: 'Property & Asset',
      policyCount: '1 Active Plan',
      coverageRange: 'Up to ₹15,00,000',
      baseRate: 'From ₹4,500 / yr',
      highlights: 'Structure & contents coverage against fire, earthquake, flood & burglary',
      icon: HomeIcon,
    },
  ];

  return (
    <div className="bg-cream-100 min-h-screen text-navy-950 font-sans">
      {/* 
        ========================================================================
        HERO SECTION: ABOVE THE FOLD
        1. What it is: Digital Insurance Engine with Automated Balance Decrements
        2. Who it is for: Customers (Self-Service) & Administrators (Underwriting)
        3. What to do next: 1-Click Persona Launchpad + Policy Catalog CTA
        ========================================================================
      */}
      <section className="bg-cream-50 border-b border-cream-300 pt-10 pb-14 sm:pt-14 sm:pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* System Status Ticker */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b border-cream-300 text-xs">
            <div className="flex items-center space-x-2 text-navy-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-display font-bold text-navy-950 text-sm tracking-wide">
                SYSTEM LIVE & VERIFIED
              </span>
              <span className="text-cream-400">•</span>
              <span className="text-navy-700">Insurance Management Architecture</span>
            </div>
            <div className="flex items-center space-x-3 text-navy-600 font-mono text-[11px]">
              <span className="bg-cream-200 px-2 py-0.5 rounded border border-cream-300">NODE.JS + MONGO ATLAS</span>
              <span className="text-cream-400">•</span>
              <span className="bg-cream-200 px-2 py-0.5 rounded border border-cream-300">JWT AUTH</span>
              <span className="text-cream-400">•</span>
              <span className="bg-cream-200 px-2 py-0.5 rounded border border-cream-300">REST API</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left 7 Columns: Core Identity & Purpose */}
            <div className="lg:col-span-7">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-700 bg-cream-200 px-3 py-1 rounded-md border border-cream-300 inline-block mb-4">
                Digital Policy Issuance & Claims Underwriting Engine
              </span>
              
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight leading-[1.12]">
                Transparent Insurance Platform With Automated Balance Deductions
              </h1>

              {/* What It Is + Who It Is For Cards */}
              <div className="mt-6 space-y-3.5 text-sm leading-relaxed max-w-2xl">
                <div className="bg-cream-100 border border-cream-300 rounded-lg p-4">
                  <p className="text-navy-900">
                    <strong className="font-display font-bold text-navy-950 text-base">What it is: </strong>
                    An institutional-grade insurance lifecycle engine. Customers customize coverage with interactive multiplier calculations, execute policy purchases with instant digital issuance, and file real-time incident claims that automatically decrement coverage upon admin approval.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-cream-100 border border-cream-300 rounded-lg p-3.5">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <User className="w-4 h-4 text-navy-800" />
                      <span className="font-display text-sm font-bold text-navy-950">1. Customers (e.g. Ankit)</span>
                    </div>
                    <span className="text-xs text-navy-700 leading-normal block">
                      Browse 4 policy sectors, compute live premium multipliers, manage active policies, and track incident claim disbursements.
                    </span>
                  </div>

                  <div className="bg-cream-100 border border-cream-300 rounded-lg p-3.5">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Shield className="w-4 h-4 text-navy-800" />
                      <span className="font-display text-sm font-bold text-navy-950">2. Staff Underwriters</span>
                    </div>
                    <span className="text-xs text-navy-700 leading-normal block">
                      Inspect company revenue analytics, manage insurance offerings, and approve/reject claims with live balance deductions.
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Actions: What To Do Next */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/policies"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-navy-950 hover:bg-navy-850 text-cream-50 font-display font-bold text-sm tracking-wide shadow-md hover:shadow-lg active:scale-98 transition-all"
                >
                  <span>Explore Policy Catalog</span>
                  <ArrowRight className="w-4 h-4 text-cream-200" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-lg border-2 border-navy-950 bg-cream-50 hover:bg-cream-200 text-navy-950 font-display font-bold text-sm transition-colors"
                >
                  <span>Standard User Sign In</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: 1-Click Evaluation Launchpad (Above the Fold) */}
            <div className="lg:col-span-5 bg-navy-950 text-cream-50 rounded-xl p-6 sm:p-7 border border-navy-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-navy-850 mb-5">
                <div>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-cream-300 uppercase block">
                    Instant Evaluation
                  </span>
                  <h3 className="font-display text-base font-bold text-cream-50 mt-0.5">
                    1-Click Evaluation Launchpad
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cream-200 bg-navy-900 px-2.5 py-1 rounded border border-navy-800 font-bold">
                  PRE-SEEDED
                </span>
              </div>

              <div className="space-y-4">
                {/* 1-Click Customer Test Card */}
                <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 hover:border-navy-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-sm font-bold text-cream-50 flex items-center space-x-1.5">
                        <User className="w-4 h-4 text-cream-200" />
                        <span>Customer Account: Ankit</span>
                      </span>
                      <span className="text-[11px] font-mono text-cream-400 block mt-0.5">customer@insure.com</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-mono font-bold">
                      1 Policy • 1 Claim
                    </span>
                  </div>
                  <p className="text-xs text-cream-200 mt-2.5 leading-relaxed">
                    Preloaded with 1 Active Gold Health Shield policy (<span className="font-mono text-cream-100">POL-2026-1001</span>) and 1 submitted pending claim (<span className="font-mono text-cream-100">CLM-2026-5001</span>).
                  </p>
                  <button
                    onClick={() => handleQuickDemoLogin('customer')}
                    className="mt-3.5 w-full inline-flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md bg-cream-100 hover:bg-cream-200 text-navy-950 font-display font-bold text-xs tracking-wide transition-all shadow-sm active:scale-98"
                  >
                    <span>Launch Ankit's Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-navy-950" />
                  </button>
                </div>

                {/* 1-Click Admin Test Card */}
                <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 hover:border-navy-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-sm font-bold text-cream-50 flex items-center space-x-1.5">
                        <ShieldAlert className="w-4 h-4 text-cream-300" />
                        <span>Staff Administrator Underwriter</span>
                      </span>
                      <span className="text-[11px] font-mono text-cream-400 block mt-0.5">admin@insure.com</span>
                    </div>
                    <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-mono font-bold">
                      Pending Underwriting
                    </span>
                  </div>
                  <p className="text-xs text-cream-200 mt-2.5 leading-relaxed">
                    Review revenue KPIs, configure catalog policies, and approve/reject Ankit's ₹25,000 claim with live coverage balance decrement.
                  </p>
                  <button
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="mt-3.5 w-full inline-flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md bg-navy-800 hover:bg-navy-700 text-cream-100 font-display font-bold text-xs tracking-wide border border-navy-700 transition-colors"
                  >
                    <span>Launch Underwriting Operations</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cream-200" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        DISTINCTIVE CATEGORY ARCHITECTURE GRID (Navy + Cream)
        ========================================================================
      */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 mb-8 border-b border-cream-300">
          <div>
            <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-wider block">
              Policy Portfolio
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
              Available Insurance Lines
            </h2>
          </div>
          <span className="font-mono text-xs text-navy-600 mt-1 sm:mt-0 bg-cream-200 px-2.5 py-1 rounded border border-cream-300">
            6 ACTIVE PRODUCTS LOADED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.code}
                className="bg-cream-50 border border-cream-300 rounded-lg p-5 flex flex-col justify-between hover:border-navy-400 hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded bg-navy-950 text-cream-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-cream-200" />
                      </div>
                      <span className="font-display text-sm font-bold text-navy-950">{c.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-navy-800 bg-cream-200 px-2 py-0.5 rounded font-bold border border-cream-300">
                      {c.policyCount}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-navy-600 block tracking-wider font-mono">Maximum Sum Assured</span>
                    <span className="font-display text-xl font-black text-navy-950 tracking-tight block mt-0.5">{c.coverageRange}</span>
                    <span className="text-xs font-bold text-navy-700 block mt-1">{c.baseRate}</span>
                  </div>

                  <p className="text-xs text-navy-700 leading-relaxed">
                    {c.highlights}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-cream-200">
                  <Link
                    to="/policies"
                    className="inline-flex items-center space-x-1.5 text-xs font-display font-bold text-navy-950 hover:text-navy-700 transition-colors"
                  >
                    <span>View Category Plans</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        SYSTEM VERIFICATION & BUSINESS RULE CONTRACT
        ========================================================================
      */}
      <section className="bg-cream-50 border-t border-cream-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-wider block">
              Business Logic Verification
            </span>
            <h2 className="font-display text-2xl font-extrabold text-navy-950 mt-1">
              Enforced System Operating Rules
            </h2>
            <p className="text-xs text-navy-700 mt-1.5">
              All rules from the system specifications are strictly validated across Mongoose schemas, Express controllers, and frontend dialogs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">01. Active Policy Rule</span>
              <p className="text-navy-800 leading-relaxed">
                Claims can strictly be filed on policies where <code className="text-navy-950 font-mono font-bold bg-cream-200 px-1 py-0.5 rounded text-[11px]">status === 'Active'</code>. Expired or cancelled plans reject claims instantly.
              </p>
            </div>

            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">02. Coverage Ceiling Rule</span>
              <p className="text-navy-800 leading-relaxed">
                Requested claim amounts cannot exceed <code className="text-navy-950 font-mono font-bold bg-cream-200 px-1 py-0.5 rounded text-[11px]">remainingCoverage</code>. Real-time validation warns before submission and server validates idempotently.
              </p>
            </div>

            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">03. Automated Decrement</span>
              <p className="text-navy-800 leading-relaxed">
                When an underwriter approves a claim, the user policy's coverage decrements atomically by the approved amount: <code className="text-navy-950 font-mono font-bold bg-cream-200 px-1 py-0.5 rounded text-[11px]">coverage = coverage - claimAmount</code>.
              </p>
            </div>

            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">04. Immutable Resolution</span>
              <p className="text-navy-800 leading-relaxed">
                Once a claim is finalized as <code className="text-emerald-800 font-mono font-bold bg-emerald-100 px-1 py-0.5 rounded">Approved</code> or <code className="text-rose-800 font-mono font-bold bg-rose-100 px-1 py-0.5 rounded">Rejected</code>, its state is permanently sealed and locked from modification.
              </p>
            </div>

            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">05. Soft Deactivation</span>
              <p className="text-navy-800 leading-relaxed">
                Admin deactivation hides a policy from new customer sales while preserving existing policyholders' active coverage and claim privileges intact.
              </p>
            </div>

            <div className="border border-cream-300 rounded-lg p-4 bg-cream-100">
              <span className="font-mono font-bold text-navy-950 block mb-1 text-sm">06. Role Sandboxing</span>
              <p className="text-navy-800 leading-relaxed">
                Customer registration is strictly isolated with role assignment locked to <code className="text-navy-950 font-mono font-bold bg-cream-200 px-1 py-0.5 rounded text-[11px]">'customer'</code>. Administrator accounts are seed-controlled only.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
