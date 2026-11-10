import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, ArrowRight, Clock, Shield } from 'lucide-react';

const PolicyCard = ({ policy, onBuy }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onBuy(policy);
  };

  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 sm:p-6 flex flex-col justify-between hover:border-navy-400 hover:shadow-card transition-all">
      <div>
        {/* Category & Term Metadata */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-4 text-xs">
          <span className="font-mono font-bold text-navy-950 uppercase tracking-wider text-[11px] bg-cream-200 px-2 py-0.5 rounded border border-cream-300">
            {policy.category} Line
          </span>
          <span className="font-mono text-navy-700 text-[11px] flex items-center">
            <Clock className="w-3 h-3 mr-1 text-navy-500" />
            {policy.durationInMonths} Months Term
          </span>
        </div>

        {/* Policy Title */}
        <h3 className="font-display text-lg font-black text-navy-950 leading-snug">
          {policy.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-navy-700 mt-2 leading-relaxed min-h-[38px]">
          {policy.description || 'Comprehensive policy coverage with cashless hospital and repair networks.'}
        </p>

        {/* Financial Metrics Panel */}
        <div className="mt-5 p-3.5 bg-cream-100 border border-cream-300 rounded-md grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Sum Assured
            </span>
            <span className="font-display text-lg font-black text-navy-950 tracking-tight block mt-0.5">
              ₹{policy.coverageAmount.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
              Cashless Enabled
            </span>
          </div>

          <div className="border-l border-cream-300 pl-3">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Base Premium
            </span>
            <span className="font-display text-lg font-black text-navy-900 tracking-tight block mt-0.5">
              ₹{policy.basePremium.toLocaleString()}
            </span>
            <span className="text-[10px] text-navy-600 block mt-0.5">
              Annual Rate
            </span>
          </div>
        </div>

        {/* Highlights List */}
        {policy.features && policy.features.length > 0 && (
          <div className="mt-5 pt-4 border-t border-cream-200">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block mb-2 font-mono">
              Coverage Highlights
            </span>
            <ul className="space-y-1.5">
              {policy.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-navy-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-navy-950 mr-2 shrink-0 mt-0.5" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <div className="pt-6 mt-6 border-t border-cream-200">
        {user?.role === 'admin' ? (
          <button
            disabled
            className="w-full py-2.5 rounded-md text-xs font-display font-bold bg-cream-200 text-navy-400 cursor-not-allowed border border-cream-300"
          >
            Admin Catalog Mode
          </button>
        ) : (
          <button
            onClick={handleBuyClick}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-xs font-display font-bold text-cream-50 bg-navy-950 hover:bg-navy-850 active:scale-98 transition-all shadow-sm"
          >
            <span>Customize & Purchase</span>
            <ArrowRight className="w-3.5 h-3.5 text-cream-200" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;
